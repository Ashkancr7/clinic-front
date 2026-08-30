import { apiClient } from "./client";

interface LaravelEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function unwrapObject<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in (res as Record<string, unknown>)) {
    return (res as { data: unknown }).data as T;
  }
  return res as T;
}

export interface CurrentClinicUser {
  userId: number | null;
  fullName: string;
  roleKey: "clinic_admin" | "doctor" | "receptionist" | null;
  roleName: string;
}

// فرمت واقعی و تأییدشده‌ی /auth/me: { data: { user: {...}, clinics: [{ id, name, slug,
// pivot: { role_id, access_scope, is_active } }] } }
// نقش فقط به‌صورت role_id عددی می‌آید، نه اسم؛ این mapping بر اساس داده‌های seed
// واقعی که قبلاً از /clinics/current/staff دیده شده استخراج شده است.
const ROLE_ID_TO_KEY: Record<number, CurrentClinicUser["roleKey"]> = {
  2: "clinic_admin",
  3: "doctor",
  4: "receptionist",
};
const ROLE_ID_TO_NAME: Record<number, string> = {
  2: "مدیر کلینیک",
  3: "پزشک",
  4: "منشی / پذیرش",
};

export async function getCurrentClinicUser(clinicSlug: string): Promise<CurrentClinicUser> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>("/auth/me", {
    clinicSlug,
  });
  const data = unwrapObject<Record<string, unknown>>(res);

  const user = (data.user as Record<string, unknown>) ?? {};
  const userId = user.id != null ? Number(user.id) : null;
  const fullName = (user.full_name as string | undefined) ?? "";

  const clinics = (data.clinics as Record<string, unknown>[]) ?? [];
  const currentClinic = clinics.find((c) => c.slug === clinicSlug);
  const pivot = currentClinic?.pivot as Record<string, unknown> | undefined;
  const roleId = pivot?.role_id != null ? Number(pivot.role_id) : null;

  return {
    userId,
    fullName,
    roleKey: roleId != null ? (ROLE_ID_TO_KEY[roleId] ?? null) : null,
    roleName: roleId != null ? (ROLE_ID_TO_NAME[roleId] ?? "") : "",
  };
}