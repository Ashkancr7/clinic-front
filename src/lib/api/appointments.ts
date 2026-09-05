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

export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "cancelled" | "completed" | "no_show";

export interface AppointmentStatusHistory {
  id?: string | number;
  status: AppointmentStatus;
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  changed_by?: {
    id?: number;
    full_name?: string;
  } | null;
  reason?: string | null;
  notes?: string | null;
  from_status?: AppointmentStatus | null;
  to_status?: AppointmentStatus | null;
}

export interface AppointmentPatient {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  national_id?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  phone?: string | null;
  emergency_contact?: string | null;
}

export interface AppointmentDoctor {
  id: number;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  avatar_file_id?: string | null;
}

export interface AppointmentService {
  id: string;
  name: string;
  description?: string | null;
  default_duration_minutes?: number;
  base_price?: string | number;
}

export interface CalendarAppointment {
  id: string;
  startTime: string;
  endTime: string;

  patientId: string | null;
  patientName: string;
  patientPhone: string;

  doctorId: number | null;
  doctorName: string;

  serviceName: string;

  appointmentType: "in_person" | "online" | string;
  status: AppointmentStatus;
  source: string | null;
  notes: string | null;

  cancellationReason?: string | null;

  patient?: AppointmentPatient | null;
  doctor?: AppointmentDoctor | null;
  service?: AppointmentService | null;

  statusHistory?: AppointmentStatusHistory[];
}

function mapAppointment(a: Record<string, unknown>): CalendarAppointment {
  const patient = a.patient as Record<string, unknown> | undefined;
  const service = a.service as Record<string, unknown> | undefined;
  const doctor = (a.doctor ?? a.doctor_user) as Record<string, unknown> | undefined;

  return {
  id: String(a.id ?? ""),
  startTime: String(a.start_time ?? ""),
  endTime: String(a.end_time ?? ""),

  patientId: (a.patient_id as string | null) ?? null,

  patientName:
    patient?.first_name && patient?.last_name
      ? `${patient.first_name} ${patient.last_name}`
      : (a.patient_name as string | undefined) ?? "بیمار",

  patientPhone: (patient?.phone as string | undefined) ?? "",

  serviceName:
    (service?.name as string | undefined) ??
    (a.service_name as string | undefined) ??
    "-",

  doctorId: (a.doctor_user_id as number | null) ?? null,

  doctorName:
    (doctor?.full_name as string | undefined) ??
    (a.doctor_name as string | undefined) ??
    "-",

  appointmentType:
    (a.appointment_type as CalendarAppointment["appointmentType"]) ??
    "in_person",

  status: (a.status as AppointmentStatus) ?? "pending",

  source: (a.source as string | null) ?? null,

  notes: (a.notes as string | null) ?? null,

  cancellationReason:
    (a.cancellation_reason as string | null) ?? null,

  patient: patient
    ? {
        id: String(patient.id ?? ""),
        user_id: (patient.user_id as string | null) ?? null,
        first_name: String(patient.first_name ?? ""),
        last_name: String(patient.last_name ?? ""),
        national_id: (patient.national_id as string | null) ?? null,
        birth_date: (patient.birth_date as string | null) ?? null,
        gender: (patient.gender as string | null) ?? null,
        phone: (patient.phone as string | null) ?? null,
        emergency_contact:
          (patient.emergency_contact as string | null) ?? null,
      }
    : null,

  doctor: doctor
    ? {
        id: Number(doctor.id),
        full_name: String(doctor.full_name ?? ""),
        phone: (doctor.phone as string | null) ?? null,
        email: (doctor.email as string | null) ?? null,
        avatar_file_id:
          (doctor.avatar_file_id as string | null) ?? null,
      }
    : null,

  service: service
    ? {
        id: String(service.id ?? ""),
        name: String(service.name ?? ""),
        description:
          (service.description as string | null) ?? null,
        default_duration_minutes:
          Number(service.default_duration_minutes ?? 0),
        base_price:
          (service.base_price as string | number | undefined) ?? 0,
      }
    : null,

  statusHistory: Array.isArray(a.status_history)
    ? (a.status_history as CalendarAppointment["statusHistory"])
    : [],
};
}

