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


const KPIS = [
  {
    icon: Users,
    tone: "text-pink-600 bg-secondary-pink/40",
    label: "مراجعه‌کنندگان این ماه",
    value: "۲,۴۸۶",
    trend: "+۲۸٪",
    trendUp: true,
    spark: [4, 5, 7, 8, 9, 12],
  },
  {
    icon: CalendarCheck,
    tone: "text-purple-600 bg-secondary-purple/40",
    label: "نوبت‌های امروز",
    value: "۲۸",
    trend: "+۳ نسبت به دیروز",
    trendUp: true,
    spark: [6, 7, 6, 8, 7, 9],
  },
  {
    icon: Sparkles,
    tone: "text-primary-dark bg-primary-light/20",
    label: "خدمات انجام‌شده این ماه",
    value: "۱,۳۶۸",
    trend: "+۱۹٪",
    trendUp: true,
    spark: [5, 6, 6, 8, 9, 10],
  },
  {
    icon: RefreshCcw,
    tone: "text-purple-600 bg-secondary-purple/40",
    label: "نرخ بازگشت مشتری",
    value: "۶۳٪",
    trend: "+۷٪",
    trendUp: true,
    spark: [8, 7, 9, 8, 10, 11],
  },
  {
    icon: Wallet,
    tone: "text-primary-dark bg-primary-light/20",
    label: "درآمد این ماه",
    value: "۲,۶۴۸,۰۰۰,۰۰۰",
    trend: "+۱۴٪",
    trendUp: true,
    spark: [4, 6, 5, 8, 9, 12],
  },
];

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

const UPCOMING_APPOINTMENTS = [
  { time: "۱۰:۰۰", name: "سینا یوسفی", service: "بوتاکس" },
  { time: "۱۱:۳۰", name: "نگین محمدی", service: "فیلر لب" },
  { time: "۱۴:۰۰", name: "الناز قربانی", service: "مزوتراپی" },
  { time: "۱۵:۳۰", name: "فرزانه احمدی", service: "لیزر صورت" },
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

function Sparkline({ data, color = "#0EA5A4" }: { data: number[]; color?: string }) {
  const w = 100;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const stepX = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * stepX},${h - ((v - min) / (max - min || 1)) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-24">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function ClinicDashboardPage() {
  let cumulative = 0;
  const gradientParts = TOP_SERVICES.map((s) => {
    const start = (cumulative / TOTAL_SERVICES) * 100;
    cumulative += s.value;
    const end = (cumulative / TOTAL_SERVICES) * 100;
    return `${s.color} ${start}% ${end}%`;
  }).join(", ");

  const barMax = Math.max(...VISITS_MONTHS.map((v) => v.v));
  const lineMax = Math.max(...REVENUE_MONTHS.map((v) => v.v));
  const chartW = 280;
  const chartH = 110;
  const stepX = chartW / (REVENUE_MONTHS.length - 1);
  const lineCoords = REVENUE_MONTHS.map((r, i) => ({
    x: i * stepX,
    y: chartH - (r.v / (lineMax + 0.5)) * chartH,
  }));
  const linePoints = lineCoords.map((c) => `${c.x},${c.y}`).join(" ");

  return (
    <div className="space-y-6">
      {/* KPI ها */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">

              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${k.tone}`}>
                <k.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-400">{k.label}</span>

            </div>
            <div className="text-lg font-bold text-gray-900">{k.value}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-primary-dark">{k.trend} ↑</span>
              <Sparkline data={k.spark} />
            </div>
          </div>
        ))}
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* روند درآمد */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">روند درآمد در ۶ ماه گذشته</h3>
            <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
              ۶ ماهه <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <svg viewBox={`-10 0 ${chartW + 20} ${chartH + 20}`} className="w-full">
            <polyline points={linePoints} fill="none" stroke="#0EA5A4" strokeWidth="2.5" />
            {lineCoords.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r="3" fill="#0EA5A4" />
            ))}
            {REVENUE_MONTHS.map((r, i) => (
              <text key={r.m} x={lineCoords[i].x} y={chartH + 14} fontSize="8" fill="#9CA3AF" textAnchor="middle">
                {r.m}
              </text>
            ))}
          </svg>
          <button className="mt-2 flex items-center gap-1 text-xs text-primary-dark">
            <ChevronLeft className="h-3.5 w-3.5" /> گزارش مالی جامع
          </button>
        </div>


        {/* مراجعات ۶ ماه گذشته */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
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
        {/* خدمات پرطرفدار */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <h3 className="mb-4 text-sm font-bold text-gray-800">خدمات پرطرفدار</h3>
          <div className="flex justify-center">
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full"
              style={{ background: `conic-gradient(${gradientParts})` }}
            >
              <div className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-white p-4 text-center">
                <span className="text-[10px] text-gray-400">کل خدمات</span>
                <span className="text-base font-bold text-gray-800">{TOTAL_SERVICES.toLocaleString("fa-IR")}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-[11px]">
            {TOP_SERVICES.map((s) => (
              <div key={s.name} className="rounded-xl p-2 transition hover:bg-gray-50 flex items-center justify-between">
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
        {/* فعالیت‌های اخیر */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
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

        {/* پیامک‌های خودکار */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">پیامک‌های خودکار</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {AUTO_SMS.map((s) => (
              <div key={s.label} className="rounded-xl p-2 transition hover:bg-gray-50 flex items-center justify-between">
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


        {/* تولدهای این هفته */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">تولدهای این هفته</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {BIRTHDAYS.map((b) => (
              <div key={b.name} className="rounded-xl p-2 transition hover:bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-600">{b.date}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                  {b.name}
                  <Gift className="h-3.5 w-3.5 text-pink-400" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* نوبت‌های آینده */}
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100/80 bg-white/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800">نوبت‌های آینده</h3>
            <button className="rounded-full bg-primary-light/10 px-3 py-1 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/20">مشاهده همه</button>
          </div>
          <div className="space-y-3">
            {UPCOMING_APPOINTMENTS.map((a) => (
              <div key={a.time} className="flex items-center gap-2.5">
                <Image
                  src="/image/user.PNG"
                  alt="User"
                  width={30}
                  height={30}
                  unoptimized
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-700">{a.name}</div>
                  <div className="text-[10px] text-gray-400">{a.service}</div>
                </div>
                <span className="text-[11px] text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-primary-light/20 bg-gradient-to-r from-primary-light/10 to-purple-100/40 py-3 text-center text-xs font-bold text-primary-dark shadow-inner">
            جمع نوبت‌های امروز: ۲۸ مورد
          </div>
        </div>


      </div>

      {/* دسترسی سریع */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-800">دسترسی سریع</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm"
            >
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
