"use client";

import { use, useState } from "react";
import { ClinicSidebar } from "@/components/layout/ClinicSidebar";
import { ClinicTopbar } from "@/components/layout/ClinicTopbar";
import { ROLE_LABELS, type ClinicRole } from "@/lib/auth/clinic-nav";

export default function ClinicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  // TODO: این مقدار باید از session واقعی کاربر بیاد (getSession() در lib/auth/session.ts).
  const [role] = useState<ClinicRole>("clinic_admin");

  const userName = role === "doctor" ? "دکتر آرش نیکنام" : role === "receptionist" ? "نگار حسینی" : "دکتر سارا محمدی";

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50 lg:flex-row-reverse">

      <div className="flex-1">
        <ClinicTopbar userName={userName} roleLabel={ROLE_LABELS[role]} notificationCount={8} />
        <main className="p-4 md:p-6">{children}</main>
      </div>

      <ClinicSidebar clinicSlug={clinicSlug} role={role} />

    </div>
  );
}
