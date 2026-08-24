import { apiClient } from "./client";

interface LaravelEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function unwrapList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  if (res && typeof res === "object") {
    const outer = res as Record<string, unknown>;
    if (Array.isArray(outer.data)) return outer.data as T[];
    if (outer.data && typeof outer.data === "object") {
      const inner = outer.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data as T[];
    }
  }
  return [];
}

function unwrapObject<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>)) {
    return (res as { data: unknown }).data as T;
  }
  return res as T;
}

function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export interface PatientListItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string | null;
  age: number | null;
  status: "active" | "inactive" | "archived" | null;
  lastVisitAt: string | null;
}

export async function getPatients(clinicSlug: string, search?: string): Promise<PatientListItem[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    `/patients${query}`,
    { clinicSlug }
  );
  const raw = unwrapList<Record<string, unknown>>(res);

  return raw.map((pc) => {
    // ساختار واقعی: هر آیتم یک رکورد PatientClinic است که اطلاعات شخصی
    // بیمار زیر کلید patient قرار دارد (نه برعکس)
    const patient = (pc.patient as Record<string, unknown>) ?? {};
    return {
      id: String(patient.id ?? pc.patient_id ?? ""), // شناسه‌ی خود بیمار، نه رکورد PatientClinic
      firstName: String(patient.first_name ?? ""),
      lastName: String(patient.last_name ?? ""),
      phone: String(patient.phone ?? ""),
      nationalId: (patient.national_id as string | null) ?? null,
      age: calculateAge(patient.birth_date as string | undefined),
      status: (pc.status as PatientListItem["status"]) ?? null,
      lastVisitAt: (pc.last_visit_at as string | null) ?? null,
    };
  });
}

export interface PatientDuplicateCheckResult {
  exists: boolean;
  alreadyInThisClinic: boolean;
  patient: Record<string, unknown> | null;
}

// جایگزین تابع قبلی lookupPatientByPhone که به مسیر نادرست /patients/lookup می‌زد
// (چنین مسیری در اسپک وجود ندارد؛ معادل واقعی همین /patients/duplicates/check است)
export async function checkDuplicatePatient(
  clinicSlug: string,
  params: { phone?: string; nationalId?: string }
): Promise<PatientDuplicateCheckResult> {
  const query = new URLSearchParams();
  if (params.phone) query.set("phone", params.phone);
  if (params.nationalId) query.set("national_id", params.nationalId);

  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    `/patients/duplicates/check?${query.toString()}`,
    { clinicSlug }
  );
  const data = unwrapObject<Record<string, unknown>>(res);

  return {
    exists: Boolean(data.exists),
    alreadyInThisClinic: Boolean(data.already_in_this_clinic),
    patient: (data.patient as Record<string, unknown> | null) ?? null,
  };
}

export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  phone: string;
  national_id?: string;
  birth_date?: string;
  gender?: "male" | "female" | "other";
  emergency_contact?: string;
}

export async function createPatient(clinicSlug: string, payload: CreatePatientPayload) {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
    clinicSlug,
  });
  return unwrapObject<Record<string, unknown>>(res);
}

export interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string | null;
  birthDate: string | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  patientCode: string | null;
  status: "active" | "inactive" | "archived" | null;
  lastVisitAt: string | null;
}

export interface PatientMedicalAlerts {
  hasAllergy: boolean;
  allergyDescription: string | null;
  hasSpecialDisease: boolean;
  specialDiseaseDescription: string | null;
  usesMedicine: boolean;
  medicineDescription: string | null;
}

export async function getPatientDetail(
  clinicSlug: string,
  patientId: string
): Promise<{ patient: PatientDetail; medicalAlerts: PatientMedicalAlerts }> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    `/patients/${patientId}`,
    { clinicSlug }
  );
  const data = unwrapObject<Record<string, unknown>>(res);

    console.log("RAW /patients/{id} response:", JSON.stringify(data, null, 2));

  const patient = (data.patient as Record<string, unknown>) ?? {};
  const clinicRecord = (data.clinic_record as Record<string, unknown>) ?? {};
  const medicalProfile = (data.medical_profile as Record<string, unknown>) ?? {};

  return {
    patient: {
      id: String(patient.id ?? patientId),
      firstName: String(patient.first_name ?? ""),
      lastName: String(patient.last_name ?? ""),
      phone: String(patient.phone ?? ""),
      nationalId: (patient.national_id as string | null) ?? null,
      birthDate: (patient.birth_date as string | null) ?? null,
      age: calculateAge(patient.birth_date as string | undefined),
      gender: (patient.gender as PatientDetail["gender"]) ?? null,
      patientCode: (clinicRecord.patient_code as string | null) ?? null,
      status: (clinicRecord.status as PatientDetail["status"]) ?? null,
      lastVisitAt: (clinicRecord.last_visit_at as string | null) ?? null,
    },
    medicalAlerts: {
      hasAllergy: Boolean(medicalProfile.has_allergy),
      allergyDescription: (medicalProfile.allergy_description as string | null) ?? null,
      hasSpecialDisease: Boolean(medicalProfile.has_special_disease),
      specialDiseaseDescription: (medicalProfile.special_disease_description as string | null) ?? null,
      usesMedicine: Boolean(medicalProfile.uses_medicine),
      medicineDescription: (medicalProfile.medicine_description as string | null) ?? null,
    },
  };
}

// جمع بدهی جاری از فاکتورهای صادرشده/پرداخت‌نشده‌ی این بیمار
export async function getPatientDebt(clinicSlug: string, patientId: string): Promise<number> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    `/invoices?patient_id=${patientId}`,
    { clinicSlug }
  );
  const invoices = unwrapList<Record<string, unknown>>(res);

    console.log("RAW /invoices?patient_id= response:", JSON.stringify(invoices, null, 2));

  return invoices.reduce((sum, inv) => {
    const status = inv.status as string;
    if (status === "cancelled" || status === "draft") return sum;
    const remaining = Number(inv.remaining_amount ?? 0);
    return sum + (Number.isNaN(remaining) ? 0 : remaining);
  }, 0);
}

export interface PatientNextAppointment {
  startTime: string;
  serviceName: string;
}

export async function getPatientNextAppointment(
  clinicSlug: string,
  patientId: string
): Promise<PatientNextAppointment | null> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    `/appointments?patient_id=${patientId}&from=${today}&status=confirmed`,
    { clinicSlug }
  );
  const list = unwrapList<Record<string, unknown>>(res);

  console.log("RAW /appointments?patient_id= response:", JSON.stringify(list, null, 2)); // این خط رو موقت اضافه کن

  if (list.length === 0) return null;

  const sorted = [...list].sort(
    (a, b) => new Date(a.start_time as string).getTime() - new Date(b.start_time as string).getTime()
  );
  const next = sorted[0];
  const service = next.service as Record<string, unknown> | undefined;

  return {
    startTime: String(next.start_time ?? ""),
    serviceName: (service?.name as string | undefined) ?? (next.service_name as string | undefined) ?? "بدون عنوان",
  };
}

export interface PatientSearchResult {
  id: string;
  fullName: string;
  phone: string;
}

export async function searchPatients(clinicSlug: string, query: string): Promise<PatientSearchResult[]> {
  if (!query.trim()) return [];
  const results = await getPatients(clinicSlug, query);
  return results.map((p) => ({
    id: p.id,
    fullName: `${p.firstName} ${p.lastName}`,
    phone: p.phone,
  }));
}