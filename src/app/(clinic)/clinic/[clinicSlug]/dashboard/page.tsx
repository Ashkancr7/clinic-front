"use client";

import {
  Wallet,
  RefreshCcw,
  Sparkles,
  CalendarCheck,
  Users,
  ChevronLeft,
  ChevronDown,
  Gift,
  Send,
  BarChart3,
  Briefcase,
  UserPlus,
  FileText,
  Receipt,
  CheckCircle2,
  XCircle,
  Megaphone,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useActiveClinic } from "@/hooks/use-active-clinic";
import { queryKeys } from "@/lib/query/keys";

import {
  getClinicDashboard,
  getClinicModules,
  getUpcomingAppointments,
  isFinanceModuleEnabled,
} from "@/lib/api/clinic-dashboard";

/* =========================
   Mock Data
========================= */

const TOP_SERVICES = [
  { name: "بوتاکس", value: 1065, percent: 33, color: "#0EA5A4" },
  { name: "فیلر", value: 814, percent: 25, color: "#F9A8D4" },
  { name: "مزوتراپی", value: 658, percent: 20, color: "#C4B5FD" },
  { name: "لیزر موهای زائد", value: 456, percent: 14, color: "#5EEAD4" },
  { name: "مزونیدلینگ", value: 278, percent: 8, color: "#0F766E" },
];

const TOTAL_SERVICES = TOP_SERVICES.reduce((sum, item) => sum + item.value, 0);

const VISITS_MONTHS = [
  { m: "دی", v: 1400 },
  { m: "بهمن", v: 1800 },
  { m: "اسفند", v: 1900 },
  { m: "فروردین", v: 2400 },
  { m: "اردیبهشت", v: 2600 },
  { m: "خرداد", v: 3000 },
];

const BIRTHDAYS = [
  { date: "۲۵ خرداد", name: "سینا یوسفی" },
  { date: "۲۶ خرداد", name: "نگین محمدی" },
  { date: "۲۷ خرداد", name: "الناز قربانی" },
  { date: "۲۹ خرداد", name: "مهسا رفیعی" },
];

const AUTO_SMS = [
  {
    icon: Send,
    tone:
      "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
    value: "۱,۴۴۸",
    label: "یادآوری نوبت",
  },
  {
    icon: Gift,
    tone:
      "text-pink-600 bg-secondary-pink/40 dark:bg-pink-500/10 dark:text-pink-300",
    value: "۳۲۶",
    label: "تبریک تولد",
  },
  {
    icon: Megaphone,
    tone:
      "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/10 dark:text-purple-300",
    value: "۴۸۱",
    label: "پیام‌های تبلیغاتی",
  },
  {
    icon: XCircle,
    tone:
      "text-danger bg-red-50 dark:bg-red-500/10 dark:text-red-300",
    value: "۱۲۹",
    label: "عودت نوبت لغو شده",
  },
];

const RECENT_ACTIVITIES = [
  {
    icon: CalendarCheck,
    tone:
      "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
    text: "نوبت جدید ثبت شد توسط نگین محمدی",
    time: "۱۰:۳۲",
  },
  {
    icon: CheckCircle2,
    tone:
      "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
    text: "پرداخت موفق ۲,۴۰۰,۰۰۰ تومان",
    time: "۱۰:۱۵",
  },
  {
    icon: FileText,
    tone:
      "text-blue-600 bg-secondary-blue/40 dark:bg-blue-500/10 dark:text-blue-300",
    text: "پرونده جدید ایجاد شد برای مهسا رفیعی",
    time: "۰۹:۴۸",
  },
  {
    icon: Send,
    tone:
      "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/10 dark:text-purple-300",
    text: "پیامک یادآوری برای ۱۸ نفر ارسال شد",
    time: "۰۹:۳۰",
  },
  {
    icon: XCircle,
    tone:
      "text-danger bg-red-50 dark:bg-red-500/10 dark:text-red-300",
    text: "نوبت لغو شد توسط کاربر",
    time: "۰۹:۱۲",
  },
];

