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
    lookup: (phone: string) => ["patients", "lookup", phone] as const,
  },
  appointments: {
    list: (clinicSlug: string, date?: string) =>
      ["appointments", clinicSlug, "list", date] as const,
    detail: (clinicSlug: string, appointmentId: string) =>
      ["appointments", clinicSlug, "detail", appointmentId] as const,
  },
  clinics: {
    myMemberships: () => ["clinics", "my-memberships"] as const,
    detail: (clinicSlug: string) => ["clinics", clinicSlug, "detail"] as const,
    services: (clinicSlug: string) => ["clinics", clinicSlug, "services"] as const,
  },
  chat: {
    conversations: (clinicSlug: string) => ["chat", clinicSlug, "conversations"] as const,
  },
  superAdmin: {
    clinics: {
      list: () => ["super-admin", "clinics", "list"] as const,
      detail: (clinicId: string) => ["super-admin", "clinics", "detail", clinicId] as const,
    },
    plans: {
      list: () => ["super-admin", "plans", "list"] as const,
    },
  },

    dashboard: {
    clinic: (clinicSlug: string) => ["dashboard", clinicSlug, "clinic"] as const,
    upcomingAppointments: (clinicSlug: string) => ["dashboard", clinicSlug, "upcoming-appointments"] as const,
  },
  modules: {
    list: (clinicSlug: string) => ["modules", clinicSlug, "list"] as const,
  },

    appointmentsCalendar: {
    list: (clinicSlug: string, date: string, doctorId?: number) =>
      ["appointments-calendar", clinicSlug, "list", date, doctorId] as const,
    detail: (clinicSlug: string, appointmentId: string) =>
      ["appointments-calendar", clinicSlug, "detail", appointmentId] as const,
    doctors: (clinicSlug: string) => ["appointments-calendar", clinicSlug, "doctors"] as const,
    availability: (clinicSlug: string, doctorId: number, date: string) =>
      ["appointments-calendar", clinicSlug, "availability", doctorId, date] as const,
  },
  services: {
    list: (clinicSlug: string) => ["services", clinicSlug, "list"] as const,
  },

};