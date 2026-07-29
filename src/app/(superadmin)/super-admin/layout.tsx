"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

import Image from "next/image";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // با تغییر مسیر، دراور روی موبایل بسته شود
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // وقتی دراور بازه، اسکرول پس‌زمینه قفل شود
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const SidebarContent = (
    <>
      <div className="mb-6 flex items-center justify-between gap-2 lg:justify-start">
        <div className="text-right leading-tight">
          <Leaf className="h-7 w-7 text-primary" />
          <div className="text-base font-bold text-gray-900">Beauty Clinic CRM</div>
          <div className="text-[11px] text-gray-400">پنل سوپرادمین</div>
        </div>

        {/* دکمه بستن، فقط موبایل */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 lg:hidden"
          aria-label="بستن منو"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-primary-light/15 font-medium text-primary-dark"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary-dark"
              }`}
            >
              <item.icon className="ml-5 h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* تصویر تزئینی */}
      <div className="mt-8 hidden justify-center lg:flex">
        <Image
          src="/image/superadmin.png"
          alt="User"
          width={120}
          height={120}
          unoptimized
          className="rounded-full object-cover"
        />
      </div>

      {/* باکس پشتیبانی */}
      <div className="mt-4 rounded-2xl bg-primary-light/15 p-4 text-center">
        <div className="text-sm font-semibold text-gray-800">نیاز به کمک دارید؟</div>
        <p className="mt-1 text-xs text-gray-500">تیم پشتیبانی ما آماده پاسخگویی است.</p>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark py-2.5 text-xs font-medium text-white hover:opacity-90">
          <Headset className="h-4 w-4" /> تماس با پشتیبانی
        </button>
      </div>
    </>
  );

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      {/* هدر موبایل: لوگو + دکمه همبرگر */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-sm font-bold text-gray-900">Beauty Clinic CRM</span>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-lg border border-gray-200 p-2 text-gray-600"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* اورلی پس‌زمینه، فقط موبایل و وقتی دراور بازه */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* سایدبار: دسکتاپ ثابت / موبایل دراور کشویی */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-white p-5 shadow-xl transition-transform duration-300 ease-in-out
        lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-100
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {SidebarContent}
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  );
}
