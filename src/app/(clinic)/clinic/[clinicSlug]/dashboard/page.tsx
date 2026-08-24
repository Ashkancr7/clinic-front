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
import { useQuery } from "@tanstack/react-query";

import { useActiveClinic } from "@/hooks/use-active-clinic";
import { queryKeys } from "@/lib/query/keys";
import {
  getClinicDashboard,
  getClinicModules,
  getUpcomingAppointments,
  isFinanceModuleEnabled,
} from "@/lib/api/clinic-dashboard";

// این بخش‌ها هنوز به بک‌اند وصل نشده‌اند چون endpoint مشخصی برایشان
// در اسپک وجود ندارد (فعالیت‌های اخیر، تولدهای این هفته، شکست پیامک‌های
// خودکار بر اساس نوع، روند مراجعات ماهانه، خدمات پرطرفدار، روند درآمد ماهانه).
const TOP_SERVICES = [
  { name: "بوتاکس", value: 1065, percent: 33, color: "#0EA5A4" },
  { name: "فیلر", value: 814, percent: 25, color: "#F9A8D4" },
  { name: "مزوتراپی", value: 658, percent: 20, color: "#C4B5FD" },
  { name: "لیزر موهای زائد", value: 456, percent: 14, color: "#5EEAD4" },
  { name: "مزونیدلینگ", value: 278, percent: 8, color: "#0F766E" },
];
const TOTAL_SERVICES = TOP_SERVICES.reduce((s, x) => s + x.value, 0);

const VISITS_MONTHS = [
  { m: "دی", v: 1400 },
  { m: "بهمن", v: 1800 },
  { m: "اسفند", v: 1900 },
  { m: "فروردین", v: 2400 },
  { m: "اردیبهشت", v: 2600 },
  { m: "خرداد", v: 3000 },
];

const REVENUE_MONTHS = [
  { m: "دی", v: 0.5 },
  { m: "بهمن", v: 0.9 },
  { m: "اسفند", v: 1.1 },
  { m: "فروردین", v: 1.5 },
  { m: "اردیبهشت", v: 2.0 },
  { m: "خرداد", v: 2.65 },
];

const BIRTHDAYS = [
  { date: "۲۵ خرداد", name: "سینا یوسفی" },
  { date: "۲۶ خرداد", name: "نگین محمدی" },
  { date: "۲۷ خرداد", name: "الناز قربانی" },
  { date: "۲۹ خرداد", name: "مهسا رفیعی" },
];

const AUTO_SMS = [
  { icon: Send, tone: "text-primary-dark bg-primary-light/20", value: "۱,۴۴۸", label: "یادآوری نوبت" },
  { icon: Gift, tone: "text-pink-600 bg-secondary-pink/40", value: "۳۲۶", label: "تبریک تولد" },
  { icon: Megaphone, tone: "text-purple-600 bg-secondary-purple/40", value: "۴۸۱", label: "پیام‌های تبلیغاتی" },
  { icon: XCircle, tone: "text-danger bg-red-50", value: "۱۲۹", label: "عودت نوبت لغو شده" },
];

const RECENT_ACTIVITIES = [
  { icon: CalendarCheck, tone: "text-primary-dark bg-primary-light/20", text: "نوبت جدید ثبت شد توسط نگین محمدی", time: "۱۰:۳۲" },
  { icon: CheckCircle2, tone: "text-primary-dark bg-primary-light/20", text: "پرداخت موفق ۲,۴۰۰,۰۰۰ تومان", time: "۱۰:۱۵" },
  { icon: FileText, tone: "text-blue-600 bg-secondary-blue/40", text: "پرونده جدید ایجاد شد برای مهسا رفیعی", time: "۰۹:۴۸" },
  { icon: Send, tone: "text-purple-600 bg-secondary-purple/40", text: "پیامک یادآوری برای ۱۸ نفر ارسال شد", time: "۰۹:۳۰" },
  { icon: XCircle, tone: "text-danger bg-red-50", text: "نوبت لغو شد توسط کاربر", time: "۰۹:۱۲" },
];

const QUICK_ACTIONS = [
  { icon: Briefcase, tone: "text-gray-600 bg-gray-100", label: "مدیریت خدمات" },
  { icon: BarChart3, tone: "text-primary-dark bg-primary-light/20", label: "گزارش درآمد" },
  { icon: Send, tone: "text-pink-600 bg-secondary-pink/40", label: "ارسال پیامک" },
  { icon: Receipt, tone: "text-blue-600 bg-secondary-blue/40", label: "صدور فاکتور" },
  { icon: UserPlus, tone: "text-purple-600 bg-secondary-purple/40", label: "مراجع جدید" },
  { icon: CalendarCheck, tone: "text-primary-dark bg-primary-light/20", label: "نوبت جدید" },
];

