"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Headset } from "lucide-react";
import { RECEPTION_NAV_ITEMS } from "@/lib/auth/reception-nav";

import Image from "next/image";


interface ReceptionSidebarProps {
  clinicSlug: string;
  onNavigate?: () => void;
}

export function ReceptionSidebar({ clinicSlug, onNavigate }: ReceptionSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-b border-gray-100 bg-white p-5 lg:h-screen lg:w-64 lg:sticky lg:top-0 lg:border-b-0 lg:border-l">
      <div className="mb-4 flex items-center justify-center gap-2 lg:justify-end">
        <Leaf className="h-7 w-7 text-primary" />
        <div className="text-left leading-tight">
          <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
          <div className="text-[11px] text-gray-400">پلتفرم مدیریت کلینیک زیبایی</div>
        </div>
      </div>

      {/* برچسب پنل فعلی */}
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-primary-light/15 px-4 py-2.5 text-sm font-medium text-primary-dark">
        <Headset className="h-4 w-4" /> پنل منشی / نوبت‌دهی
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hide">
        {RECEPTION_NAV_ITEMS.map((item) => {
          const href = `/clinic/${clinicSlug}/${item.href}`;
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={item.href}
              onClick={() => onNavigate?.()}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${active ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

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
