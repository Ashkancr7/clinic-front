"use client";

import { useMemo, useState } from "react";

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

const MODULES = [
  {
    icon: CalendarClock,
    tone: "text-primary-dark bg-primary-light/20 dark:bg-primary/15 dark:text-primary-light",
    name: "نوبت‌دهی هوشمند",
    desc: "تقویم آنلاین، یادآوری خودکار و مدیریت تداخل‌ها",
    plans: ["basic", "standard", "pro"],
    clinics: 32,
    enabled: true,
  },
  {
    icon: UserRound,
    tone: "text-primary-dark bg-primary-light/20 dark:bg-primary/15 dark:text-primary-light",
    name: "پنل بیمار",
    desc: "دسترسی بیمار به پرونده، نوبت‌ها و صورت‌حساب‌ها",
    plans: ["basic", "standard", "pro"],
    clinics: 32,
    enabled: true,
  },
  {
    icon: FolderHeart,
    tone: "text-primary-dark bg-primary-light/20 dark:bg-primary/15 dark:text-primary-light",
    name: "پرونده مرکزی بیمار",
    desc: "سوابق درمانی، اسناد و تاریخچه کامل در یک‌جا",
    plans: ["standard", "pro"],
    clinics: 26,
    enabled: true,
  },
  {
    icon: Images,
    tone: "text-pink-600 bg-secondary-pink/50 dark:bg-pink-500/15 dark:text-pink-400",
    name: "عکس‌های قبل و بعد",
    desc: "مقایسه تصاویر، گالری و تعقیب نتایج درمانی",
    plans: ["standard", "pro"],
    clinics: 24,
    enabled: true,
  },
  {
    icon: MessageCircle,
    tone: "text-blue-600 bg-secondary-blue/40 dark:bg-blue-500/15 dark:text-blue-400",
    name: "چت و پیام‌ها",
    desc: "پیام‌رسانی درون‌برنامه‌ای و اطلاع‌رسانی خودکار",
    plans: ["basic", "standard", "pro"],
    clinics: 30,
    enabled: true,
  },
  {
    icon: ScanLine,
    tone: "text-pink-600 bg-secondary-pink/50 dark:bg-pink-500/15 dark:text-pink-400",
    name: "پذیرش دیجیتال",
    desc: "پذیرش از طریق QR و لینک، فرم‌های هوشمند و رضایت‌نامه",
    plans: ["standard", "pro"],
    clinics: 22,
    enabled: true,
  },
  {
    icon: Video,
    tone: "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/15 dark:text-purple-400",
    name: "تماس تصویری",
    desc: "مشاوره آنلاین امن و ارتباط ویدیویی یکپارچه",
    plans: ["pro"],
    clinics: 12,
    enabled: true,
  },
  {
    icon: Wallet,
    tone: "text-gray-600 bg-gray-100 dark:bg-white/10 dark:text-gray-300",
    name: "مالی و صورت‌حساب پیشرفته",
    desc: "گزارش مالی چندشعبه‌ای و درگاه پرداخت اختصاصی",
    plans: ["pro"],
    clinics: 8,
    enabled: false,
  },
];

const PLAN_TAGS: Record<string, string> = {
  basic: "پایه",
  standard: "استاندارد",
  pro: "حرفه‌ای",
};

export default function ModulesPage() {
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((module) => [module.name, module.enabled]))
  );

  const toggleModule = (name: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const activeModulesCount = useMemo(
    () =>
      Object.values(moduleStates).filter(Boolean).length,
    [moduleStates]
  );

  const mostUsedModule = useMemo(() => {
    return MODULES.reduce((prev, current) =>
      current.clinics > prev.clinics ? current : prev
    );
  }, []);

  const stats = [
    {
      icon: LayoutGrid,
      tone: "text-primary-dark bg-primary-light/20 dark:bg-primary/15 dark:text-primary-light",
      label: "کل ماژول‌ها",
      value: MODULES.length.toLocaleString("fa-IR"),
    },
    {
      icon: CheckCircle2,
      tone: "text-primary-dark bg-primary-light/20 dark:bg-primary/15 dark:text-primary-light",
      label: "ماژول‌های فعال",
      value: activeModulesCount.toLocaleString("fa-IR"),
    },
    {
      icon: Building2,
      tone: "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/15 dark:text-purple-400",
      label: "پرمصرف‌ترین ماژول",
      value: mostUsedModule.name,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
            ماژول‌ها
          </h1>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            فعال‌سازی و تنظیم امکانات قابل‌ارائه به کلینیک‌ها
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark dark:bg-primary/90 dark:shadow-glow-primary dark:hover:bg-primary"
        >
          <Plus className="h-4 w-4" />
          افزودن ماژول جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-colors dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${stat.tone}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MODULES.map((module) => {
          const isEnabled = moduleStates[module.name];

          return (
            <div
              key={module.name}
              className={`rounded-2xl border p-5 transition-all ${
                isEnabled
                  ? "border-gray-100 bg-white dark:border-white/10 dark:bg-white/[0.04]"
                  : "border-gray-200 bg-gray-50/70 dark:border-white/10 dark:bg-white/[0.02]"
              }`}
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${module.tone}`}
                  >
                    <module.icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold ${
                        isEnabled
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {module.name}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                      {module.desc}
                    </p>
                  </div>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => toggleModule(module.name)}
                  aria-label={
                    isEnabled
                      ? `غیرفعال کردن ${module.name}`
                      : `فعال کردن ${module.name}`
                  }
                  aria-pressed={isEnabled}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    isEnabled
                      ? "bg-primary dark:bg-primary"
                      : "bg-gray-200 dark:bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                      isEnabled
                        ? "right-0.5"
                        : "right-5"
                    }`}
                  />
                </button>
              </div>

              {/* Bottom */}
              <div className="mt-4 flex flex-col gap-3 border-t border-gray-50 pt-4 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {module.plans.map((plan) => (
                    <span
                      key={plan}
                      className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] text-gray-500 dark:bg-white/[0.06] dark:text-gray-400"
                    >
                      {PLAN_TAGS[plan]}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {module.clinics.toLocaleString("fa-IR")} کلینیک فعال
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}