function formatValue(v: number | null, suffix = "") {
  if (v === null) return "—";
  return v.toLocaleString("fa-IR") + suffix;
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

  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: queryKeys.dashboard.upcomingAppointments(clinicSlug),
    queryFn: () => getUpcomingAppointments(clinicSlug),
    enabled: !!clinicSlug,
  });

  const financeEnabled = isFinanceModuleEnabled(modules);

   const KPIS = [
    {
      icon: CalendarCheck,
      tone: "text-purple-600 bg-secondary-purple/40",
      label: "نوبت‌های امروز",
      value: formatValue(summary?.appointmentsToday ?? null),
    },
    {
      icon: Users,
      tone: "text-pink-600 bg-secondary-pink/40",
      label: "بیماران جدید امروز",
      value: formatValue(summary?.newPatientsToday ?? null),
    },
    {
      icon: Sparkles,
      tone: "text-primary-dark bg-primary-light/20",
      label: "خدمات انجام‌شده امروز",
      value: formatValue(summary?.servicesPerformedToday ?? null),
    },
    {
      icon: RefreshCcw,
      tone: "text-purple-600 bg-secondary-purple/40",
      label: "نرخ بازگشت مشتری",
      value: formatValue(summary?.returnRatePercent ?? null, "٪"),
    },
  ];

  let cumulative = 0;
  const gradientParts = TOP_SERVICES.map((s) => {
    const start = (cumulative / TOTAL_SERVICES) * 100;
    cumulative += s.value;
    const end = (cumulative / TOTAL_SERVICES) * 100;
    return `${s.color} ${start}% ${end}%`;
  }).join(", ");

  const barMax = Math.max(...VISITS_MONTHS.map((v) => v.v));

  return (
    <div className="space-y-6">
      {/* KPI ها */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${k.tone}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {summaryLoading ? "…" : k.value}
            </div>
            <div className="mt-1 text-xs text-gray-400">{k.label}</div>
          </div>
        ))}
      </div>

      {/* مراجعات و خدمات پرطرفدار — mock تا فرمت /reports/appointments و /reports/services تأیید شود */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">مراجعات در ۶ ماه گذشته</h3>
            <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
              ۶ ماهه <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <svg viewBox="0 0 280 130" className="w-full">
            {VISITS_MONTHS.map((v, i) => {
              const barW = 24;
              const gap = 280 / VISITS_MONTHS.length;
              const barH = (v.v / barMax) * 100;
              const x = i * gap + (gap - barW) / 2;
              return (
                <g key={v.m}>
                  <rect x={x} y={110 - barH} width={barW} height={barH} rx="4" fill="#5EEAD4" />
                  <text x={x + barW / 2} y="124" fontSize="8" fill="#9CA3AF" textAnchor="middle">
                    {v.m}
                  </text>
                </g>
              );
            })}
          </svg>
          <button className="mt-2 flex items-center gap-1 text-xs text-primary-dark">
            <ChevronLeft className="h-3.5 w-3.5" /> گزارش کامل مراجعات
          </button>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <h3 className="mb-4 text-sm font-bold text-gray-800">خدمات پرطرفدار</h3>
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full" style={{ background: `conic-gradient(${gradientParts})` }}>
              <div className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-white p-4 text-center">
                <span className="text-[10px] text-gray-400">کل خدمات</span>
                <span className="text-base font-bold text-gray-800">{TOTAL_SERVICES.toLocaleString("fa-IR")}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-[11px]">
            {TOP_SERVICES.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name}
                </span>
                <span className="text-gray-700">
                  {s.value.toLocaleString("fa-IR")} ({s.percent}٪)
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs text-primary-dark">
            <ChevronLeft className="h-3.5 w-3.5" /> مشاهده همه خدمات
          </button>
        </div>
      </div>

      {/* ۴ کارت پایینی */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* فعالیت‌های اخیر — mock، هیچ endpoint سراسری برای لاگ فعالیت وجود ندارد */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-gray-800">فعالیت‌های اخیر</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((a, i) => (
              <div key={i} className="group/item flex items-start justify-between gap-2 rounded-xl p-2 transition hover:bg-gray-50">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${a.tone}`}>
                    <a.icon className="h-3 w-3" />
                  </span>
                  <p className="text-xs leading-6 text-gray-600">{a.text}</p>
                </div>
                <span className="shrink-0 text-[10px] text-gray-300">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* پیامک‌های خودکار — mock، SmsMessage در بک‌اند نوع/دلیل پیامک را مشخص نمی‌کند */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">پیامک‌های خودکار</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {AUTO_SMS.map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50">
                <span className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${s.tone}`}>
                    <s.icon className="h-3 w-3" />
                  </span>
                  {s.label}
                </span>
                <span className="text-xs font-medium text-gray-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* تولدهای این هفته — mock، فیلتر تولد روی /patients وجود ندارد */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">تولدهای این هفته</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {BIRTHDAYS.map((b) => (
              <div key={b.name} className="flex items-center justify-between rounded-xl p-2 transition hover:bg-gray-50">
                <span className="text-xs text-gray-600">{b.date}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  {b.name}
                  <Gift className="h-3.5 w-3.5 text-pink-400" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* نوبت‌های آینده — از API واقعی */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">نوبت‌های آینده</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>

          {appointmentsLoading && <div className="py-6 text-center text-xs text-gray-400">در حال بارگذاری...</div>}

          {!appointmentsLoading && (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <Image src="/image/user.PNG" alt="User" width={30} height={30} unoptimized className="rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700">{a.patientName}</div>
                    <div className="text-[10px] text-gray-400">{a.serviceName}</div>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {a.startTime ? new Date(a.startTime).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "-"}
                  </span>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-400">نوبتی ثبت نشده.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* دسترسی سریع */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-800">دسترسی سریع</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${a.tone}`}>
                <a.icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-gray-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}