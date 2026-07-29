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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: این مقدار باید از session واقعی کاربر بیاد (getSession() در lib/auth/session.ts).
  const [role, setRole] = useState<ClinicRole>(() => {
    if (typeof window === "undefined") return "clinic_admin";
    const saved = localStorage.getItem("dev_role");
    if (saved === "doctor" || saved === "receptionist" || saved === "clinic_admin") {
      return saved;
    }
    return "clinic_admin";
  });

  const userName = role === "doctor" ? "دکتر آرش نیکنام" : role === "receptionist" ? "نگار حسینی" : "دکتر سارا محمدی";

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50 lg:flex-row-reverse">

      <div className="flex-1">
        {/* سوییچر نقش تستی - قبل از اتصال بک‌اند واقعی حذف شود */}
        <div className="flex items-center gap-2 border-b border-dashed border-gray-200 bg-amber-50/50 px-4 py-2">
          <span className="text-[11px] text-gray-500">نمای تستی نقش:</span>
          <select
            value={role}
            onChange={(e) => {
              const newRole = e.target.value as ClinicRole;
              setRole(newRole);
              localStorage.setItem("dev_role", newRole);
            }}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none"
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <ClinicTopbar
          userName={userName}
          roleLabel={ROLE_LABELS[role]}
          notificationCount={8}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* پس‌زمینه‌ی تیره پشت سایدبار موبایل - با کلیک بسته می‌شود */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {role === "receptionist" ? (
          <ReceptionSidebar clinicSlug={clinicSlug} />
        ) : (
          <ClinicSidebar clinicSlug={clinicSlug} role={role} />
        )}
      </div>

    </div>
  );
}
