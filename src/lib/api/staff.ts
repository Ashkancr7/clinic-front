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

export interface StaffMember {
  userId: number;
  fullName: string;
  phone: string;
  roleKey: string;
  roleName: string;
  isActive: boolean;
}

export async function getStaffMembers(clinicSlug: string): Promise<StaffMember[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/clinics/current/staff",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map((s) => {
    const user = s.user as Record<string, unknown> | undefined;
    const role = s.role as Record<string, unknown> | undefined;
    return {
      userId: Number(s.user_id ?? user?.id ?? 0),
      fullName: (user?.full_name as string | undefined) ?? "",
      phone: (user?.phone as string | undefined) ?? "",
      roleKey: (role?.key as string | undefined) ?? "",
      roleName: (role?.name as string | undefined) ?? "",
      isActive: Boolean(s.is_active),
    };
  });
}