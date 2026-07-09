import { cache } from "react";

export interface ClinicMembership {
  clinicId: string;
  clinicSlug: string;
  clinicName: string;
  role: "patient" | "doctor" | "receptionist" | "clinic_admin";
}

/**
 * بر اساس clinicSlug موجود در URL، اطلاعات کلینیک فعال و رابطه‌ی کاربر با آن را برمی‌گرداند.
 * از cache() استفاده شده تا در یک درخواست (Server Components متعدد) فقط یک بار فراخوانی شود.
 *
 * طبق NFR-TENANT-03: این تابع تنها راه رسمی برای گرفتن clinic_id فعال است.
 * هیچ کامپوننتی نباید clinic_id را از جای دیگری (مثل localStorage) بخواند.
 */
export const getActiveClinic = cache(
  async (clinicSlug: string): Promise<ClinicMembership | null> => {
    // TODO: این بخش را به API واقعی بک‌اند وصل کن، مثلاً:
    // const res = await fetch(`${process.env.API_URL}/patient-clinics/me?slug=${clinicSlug}`, {
    //   headers: { Cookie: cookies().toString() },
    // });
    // if (!res.ok) return null;
    // return res.json();

    return {
      clinicId: "demo-clinic-id",
      clinicSlug,
      clinicName: "کلینیک نمونه",
      role: "patient",
    };
  }
);
