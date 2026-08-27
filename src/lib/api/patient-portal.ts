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

// --- خلاصه داشبورد بیمار — فرمت واقعی تأیید شده ---
export interface PatientDashboardSummary {
  fullName: string | null;
  completedVisitsCount: number;
  pastAppointmentsCount: number;
  visibleImagesCount: number;
  signedConsentsCount: number;
  nextAppointment: PatientAppointment | null;
}

export async function getPatientDashboardSummary(clinicSlug: string): Promise<PatientDashboardSummary> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    "/patient-portal/dashboard",
    { clinicSlug }
  );
  const data = unwrapObject<Record<string, unknown>>(res);
  const patient = (data.patient as Record<string, unknown>) ?? {};
  const nextAppointmentRaw = data.next_appointment as Record<string, unknown> | null;

  return {
    fullName: (patient.full_name as string | undefined) ?? null,
    completedVisitsCount: Number(data.completed_visits_count ?? 0),
    pastAppointmentsCount: Number(data.past_appointments_count ?? 0),
    visibleImagesCount: Number(data.visible_images_count ?? 0),
    signedConsentsCount: Number(data.signed_consents_count ?? 0),
    nextAppointment: nextAppointmentRaw ? mapPatientAppointment(nextAppointmentRaw) : null,
  };
}

// --- نوبت‌های بیمار ---
export interface PatientAppointment {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  doctorName: string;
  status: string;
}

function mapPatientAppointment(a: Record<string, unknown>): PatientAppointment {
  const service = a.service as Record<string, unknown> | undefined;
  const doctor = (a.doctor ?? a.doctor_user) as Record<string, unknown> | undefined;
  return {
    id: String(a.id ?? ""),
    startTime: String(a.start_time ?? ""),
    endTime: String(a.end_time ?? ""),
    serviceName: (service?.name as string | undefined) ?? "-",
    doctorName: (doctor?.full_name as string | undefined) ?? "-",
    status: String(a.status ?? ""),
  };
}

export async function getPatientAppointments(clinicSlug: string): Promise<PatientAppointment[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/patient-portal/appointments",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map(mapPatientAppointment);
}

// --- تصاویر قبل/بعد مجاز برای نمایش به بیمار ---
export interface PatientGalleryImage {
  id: string;
  title: string;
  createdAt: string | null;
}

export async function getPatientImages(clinicSlug: string): Promise<PatientGalleryImage[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/patient-portal/images",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map((img) => ({
    id: String(img.id ?? ""),
    title: (img.body_area as string | undefined) ?? (img.image_type as string | undefined) ?? "تصویر",
    createdAt: (img.created_at as string | null) ?? null,
  }));
}

// --- رضایت‌نامه‌های امضاشده ---
export interface PatientConsentItem {
  id: string;
  title: string;
  signedAt: string | null;
}

export async function getPatientConsents(clinicSlug: string): Promise<PatientConsentItem[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/patient-portal/consents",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map((c) => {
    const version = c.consent_version as Record<string, unknown> | undefined;
    const template = version?.consent_template as Record<string, unknown> | undefined;
    return {
      id: String(c.id ?? ""),
      title: (template?.title as string | undefined) ?? "رضایت‌نامه",
      signedAt: (c.signed_at as string | null) ?? null,
    };
  });
}