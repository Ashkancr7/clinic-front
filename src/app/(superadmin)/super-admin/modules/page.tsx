"use client";

import { useState } from "react";
import {
  Plus,
  LayoutGrid,
  CheckCircle2,
  Building2,
  Video,
  MessageCircle,
  UserRound,
  Images,
  CalendarClock,
  FolderHeart,
  ScanLine,
  Wallet,
} from "lucide-react";

const STATS = [
  { icon: LayoutGrid, tone: "text-primary-dark bg-primary-light/20", label: "کل ماژول‌ها", value: "۸" },
  { icon: CheckCircle2, tone: "text-primary-dark bg-primary-light/20", label: "ماژول‌های فعال", value: "۷" },
  { icon: Building2, tone: "text-purple-600 bg-secondary-purple/40", label: "پرمصرف‌ترین ماژول", value: "نوبت‌دهی هوشمند" },
];

const PLAN_TAGS: Record<string, string> = {
  basic: "پایه",
  standard: "استاندارد",
  pro: "حرفه‌ای",
};

const MODULES = [
  {
    icon: CalendarClock,
    tone: "text-primary-dark bg-primary-light/20",
    name: "نوبت‌دهی هوشمند",
    desc: "تقویم آنلاین، یادآوری خودکار و مدیریت تداخل‌ها",
    plans: ["basic", "standard", "pro"],
    clinics: 32,
    enabled: true,
  },
  {
    icon: UserRound,
    tone: "text-primary-dark bg-primary-light/20",
    name: "پنل بیمار",
    desc: "دسترسی بیمار به پرونده، نوبت‌ها و صورت‌حساب‌ها",
    plans: ["basic", "standard", "pro"],
    clinics: 32,
    enabled: true,
  },
  {
    icon: FolderHeart,
    tone: "text-primary-dark bg-primary-light/20",
    name: "پرونده مرکزی بیمار",
    desc: "سوابق درمانی، اسناد و تاریخچه کامل در یک‌جا",
    plans: ["standard", "pro"],
    clinics: 26,
    enabled: true,
  },
  {
    icon: Images,
    tone: "text-pink-600 bg-secondary-pink/50",
    name: "عکس‌های قبل و بعد",
    desc: "مقایسه تصاویر، گالری و تعقیب نتایج درمانی",
    plans: ["standard", "pro"],
    clinics: 24,
    enabled: true,
  },
  {
    icon: MessageCircle,
    tone: "text-blue-600 bg-secondary-blue/40",
    name: "چت و پیام‌ها",
    desc: "پیام‌رسانی درون‌برنامه‌ای و اطلاع‌رسانی خودکار",
    plans: ["basic", "standard", "pro"],
    clinics: 30,
    enabled: true,
  },
  {
    icon: ScanLine,
    tone: "text-pink-600 bg-secondary-pink/50",
    name: "پذیرش دیجیتال",
    desc: "پذیرش از طریق QR و لینک، فرم‌های هوشمند و رضایت‌نامه",
    plans: ["standard", "pro"],
    clinics: 22,
    enabled: true,
  },
  {
    icon: Video,
    tone: "text-purple-600 bg-secondary-purple/40",
    name: "تماس تصویری",
    desc: "مشاوره آنلاین امن و ارتباط ویدیویی یکپارچه",
    plans: ["pro"],
    clinics: 12,
    enabled: true,
  },
  {
    icon: Wallet,
    tone: "text-gray-600 bg-gray-100",
    name: "مالی و صورت‌حساب پیشرفته",
    desc: "گزارش مالی چندشعبه‌ای و درگاه پرداخت اختصاصی",
    plans: ["pro"],
    clinics: 8,
    enabled: false,
  },
];

export default function ModulesPage() {
  const [moduleStates, setModuleStates] = useState(
    Object.fromEntries(MODULES.map((m) => [m.name, m.enabled]))
  );

  const toggleModule = (name: string) => {
    setModuleStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">ماژول‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">فعال‌سازی و تنظیم امکانات قابل‌ارائه به کلینیک‌ها</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> افزودن ماژول جدید
        </button>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* لیست ماژول‌ها */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MODULES.map((m) => (
          <div key={m.name} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${m.tone}`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{m.name}</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{m.desc}</p>
                </div>
              </div>

              <button
                onClick={() => toggleModule(m.name)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  moduleStates[m.name] ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    moduleStates[m.name] ? "right-0.5" : "right-5"
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {m.plans.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] text-gray-500"
                  >
                    {PLAN_TAGS[p]}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-gray-400">{m.clinics.toLocaleString("fa-IR")} کلینیک فعال</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