export async function getAppointments(
  clinicSlug: string,
  params: { from?: string; to?: string; doctorUserId?: number; status?: string } = {}
): Promise<CalendarAppointment[]> {
  const query = new URLSearchParams();
  if (params.from) query.set("from", params.from);

  // برخی پیاده‌سازی‌های بک‌اند بازه‌ی [from, to] را با کران بالای منحصر
  // (exclusive) مقایسه می‌کنند؛ برای پوشش کامل بازه‌ی «to»، یک روز به آن اضافه
  // می‌کنیم تا نوبت‌های بعدازظهر/عصرِ همان روز هم داخل بازه قرار بگیرند.
  if (params.to) {
    const toDate = new Date(`${params.to}T00:00:00`);
    toDate.setDate(toDate.getDate() + 1);
    query.set("to", toLocalIsoDate(toDate));
  }

  if (params.doctorUserId) query.set("doctor_user_id", String(params.doctorUserId));
  if (params.status) query.set("status", params.status);

  const url = `/appointments?${query.toString()}`;
  console.log("Requesting appointments URL:", url); // این خط رو موقت اضافه کن

  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(url, {
    clinicSlug,
  });

  console.log("RAW /appointments response:", JSON.stringify(res, null, 2)); // این خط رو موقت اضافه کن

  return unwrapList<Record<string, unknown>>(res).map(mapAppointment);
}

export async function getAppointmentDetail(clinicSlug: string, appointmentId: string): Promise<CalendarAppointment> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    `/appointments/${appointmentId}`,
    { clinicSlug }
  );
  return mapAppointment(unwrapObject<Record<string, unknown>>(res));
}

export interface CreateAppointmentPayload {
  patient_id: string;
  doctor_user_id: number;
  service_id?: string;
  service_option_id?: string;
  appointment_type: "in_person" | "online" | "followup";
  start_time: string;
  end_time: string;
  notes?: string;
}

export async function createAppointment(clinicSlug: string, payload: CreateAppointmentPayload) {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
    clinicSlug,
  });
  return unwrapObject<Record<string, unknown>>(res);
}

export async function rescheduleAppointment(
  clinicSlug: string,
  appointmentId: string,
  payload: { start_time: string; end_time: string; reason?: string }
) {
  return apiClient(`/appointments/${appointmentId}/reschedule`, {
    method: "POST",
    body: JSON.stringify(payload),
    clinicSlug,
  });
}

