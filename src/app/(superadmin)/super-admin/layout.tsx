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
          <Leaf className="h-7 w-7 text-primary-light" />
          <div className="text-base font-bold text-white">Beauty Clinic CRM</div>
          <div className="text-[11px] text-gray-400">پنل سوپرادمین</div>
        </div>

        {/* دکمه بستن، فقط موبایل */}
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="rounded-lg p-2 text-gray-400 hover:bg-white/[0.06] lg:hidden"
          aria-label="بستن منو"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="glass-scroll flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`glass-nav-item flex items-center rounded-xl px-4 py-2.5 text-sm ${
                isActive ? "active" : ""
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
          className="rounded-full object-cover ring-2 ring-white/10"
        />
      </div>

      {/* باکس پشتیبانی */}
      <div className="glass-strong mt-4 rounded-2xl p-4 text-center">
        <div className="text-sm font-semibold text-white">نیاز به کمک دارید؟</div>
        <p className="mt-1 text-xs text-gray-400">تیم پشتیبانی ما آماده پاسخگویی است.</p>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary-light/30 bg-primary/80 py-2.5 text-xs font-medium text-white shadow-glow-primary transition hover:bg-primary">
          <Headset className="h-4 w-4" /> تماس با پشتیبانی
        </button>
      </div>
    </>
  );

  return (
    <div dir="rtl" className="flex min-h-screen flex-col lg:flex-row">
      {/* هدر موبایل: لوگو + دکمه همبرگر */}
      <header className="glass flex items-center justify-between rounded-none px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary-light" />
          <span className="text-sm font-bold text-white">Beauty Clinic CRM</span>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-lg border border-white/15 p-2 text-gray-200"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* اورلی پس‌زمینه، فقط موبایل و وقتی دراور بازه */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* سایدبار: دسکتاپ ثابت / موبایل دراور کشویی */}
      <aside
        className={`glass fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85%] flex-col overflow-y-auto rounded-none p-5 transition-transform duration-300 ease-in-out
        lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {SidebarContent}
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="glass-content min-h-[calc(100vh-4rem)] rounded-3xl p-4 text-gray-900 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
