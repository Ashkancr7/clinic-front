"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { CLINIC_NAV_ITEMS, type ClinicRole } from "@/lib/auth/clinic-nav";

import Image from "next/image";


interface ClinicSidebarProps {
  clinicSlug: string;
  role: ClinicRole;
}

export function ClinicSidebar({ clinicSlug, role }: ClinicSidebarProps) {
  const pathname = usePathname();
  const visibleItems = CLINIC_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-gray-100 bg-white p-5 lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:border-b-0 lg:border-l">
      <div className="mb-6 flex items-center justify-center gap-2 lg:justify-start">
        <Leaf className="h-7 w-7 text-primary" />
        <div className="text-left leading-tight">
          <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
          <div className="text-[11px] text-gray-400">پلتفرم مدیریت کلینیک زیبایی</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {visibleItems.map((item) => {
          const href = `/clinic/${clinicSlug}/${item.href}`;
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center rounded-xl px-4 py-2.5 text-sm transition-colors ${isActive
                  ? "bg-primary-light/15 font-medium text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <item.icon className="h-4 w-4 ml-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* تصویر تزئینی */}
      <div className="mt-6 hidden justify-center lg:flex">
        <Image
          src="/image/superadmin.png"
          alt="User"
          width={120}
          height={120}
          unoptimized
          className="rounded-full object-cover"
        />
      </div>

      {/* باکس ارتقای پلن */}
      <div className="mt-3 rounded-2xl bg-primary-light/15 p-4 text-center">
        <div className="text-sm font-semibold text-gray-800">نسخه حرفه‌ای</div>
        <p className="mt-1 text-xs text-gray-500">همه امکانات برای رشد کسب‌وکار شما</p>
        <button className="mt-3 w-full rounded-xl bg-primary-dark py-2.5 text-xs font-medium text-white hover:opacity-90">
          ارتقای پلن
        </button>
      </div>
    </aside>
  );
}