export async function cancelAppointment(clinicSlug: string, appointmentId: string, reason: string) {
  return apiClient(`/appointments/${appointmentId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
    clinicSlug,
  });
}

export async function completeAppointment(clinicSlug: string, appointmentId: string) {
  return apiClient(`/appointments/${appointmentId}/complete`, { method: "POST", clinicSlug });
}

export async function markNoShow(clinicSlug: string, appointmentId: string) {
  return apiClient(`/appointments/${appointmentId}/no-show`, { method: "POST", clinicSlug });
}

export async function sendAppointmentReminder(clinicSlug: string, appointmentId: string) {
  return apiClient(`/appointments/${appointmentId}/reminders/send`, { method: "POST", clinicSlug });
}

export interface AvailabilitySlot {
  start: string;
  end: string;
}

export async function getAvailability(
  clinicSlug: string,
  params: { doctorUserId: number; date: string; serviceId?: string }
): Promise<AvailabilitySlot[]> {
  const query = new URLSearchParams({ doctor_user_id: String(params.doctorUserId), date: params.date });
  if (params.serviceId) query.set("service_id", params.serviceId);

  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    `/appointments/availability?${query.toString()}`,
    { clinicSlug }
  );

  console.log("RAW /appointments/availability response:", JSON.stringify(res, null, 2)); // ا

  return unwrapList<Record<string, unknown>>(res).map((s) => ({
    start: String(s.start ?? s.start_time ?? ""),
    end: String(s.end ?? s.end_time ?? ""),
  }));
}

// --- پزشکان (از لیست کارکنان، فیلترشده بر اساس نقش) ---
export interface DoctorOption {
  userId: number;
  fullName: string;
}

export async function getDoctors(clinicSlug: string): Promise<DoctorOption[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/clinics/current/staff",
    { clinicSlug }
  );

  console.log("RAW /clinics/current/staff response:", JSON.stringify(res, null, 2)); // این خط رو موقت اضافه کن

  const staff = unwrapList<Record<string, unknown>>(res);

  return staff
    .filter((s) => {
      const role = s.role as Record<string, unknown> | undefined;
      return role?.key === "doctor";
    })
    .map((s) => {
      const user = s.user as Record<string, unknown> | undefined;
      return {
        userId: Number(s.user_id ?? user?.id ?? 0),
        fullName: (user?.full_name as string | undefined) ?? "پزشک",
      };
    });
}

// --- خدمات ---
export interface ServiceOption {
  id: string;
  name: string;
  defaultDurationMinutes: number;
}

export async function getServicesForBooking(clinicSlug: string): Promise<ServiceOption[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>("/services?active=true", {
    clinicSlug,
  });
  return unwrapList<Record<string, unknown>>(res).map((s) => ({
    id: String(s.id ?? ""),
    name: String(s.name ?? ""),
    defaultDurationMinutes: Number(s.default_duration_minutes ?? 30),
  }));
}

export function addMinutesToIso(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

// رشته‌ی ساعت را که ممکن است در چند فرمت مختلف از بک‌اند بیاید، به Date معتبر تبدیل می‌کند:
// - ISO کامل: "2026-08-23T09:00:00"
// - "HH:mm:ss YYYY-MM-DD" یا "YYYY-MM-DD HH:mm:ss" (با فاصله جدا شده)
// - فقط ساعت: "09:00" یا "09:00:00" (که با تاریخ ورودی ترکیب می‌شود)
export function buildDateTime(dateIso: string, time: string): string {
  const trimmed = time.trim();

  if (trimmed.includes("T")) {
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  if (trimmed.includes(" ")) {
    const parts = trimmed.split(" ").filter(Boolean);
    const datePart = parts.find((p) => /^\d{4}-\d{2}-\d{2}$/.test(p));
    const timePart = parts.find((p) => /^\d{2}:\d{2}(:\d{2})?$/.test(p));
    if (datePart && timePart) {
      const normalizedTime = timePart.length === 5 ? `${timePart}:00` : timePart;
      const d = new Date(`${datePart}T${normalizedTime}`);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }

  // فقط ساعت (بدون تاریخ) → با تاریخ ورودی ترکیب می‌شود
  const normalizedTime = trimmed.length === 5 ? `${trimmed}:00` : trimmed;
  const d = new Date(`${dateIso}T${normalizedTime}`);
  if (!Number.isNaN(d.getTime())) return d.toISOString();

  throw new Error(`فرمت ساعت قابل تشخیص نیست: "${time}"`);
}

// برای نمایش تمیز روی دکمه‌ها (فقط ساعت را از رشته‌ی خام استخراج می‌کند)
export function extractTimeLabel(raw: string): string {
  const match = raw.match(/(\d{2}:\d{2})(:\d{2})?/);
  return match ? match[1] : raw;
}

// برخلاف toISOString() که تاریخ را به UTC تبدیل می‌کند (و می‌تواند یک روز
// جابه‌جا شود)، این تابع تاریخ محلی مرورگر را بدون تغییر منطقه‌ی زمانی برمی‌گرداند
export function toLocalIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getLocalHourMinute(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// چون endpoint availability فعلاً نوبت‌های از قبل رزروشده را از لیست کم نمی‌کند،
// این تابع به‌عنوان یک لایه‌ی دفاعی سمت فرانت، اسلات‌هایی که با نوبت فعال
// موجود همان پزشک/روز هم‌زمان هستند را حذف می‌کند
export function filterBookedSlots(
  slots: AvailabilitySlot[],
  existingAppointments: CalendarAppointment[]
): AvailabilitySlot[] {
  const bookedTimes = new Set(
    existingAppointments
      .filter((a) => a.status !== "cancelled" && a.status !== "no_show")
      .map((a) => getLocalHourMinute(a.startTime))
  );

  return slots.filter((s) => !bookedTimes.has(extractTimeLabel(s.start)));
}

export function formatDurationMinutes(startIso: string, endIso: string): number | null {
  if (!startIso || !endIso) return null;
  const diff = (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000;
  return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : null;
}