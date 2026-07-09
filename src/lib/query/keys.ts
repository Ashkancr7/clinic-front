/**
 * تمام کلیدهای React Query باید از این فکتوری ساخته شوند، نه دستی نوشته شوند.
 * دلیل: اگر clinicSlug فراموش شود، ممکن است بعد از سوییچ کلینیک،
 * داده‌ی کلینیک قبلی همچنان از کش نمایش داده شود (باگ جدی حریم خصوصی داده).
 */
export const queryKeys = {
  patients: {
    list: (clinicSlug: string, filters?: Record<string, unknown>) =>
      ["patients", clinicSlug, "list", filters] as const,
    detail: (clinicSlug: string, patientId: string) =>
      ["patients", clinicSlug, "detail", patientId] as const,
    lookup: (phone: string) => ["patients", "lookup", phone] as const, // سراسری - مستقل از کلینیک
  },
  appointments: {
    list: (clinicSlug: string, date?: string) =>
      ["appointments", clinicSlug, "list", date] as const,
    detail: (clinicSlug: string, appointmentId: string) =>
      ["appointments", clinicSlug, "detail", appointmentId] as const,
  },
  clinics: {
    myMemberships: () => ["clinics", "my-memberships"] as const, // سراسری
    detail: (clinicSlug: string) => ["clinics", clinicSlug, "detail"] as const,
    services: (clinicSlug: string) => ["clinics", clinicSlug, "services"] as const,
  },
  chat: {
    conversations: (clinicSlug: string) => ["chat", clinicSlug, "conversations"] as const,
  },
};
