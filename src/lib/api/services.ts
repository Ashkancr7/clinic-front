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

export interface ClinicService {
  id: string;
  name: string;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null; // فقط اگر پاسخ واقعی category را nested برگرداند پر می‌شود
  defaultDurationMinutes: number;
  basePrice: number | null;
  requiresConsent: boolean;
  requiresBeforeAfterImages: boolean;
  requiresFollowup: boolean;
  isActive: boolean;
}

function mapService(s: Record<string, unknown>): ClinicService {
  const category = s.category as Record<string, unknown> | undefined;
  return {
    id: String(s.id ?? ""),
    name: String(s.name ?? ""),
    description: (s.description as string | null) ?? null,
    categoryId: (s.category_id as string | null) ?? null,
    categoryName: (category?.name as string | undefined) ?? null,
    defaultDurationMinutes: Number(s.default_duration_minutes ?? 30),
    basePrice: s.base_price != null ? Number(s.base_price) : null,
    requiresConsent: Boolean(s.requires_consent),
    requiresBeforeAfterImages: Boolean(s.requires_before_after_images),
    requiresFollowup: Boolean(s.requires_followup),
    isActive: Boolean(s.is_active),
  };
}

export async function getServices(clinicSlug: string): Promise<ClinicService[]> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>[]> | Record<string, unknown>[]>("/services", {
    clinicSlug,
  });
  return unwrapList<Record<string, unknown>>(res).map(mapService);
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  default_duration_minutes: number;
  base_price?: number;
  requires_consent?: boolean;
  requires_before_after_images?: boolean;
  requires_followup?: boolean;
}

export async function createService(clinicSlug: string, payload: CreateServicePayload) {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>("/services", {
    method: "POST",
    body: JSON.stringify(payload),
    clinicSlug,
  });
  return mapService(unwrapObject<Record<string, unknown>>(res));
}

export async function updateService(clinicSlug: string, serviceId: string, payload: Partial<CreateServicePayload>) {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(`/services/${serviceId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    clinicSlug,
  });
  return mapService(unwrapObject<Record<string, unknown>>(res));
}

export async function updateServiceStatus(clinicSlug: string, serviceId: string, isActive: boolean) {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown>>(
    `/services/${serviceId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ is_active: isActive }),
      clinicSlug,
    }
  );
  return mapService(unwrapObject<Record<string, unknown>>(res));
}