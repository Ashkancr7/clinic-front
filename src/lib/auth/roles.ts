import { apiClient } from "../api/client";

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

export interface RolePermission {
  id: number;
  moduleKey: string;
  action: string;
  description: string | null;
}

export interface Role {
  id: number;
  name: string;
  key: string;
  description: string | null;
  isSystemRole: boolean;
  permissions: RolePermission[];
}

function mapRole(r: Record<string, unknown>): Role {
  const permissionsRaw = (r.permissions as Record<string, unknown>[]) ?? [];
  return {
    id: Number(r.id ?? 0),
    name: (r.name as string | undefined) ?? "",
    key: (r.key as string | undefined) ?? "",
    description: (r.description as string | null) ?? null,
    isSystemRole: Boolean(r.is_system_role),
    permissions: permissionsRaw.map((p) => ({
      id: Number(p.id ?? 0),
      moduleKey: (p.module_key as string | undefined) ?? "",
      action: (p.action as string | undefined) ?? "",
      description: (p.description as string | null) ?? null,
    })),
  };
}

// --- لیست نقش‌های سیستمی و سفارشی کلینیک ---
export async function getRoles(clinicSlug: string): Promise<Role[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/clinics/current/roles",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map(mapRole);
}

// --- لیست تمام مجوزهای قابل تخصیص در سیستم ---
export async function getPermissions(clinicSlug: string): Promise<RolePermission[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>(
    "/clinics/current/permissions",
    { clinicSlug }
  );
  return unwrapList<Record<string, unknown>>(res).map((p) => ({
    id: Number(p.id ?? 0),
    moduleKey: (p.module_key as string | undefined) ?? "",
    action: (p.action as string | undefined) ?? "",
    description: (p.description as string | null) ?? null,
  }));
}
