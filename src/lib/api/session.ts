import { apiClient } from "./client";
import { getStaffMembers } from "./staff";

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

// فرمت دقیق /auth/me مستند نیست و نقش کاربر را در یک کلینیک خاص مشخص نمی‌کند؛
// برای همین بعد از گرفتن هویت کاربر، آن را با لیست کارکنان همین کلینیک
// (که فرمتش قبلاً تست و تأیید شده) کراس‌رفرنس می‌گیریم تا نقش دقیق به‌دست بیاید
export async function getCurrentClinicUser(clinicSlug: string): Promise<CurrentClinicUser> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>("/auth/me", {
    clinicSlug,
  });
  const data = unwrapObject<Record<string, unknown>>(res);
  const user = (data.user as Record<string, unknown> | undefined) ?? data;
  const userId = user.id != null ? Number(user.id) : null;
  const fullName = (user.full_name as string | undefined) ?? "";

  if (userId == null) {
    return { userId: null, fullName, roleKey: null, roleName: "" };
  }

  try {
    const staff = await getStaffMembers(clinicSlug);
    const me = staff.find((s) => s.userId === userId);
    if (me) {
      return {
        userId,
        fullName: fullName || me.fullName,
        roleKey: (me.roleKey as CurrentClinicUser["roleKey"]) ?? null,
        roleName: me.roleName,
      };
    }
  } catch {
    // اگر دسترسی به لیست کارکنان نبود (مثلاً برای منشی)، بی‌خیال کراس‌رفرنس می‌شویم
  }

  return { userId, fullName, roleKey: null, roleName: "" };
}