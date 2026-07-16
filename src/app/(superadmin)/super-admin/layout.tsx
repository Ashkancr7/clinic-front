"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  Building2,
  Folder,
  Users,
  LayoutGrid,
  Receipt,
  BarChart3,
  Settings,
  Headset,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/super-admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/super-admin/clinics", label: "کلینیک‌ها", icon: Building2 },
  { href: "/super-admin/plans", label: "اشتراک‌ها", icon: Folder },
  { href: "/super-admin/users", label: "کاربران", icon: Users },
  { href: "/super-admin/modules", label: "ماژول‌ها", icon: LayoutGrid },
  { href: "/super-admin/transactions", label: "تراکنش‌ها", icon: Receipt },
  { href: "/super-admin/reports", label: "گزارش‌ها", icon: BarChart3 },
  { href: "/super-admin/settings", label: "تنظیمات", icon: Settings },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50 lg:flex-row">
      {/* سایدبار */}
      <aside className="flex w-full shrink-0 flex-col border-b border-gray-100 bg-white p-5 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-center gap-2 lg:justify-start">
          <div className="text-right leading-tight">
            <Leaf className="h-7 w-7 text-primary" />
            <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
            <div className="text-[11px] text-gray-400">پنل سوپرادمین</div>
          </div>

        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-4 py-2.5 text-sm transition-colors ${isActive
                    ? "bg-primary-light/15 font-medium text-primary-dark"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-dark"
                  }`}
              >
                <item.icon className="ml-5 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* تصویر تزئینی */}
        <div className="mt-8 hidden justify-center lg:flex">
          <svg viewBox="0 0 100 100" className="h-20 w-20 opacity-70">
            <ellipse cx="50" cy="88" rx="22" ry="4" fill="#0EA5A4" opacity="0.1" />
            <path d="M40 88 L40 55 Q40 45 50 45 Q60 45 60 55 L60 88 Z" fill="#5EEAD4" />
            <path d="M50 50 Q30 40 25 20 Q45 25 50 45" fill="#0EA5A4" />
            <path d="M50 50 Q70 38 75 18 Q55 24 50 45" fill="#0F766E" />
          </svg>
        </div>

        {/* باکس پشتیبانی */}
        <div className="mt-4 rounded-2xl bg-primary-light/15 p-4 text-center">
          <div className="text-sm font-semibold text-gray-800">نیاز به کمک دارید؟</div>
          <p className="mt-1 text-xs text-gray-500">
            تیم پشتیبانی ما آماده پاسخگویی است.
          </p>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-2.5 text-xs font-medium text-white hover:opacity-90">
            <Headset className="h-4 w-4" /> تماس با پشتیبانی
          </button>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
