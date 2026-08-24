import { cache } from "react";
import { cookies } from "next/headers";

export interface ClinicMembership {
  clinicId: string;
  clinicSlug: string;
}

/**
 * بر اساس clinicSlug موجود در URL، شناسه‌ی UUID کلینیک را از کوکی clinics برمی‌گرداند.
 * این کوکی هنگام لاگین (staff-login یا otp/verify) پر می‌شود.
 * طبق NFR-TENANT-03: این تابع تنها راه رسمی برای گرفتن clinic_id فعال است.
 */
export const getActiveClinic = cache(
  async (clinicSlug: string): Promise<ClinicMembership | null> => {
    const store = await cookies();
    const clinicsRaw = store.get("clinics")?.value;
    const clinics: { id: string; slug: string }[] = clinicsRaw ? JSON.parse(clinicsRaw) : [];

    const match = clinics.find((c) => c.slug === clinicSlug);
    if (!match) return null;

    return { clinicId: match.id, clinicSlug: match.slug };
  }
);