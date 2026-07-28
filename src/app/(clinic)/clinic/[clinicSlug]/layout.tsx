"use client";

import { use, useState } from "react";
import { ClinicSidebar } from "@/components/layout/ClinicSidebar";
import { ReceptionSidebar } from "@/components/layout/ReceptionSidebar";
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
  const [role, setRole] = useState<ClinicRole>("clinic_admin");

  const userName = role === "doctor" ? "دکتر آرش نیکنام" : role === "receptionist" ? "نگار حسینی" : "دکتر سارا محمدی";

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50 lg:flex-row-reverse">

      <div className="flex-1">
        {/* سوییچر نقش تستی - قبل از اتصال بک‌اند واقعی حذف شود */}
        <div className="flex items-center gap-2 border-b border-dashed border-gray-200 bg-amber-50/50 px-4 py-2">
          <span className="text-[11px] text-gray-500">نمای تستی نقش:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as ClinicRole)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none"
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <ClinicTopbar userName={userName} roleLabel={ROLE_LABELS[role]} notificationCount={8} />
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {role === "receptionist" ? (
        <ReceptionSidebar clinicSlug={clinicSlug} />
      ) : (
        <ClinicSidebar clinicSlug={clinicSlug} role={role} />
      )}

    </div>
  );
}