const QUICK_ACTIONS = [
  {
    icon: Briefcase,
    tone:
      "text-gray-600 bg-gray-100 dark:bg-white/10 dark:text-gray-300",
    label: "مدیریت خدمات",
    href: "services",
  },
  {
    icon: BarChart3,
    tone:
      "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
    label: "گزارش درآمد",
    href: null,
  },
  {
    icon: Send,
    tone:
      "text-pink-600 bg-secondary-pink/40 dark:bg-pink-500/10 dark:text-pink-300",
    label: "ارسال پیامک",
    href: "sms",
  },
  {
    icon: Receipt,
    tone:
      "text-blue-600 bg-secondary-blue/40 dark:bg-blue-500/10 dark:text-blue-300",
    label: "صدور فاکتور",
    href: null,
  },
  {
    icon: UserPlus,
    tone:
      "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/10 dark:text-purple-300",
    label: "مراجع جدید",
    href: "patients?new=1",
  },
  {
    icon: CalendarCheck,
    tone:
      "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
    label: "نوبت جدید",
    href: "calendar/new",
  },
];

function formatValue(value: number | null, suffix = "") {
  if (value === null) return "—";

  return value.toLocaleString("fa-IR") + suffix;
}

export default function ClinicDashboardPage() {
  const { clinicSlug } = useActiveClinic();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: queryKeys.dashboard.clinic(clinicSlug),
    queryFn: () => getClinicDashboard(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: modules = [] } = useQuery({
    queryKey: queryKeys.modules.list(clinicSlug),
    queryFn: () => getClinicModules(clinicSlug),
    enabled: !!clinicSlug,
  });

  const {
    data: upcomingAppointments = [],
    isLoading: appointmentsLoading,
  } = useQuery({
    queryKey: queryKeys.dashboard.upcomingAppointments(clinicSlug),
    queryFn: () => getUpcomingAppointments(clinicSlug),
    enabled: !!clinicSlug,
  });

  const financeEnabled = isFinanceModuleEnabled(modules);

  const KPIS = [
    {
      icon: CalendarCheck,
      tone:
        "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/10 dark:text-purple-300",
      label: "نوبت‌های امروز",
      value: formatValue(summary?.appointmentsToday ?? null),
    },
    {
      icon: Users,
      tone:
        "text-pink-600 bg-secondary-pink/40 dark:bg-pink-500/10 dark:text-pink-300",
      label: "بیماران جدید امروز",
      value: formatValue(summary?.newPatientsToday ?? null),
    },
    {
      icon: Sparkles,
      tone:
        "text-primary-dark bg-primary-light/20 dark:bg-primary-light/10 dark:text-primary-light",
      label: "خدمات انجام‌شده امروز",
      value: formatValue(summary?.servicesPerformedToday ?? null),
    },
    {
      icon: RefreshCcw,
      tone:
        "text-purple-600 bg-secondary-purple/40 dark:bg-purple-500/10 dark:text-purple-300",
      label: "نرخ بازگشت مشتری",
      value: formatValue(summary?.returnRatePercent ?? null, "٪"),
    },
  ];

  let cumulative = 0;

  const gradientParts = TOP_SERVICES.map((service) => {
    const start = (cumulative / TOTAL_SERVICES) * 100;

    cumulative += service.value;

    const end = (cumulative / TOTAL_SERVICES) * 100;

    return `${service.color} ${start}% ${end}%`;
  }).join(", ");

  const barMax = Math.max(...VISITS_MONTHS.map((item) => item.v));

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className="
                rounded-2xl border border-gray-100 bg-white p-4
                transition-shadow hover:shadow-sm
                dark:border-white/10 dark:bg-white/[0.06]
                dark:hover:bg-white/[0.08]
              "
            >
              <div
                className="
                  mb-5 flex items-center justify-between
                  border-b border-gray-100 pb-3
                  dark:border-white/10
                "
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${kpi.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {summaryLoading ? "…" : kpi.value}
              </div>

              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {kpi.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visits + Top Services */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Visits */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              مراجعات در ۶ ماه گذشته
            </h3>

            <button
              className="
                flex items-center gap-1 rounded-lg
                border border-gray-200 px-2 py-1
                text-[10px] text-gray-500
                transition hover:bg-gray-50
                dark:border-white/10 dark:text-gray-400
                dark:hover:bg-white/[0.06]
              "
            >
              ۶ ماهه
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <svg viewBox="0 0 280 130" className="w-full">
            {VISITS_MONTHS.map((visit, index) => {
              const barW = 24;
              const gap = 280 / VISITS_MONTHS.length;
              const barH = (visit.v / barMax) * 100;
              const x = index * gap + (gap - barW) / 2;

              return (
                <g key={visit.m}>
                  <rect
                    x={x}
                    y={110 - barH}
                    width={barW}
                    height={barH}
                    rx="4"
                    fill="#5EEAD4"
                  />

                  <text
                    x={x + barW / 2}
                    y="124"
                    fontSize="8"
                    fill="#9CA3AF"
                    textAnchor="middle"
                  >
                    {visit.m}
                  </text>
                </g>
              );
            })}
          </svg>

          <button
            className="
              mt-2 flex items-center gap-1
              text-xs text-primary-dark
              transition hover:text-primary
              dark:text-primary-light
            "
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            گزارش کامل مراجعات
          </button>
        </div>

        {/* Top Services */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
            خدمات پرطرفدار
          </h3>

          <div className="flex justify-center">
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${gradientParts})`,
              }}
            >
              <div
                className="
                  flex h-[5.5rem] w-[5.5rem]
                  flex-col items-center justify-center
                  rounded-full bg-white p-4 text-center
                  dark:bg-[#1b2423]
                "
              >
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  کل خدمات
                </span>

                <span className="text-base font-bold text-gray-800 dark:text-white">
                  {TOTAL_SERVICES.toLocaleString("fa-IR")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-[11px]">
            {TOP_SERVICES.map((service) => (
              <div
                key={service.name}
                className="
                  flex items-center justify-between rounded-xl p-2
                  transition hover:bg-gray-50
                  dark:hover:bg-white/[0.06]
                "
              >
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: service.color,
                    }}
                  />

                  {service.name}
                </span>

                <span className="text-gray-700 dark:text-gray-200">
                  {service.value.toLocaleString("fa-IR")} ({service.percent}٪)
                </span>
              </div>
            ))}
          </div>

          <button
            className="
              mt-4 flex items-center gap-1
              text-xs text-primary-dark
              transition hover:text-primary
              dark:text-primary-light
            "
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            مشاهده همه خدمات
          </button>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Recent Activities */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <div
            className="
              mb-5 flex items-center justify-between
              border-b border-gray-100 pb-3
              dark:border-white/10
            "
          >
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-800 dark:text-gray-100">
              فعالیت‌های اخیر
            </h3>

            <button
              className="
                rounded-full bg-primary-light/10 px-3 py-1
                text-[11px] font-medium text-primary-dark
                transition hover:bg-primary-light/20
                dark:text-primary-light dark:hover:bg-primary-light/15
              "
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div
                  key={index}
                  className="
                    group/item flex items-start justify-between gap-2
                    rounded-xl p-2 transition hover:bg-gray-50
                    dark:hover:bg-white/[0.06]
                  "
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${activity.tone}`}
                    >
                      <Icon className="h-3 w-3" />
                    </span>

                    <p className="text-xs leading-6 text-gray-600 dark:text-gray-300">
                      {activity.text}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] text-gray-300 dark:text-gray-600">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto SMS */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <div
            className="
              mb-5 flex items-center justify-between
              border-b border-gray-100 pb-3
              dark:border-white/10
            "
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              پیامک‌های خودکار
            </h3>

            <button
              className="
                rounded-full bg-primary-light/10 px-3 py-1
                text-[11px] font-medium text-primary-dark
                transition hover:bg-primary-light/20
                dark:text-primary-light dark:hover:bg-primary-light/15
              "
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {AUTO_SMS.map((sms) => {
              const Icon = sms.icon;

              return (
                <div
                  key={sms.label}
                  className="
                    flex items-center justify-between rounded-xl p-2
                    transition hover:bg-gray-50
                    dark:hover:bg-white/[0.06]
                  "
                >
                  <span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${sms.tone}`}
                    >
                      <Icon className="h-3 w-3" />
                    </span>

                    {sms.label}
                  </span>

                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {sms.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Birthdays */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <div
            className="
              mb-5 flex items-center justify-between
              border-b border-gray-100 pb-3
              dark:border-white/10
            "
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              تولدهای این هفته
            </h3>

            <button
              className="
                rounded-full bg-primary-light/10 px-3 py-1
                text-[11px] font-medium text-primary-dark
                transition hover:bg-primary-light/20
                dark:text-primary-light dark:hover:bg-primary-light/15
              "
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {BIRTHDAYS.map((birthday) => (
              <div
                key={birthday.name}
                className="
                  flex items-center justify-between rounded-xl p-2
                  transition hover:bg-gray-50
                  dark:hover:bg-white/[0.06]
                "
              >
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {birthday.date}
                </span>

                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-200">
                  {birthday.name}

                  <Gift className="h-3.5 w-3.5 text-pink-400 dark:text-pink-300" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div
          className="
            group relative overflow-hidden rounded-3xl
            border border-gray-100/80 bg-white/90 p-5
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
            backdrop-blur
            dark:border-white/10 dark:bg-white/[0.06]
            dark:shadow-none
          "
        >
          <div
            className="
              mb-5 flex items-center justify-between
              border-b border-gray-100 pb-3
              dark:border-white/10
            "
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              نوبت‌های آینده
            </h3>

            <button
              className="
                rounded-full bg-primary-light/10 px-3 py-1
                text-[11px] font-medium text-primary-dark
                transition hover:bg-primary-light/20
                dark:text-primary-light dark:hover:bg-primary-light/15
              "
            >
              مشاهده همه
            </button>
          </div>

          {appointmentsLoading && (
            <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
              در حال بارگذاری...
            </div>
          )}

          {!appointmentsLoading && (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 4).map((appointment) => (
                <div
                  key={appointment.id}
                  className="
                    flex items-center gap-2.5 rounded-xl p-1
                    transition hover:bg-gray-50
                    dark:hover:bg-white/[0.06]
                  "
                >
                  <Image
                    src="/image/user.PNG"
                    alt="User"
                    width={30}
                    height={30}
                    unoptimized
                    className="h-[30px] w-[30px] rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                      {appointment.patientName}
                    </div>

                    <div className="truncate text-[10px] text-gray-400 dark:text-gray-500">
                      {appointment.serviceName}
                    </div>
                  </div>

                  <span
                    className="shrink-0 text-[11px] text-gray-400 dark:text-gray-500"
                    dir="ltr"
                  >
                    {appointment.startTime
                      ? new Date(appointment.startTime).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "-"}
                  </span>
                </div>
              ))}

              {upcomingAppointments.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  نوبتی ثبت نشده.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
          دسترسی سریع
        </h3>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={`/clinic/${clinicSlug}/${action.href}`}
                  className="
                    flex flex-col items-center gap-2
                    rounded-2xl border border-gray-100 bg-white p-4
                    transition hover:shadow-sm hover:bg-gray-50
                    dark:border-white/10 dark:bg-white/[0.06]
                    dark:hover:bg-white/[0.1]
                  "
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${action.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-center text-[11px] font-medium text-gray-700 dark:text-gray-200">
                    {action.label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                disabled
                title="این بخش هنوز آماده نشده"
                className="
                  flex cursor-not-allowed flex-col items-center gap-2
                  rounded-2xl border border-gray-100 bg-white p-4
                  opacity-50
                  dark:border-white/10 dark:bg-white/[0.04]
                "
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${action.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span className="text-center text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Finance module flag retained for future use */}
      {financeEnabled ? null : null}
    </div>
  );
}