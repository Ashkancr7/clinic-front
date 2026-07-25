"use client";

import { useState } from "react";
import {
  Download,
  ChevronDown,
  Wallet,
  Sparkles,
  UserPlus,
  Receipt,
  Smile,
  Megaphone,
  ArrowLeftRight,
  Stethoscope,
  RefreshCcw,
  Users,
  BarChart3,
  FileText,
  Wallet as WalletIcon,
  Plus,
  RefreshCw,
} from "lucide-react";

const FILTERS = [
  { label: "بازه زمانی", value: "۳۰ روز اخیر" },
  { label: "گروه‌بندی", value: "همه پزشکان" },
  { label: "پزشک", value: "همه پزشکان" },
  { label: "خدمت", value: "همه خدمات" },
  { label: "شعبه", value: "همه شعب" },
];

const TABS = [
  {
    key: "services",
    label: "عملکرد خدمات",
    icon: Stethoscope,
  },
  {
    key: "growth",
    label: "رشد مراجعین",
    icon: UserPlus,
  },
  {
    key: "retention",
    label: "نرخ بازگشت",
    icon: RefreshCcw,
  },
  {
    key: "doctors",
    label: "عملکرد پزشکان",
    icon: Users,
  },
  {
    key: "conversion",
    label: "تبدیل نوبت به خدمت",
    icon: ArrowLeftRight,
  },
  {
    key: "marketing",
    label: "اثربخشی بازاریابی",
    icon: Megaphone,
  },
];

const KPIS = [
  { icon: Smile, tone: "text-primary-dark bg-primary-light/20", label: "نرخ رضایت کلی", value: "۹۴٪", unit: "از ۵", trend: "+۴٪" },
  { icon: Receipt, tone: "text-blue-600 bg-secondary-blue/40", label: "میانگین هزینه هر خدمت", value: "۱,۹۳۲,۰۰۰", unit: "تومان", trend: "+۶٪" },
  { icon: UserPlus, tone: "text-pink-600 bg-secondary-pink/40", label: "تعداد مراجعین جدید", value: "۶۵۷", unit: "نفر", trend: "+۲۸٪" },
  { icon: Sparkles, tone: "text-purple-600 bg-secondary-purple/40", label: "تعداد خدمات ارائه‌شده", value: "۱,۳۶۸", unit: "خدمت", trend: "+۱۹٪" },
  { icon: Wallet, tone: "text-primary-dark bg-primary-light/20", label: "کل درآمد", value: "۲,۶۴۸,۰۰۰,۰۰۰", unit: "تومان", trend: "+۳۴٪" },
];

const REVENUE_BY_CATEGORY = [
  { name: "پوست و جوانسازی", percent: 38, amount: "۱,۰۰۶م", color: "#0EA5A4" },
  { name: "لیزر موهای زائد", percent: 24, amount: "۶۳۵م", color: "#F9A8D4" },
  { name: "تزریق و بوتاکس", percent: 18, amount: "۴۷۷م", color: "#5EEAD4" },
  { name: "کاشت و تقویت مو", percent: 14, amount: "۲۶۵م", color: "#C4B5FD" },
  { name: "مدیکال فیشیال", percent: 7, amount: "۱۸۶م", color: "#FBBF24" },
  { name: "سایر خدمات", percent: 3, amount: "۷۹م", color: "#D1D5DB" },
];
const TOTAL_REVENUE_LABEL = "۲,۶۴۸م";

const MONTHLY_REVENUE = [
  { m: "خرداد", v: 1.9 }, { m: "تیر", v: 2.0 }, { m: "مرداد", v: 2.1 }, { m: "شهریور", v: 2.3 },
  { m: "مهر", v: 2.4 }, { m: "آبان", v: 2.6 }, { m: "آذر", v: 2.2 }, { m: "دی", v: 2.5 },
  { m: "بهمن", v: 2.6 }, { m: "اسفند", v: 2.55 }, { m: "فروردین", v: 2.3 }, { m: "اردیبهشت", v: 2.65 },
];

const TREND_MONTHS = [
  { m: "آذر", revenue: 1.5, services: 900 },
  { m: "دی", revenue: 2.0, services: 1050 },
  { m: "بهمن", revenue: 2.4, services: 1300 },
  { m: "اسفند", revenue: 2.8, services: 1200 },
  { m: "فروردین", revenue: 3.2, services: 1250 },
  { m: "اردیبهشت", revenue: 3.6, services: 1368 },
];

const DOCTOR_PERFORMANCE = [
  { rank: 1, name: "دکتر سارا محمدی", services: 286, revenue: "۴۵۶,۰۰۰,۰۰۰", avg: "۲,۹۹۶,۰۰۰" },
  { rank: 2, name: "دکتر نیما یوسفی", services: 243, revenue: "۷۱۲,۰۰۰,۰۰۰", avg: "۲,۹۲۶,۰۰۰" },
  { rank: 3, name: "دکتر الهام رضایی", services: 198, revenue: "۵۸۳,۰۰۰,۰۰۰", avg: "۲,۹۴۴,۰۰۰" },
  { rank: 4, name: "دکتر مهسا افشار", services: 171, revenue: "۴۹۲,۰۰۰,۰۰۰", avg: "۲,۸۷۷,۰۰۰" },
  { rank: 5, name: "دکتر آرش نادری", services: 139, revenue: "۳۸۵,۰۰۰,۰۰۰", avg: "۲,۷۶۹,۰۰۰" },
];

const RETENTION = [
  { label: "بازگشت در بازه ۳۰ روز", value: "۱۸٪" },
  { label: "بازگشت در بازه ۳۰ تا ۹۰ روز", value: "۱۱٪" },
  { label: "بازگشت در بازه بیش از ۹۰ روز", value: "۴٪" },
];

const FUNNEL = [
  { label: "نوبت‌های ثبت شده", value: "۲,۸۵۶", percent: 100 },
  { label: "نوبت‌های حضور یافته", value: "۲,۱۴۵", percent: 75 },
  { label: "انجام خدمت", value: "۱,۶۳۲", percent: 57 },
  { label: "پرداخت", value: "۱,۴۸۸", percent: 52 },
];

const DOWNLOADS = [
  {
    icon: Users,
    tone: "text-primary-dark bg-primary-light/20",
    title: "گزارش مراجعین",
  },
  {
    icon: Megaphone,
    tone: "text-pink-600 bg-secondary-pink/40",
    title: "گزارش بازاریابی",
  },
  {
    icon: Stethoscope,
    tone: "text-purple-600 bg-secondary-purple/40",
    title: "گزارش عملکرد پزشکان",
  },
  {
    icon: WalletIcon,
    tone: "text-blue-600 bg-secondary-blue/40",
    title: "گزارش مالی",
  },
  {
    icon: Sparkles,
    tone: "text-primary-dark bg-primary-light/20",
    title: "گزارش خدمات",
  },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("services");

  let cumulative = 0;
  const donutGradient = REVENUE_BY_CATEGORY.map((c) => {
    const start = cumulative;
    cumulative += c.percent;
    return `${c.color} ${start}% ${cumulative}%`;
  }).join(", ");

  const barMax = Math.max(...MONTHLY_REVENUE.map((m) => m.v));
  const barChartW = 320, barChartH = 110;

  const lineChartW = 320, lineChartH = 130;
  const revMax = Math.max(...TREND_MONTHS.map((t) => t.revenue));
  const svcMax = Math.max(...TREND_MONTHS.map((t) => t.services));
  const stepX = lineChartW / (TREND_MONTHS.length - 1);
  const revCoords = TREND_MONTHS.map((t, i) => ({ x: i * stepX, y: lineChartH - (t.revenue / (revMax + 0.5)) * lineChartH }));
  const svcCoords = TREND_MONTHS.map((t, i) => ({ x: i * stepX, y: lineChartH - (t.services / (svcMax + 150)) * lineChartH }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">گزارش‌های کامل</h1>
        <p className="mt-1 text-sm text-gray-400">تحلیل دقیق عملکرد کلینیک در بازه‌های زمانی مختلف</p>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap items-center gap-2">
       
        {FILTERS.map((f) => (
          <button key={f.label} className="flex items-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-600">
            <span className="text-gray-400">{f.label}:</span> {f.value} <ChevronDown className="h-3 w-3 text-gray-300" />
          </button>
        ))}

         <button className="flex items-center ms-auto gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-medium text-white hover:bg-primary-dark">
          <Download className="h-3.5 w-3.5" /> خروجی و دانلود <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* تب‌ها */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4">
        <div className="flex min-w-max items-center gap-5 text-xs">
          {TABS.map((t) => {
            const Icon = t.icon;

            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 transition-all ${tab === t.key
                  ? "border-primary font-medium text-primary-dark"
                  : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 transition-all ${tab === t.key ? "scale-110 text-primary" : "text-gray-400"
                    }`}
                />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI ها */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{k.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${k.tone}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">{k.value}</div>
            <div className="text-[10px] text-gray-400">{k.unit}</div>
            <div className="mt-2 text-[11px] font-medium text-primary-dark">{k.trend} ↑</div>
          </div>
        ))}
      </div>

      {/* ردیف نمودارها ۱ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">روند درآمد و خدمات</h3>
            <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
              ۶ ماهه <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="mb-1 flex items-center gap-3 text-[9px] text-gray-500">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> درآمد (تومان)</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> تعداد خدمات</span>
          </div>
          <svg viewBox={`-5 0 ${lineChartW + 10} ${lineChartH + 20}`} className="w-full">
            <polyline points={revCoords.map((c) => `${c.x},${c.y}`).join(" ")} fill="none" stroke="#0EA5A4" strokeWidth="2.5" />
            <polyline points={svcCoords.map((c) => `${c.x},${c.y}`).join(" ")} fill="none" stroke="#C084FC" strokeWidth="2.5" />
            {revCoords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="2.5" fill="#0EA5A4" />)}
            {svcCoords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="2.5" fill="#C084FC" />)}
            {TREND_MONTHS.map((t, i) => (
              <text key={t.m} x={revCoords[i].x} y={lineChartH + 14} fontSize="6.5" fill="#9CA3AF" textAnchor="middle">{t.m}</text>
            ))}
          </svg>
          <button className="mt-2 text-[11px] text-primary-dark">گزارش کامل</button>
        </div>



        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">درآمد ماهانه</h3>
            <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
              ۱۲ ماهه <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <svg viewBox={`0 0 ${barChartW} ${barChartH + 20}`} className="w-full">
            {MONTHLY_REVENUE.map((m, i) => {
              const gap = barChartW / MONTHLY_REVENUE.length;
              const barW = gap * 0.55;
              const barH = (m.v / barMax) * barChartH;
              const x = i * gap + (gap - barW) / 2;
              return (
                <g key={m.m}>
                  <rect x={x} y={barChartH - barH} width={barW} height={barH} rx="3" fill="#5EEAD4" />
                  <text x={x + barW / 2} y={barChartH + 12} fontSize="6.5" fill="#9CA3AF" textAnchor="middle">{m.m}</text>
                </g>
              );
            })}
          </svg>
          <button className="mt-2 text-[11px] text-primary-dark">مشاهده جزئیات</button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-gray-800">توزیع درآمد بر اساس دسته خدمات</h3>
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full" style={{ background: `conic-gradient(${donutGradient})` }}>
              <div className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-white p-3 text-center">
                <span className="text-[9px] text-gray-400">کل درآمد</span>
                <span className="text-sm font-bold text-gray-800">{TOTAL_REVENUE_LABEL}</span>
                <span className="text-[8px] text-gray-400">تومان</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 text-[10px]">
            {REVENUE_BY_CATEGORY.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}
                </span>
                <span className="text-gray-700">{c.percent}٪ · {c.amount}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 text-[11px] text-primary-dark">مشاهده گزارش کامل خدمات</button>
        </div>


      </div>

      {/* ردیف نمودارها ۲ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 flex items-center gap-1.5 text-sm font-bold text-gray-800">
            <ArrowLeftRight className="h-4 w-4 text-primary-dark" /> تبدیل نوبت به خدمت
          </h3>
          <div className="space-y-2">
            {FUNNEL.map((f, i) => (
              <div key={f.label} className="flex items-center gap-2">
                <div
                  className="flex h-8 items-center justify-between rounded-lg bg-primary-light/20 px-3 text-[10px] text-primary-dark"
                  style={{ width: `${f.percent}%`, opacity: 1 - i * 0.12 }}
                >
                  <span>{f.value}</span>
                  <span>{f.percent}٪</span>
                </div>
                <span className="w-24 shrink-0 text-[10px] text-gray-500">{f.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-[11px]">
            <span className="text-gray-500">نرخ تبدیل نهایی</span>
            <span className="font-bold text-primary-dark">۵۲٪</span>
          </div>
          <button className="mt-2 text-[11px] text-primary-dark">مشاهده جزئیات تبدیل</button>
        </div>



        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-gray-800">نرخ بازگشت مراجعین</h3>
          <div className="flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full" style={{ background: "conic-gradient(#0EA5A4 0 34%, #E5E7EB 34% 100%)" }}>
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-lg font-bold text-gray-800">۳۴٪</span>
                <span className="text-[8px] text-gray-400">نرخ بازگشت کلی</span>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-[11px]">
            {RETENTION.map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-medium text-gray-700">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-primary-dark">+۶٪ نسبت به ماه قبل</div>
          <button className="mt-2 text-[11px] text-primary-dark">مشاهده تحلیل بازگشت</button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold text-gray-800">عملکرد پزشکان (بر اساس درآمد)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-[10px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-2 font-medium">رتبه</th>
                  <th className="pb-2 font-medium">پزشک</th>
                  <th className="pb-2 font-medium">تعداد خدمات</th>
                  <th className="pb-2 font-medium">درآمد</th>
                  <th className="pb-2 font-medium">میانگین هر خدمت</th>
                </tr>
              </thead>
              <tbody>
                {DOCTOR_PERFORMANCE.map((d) => (
                  <tr key={d.rank} className="border-b border-gray-50">
                    <td className="py-2 text-gray-500">{d.rank.toLocaleString("fa-IR")}</td>
                    <td className="py-2 text-gray-700">{d.name}</td>
                    <td className="py-2 text-gray-500">{d.services.toLocaleString("fa-IR")}</td>
                    <td className="py-2 text-gray-700">{d.revenue}</td>
                    <td className="py-2 text-gray-500">{d.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-3 text-[11px] text-primary-dark">مشاهده رتبه‌بندی کامل</button>
        </div>

      </div>

      {/* خروجی گزارش‌ها */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="mb-4 text-center text-sm font-bold text-gray-800">خروجی و دانلود گزارش‌ها</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {DOWNLOADS.map((d) => (
            <button key={d.title} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 p-4 text-center hover:shadow-sm">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${d.tone}`}>
                <d.icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-medium text-gray-700">{d.title}</span>
              <span className="text-[9px] text-gray-400">PDF / Excel</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 p-4 text-center text-gray-400 hover:bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium">گزارش سفارشی</span>
            <span className="text-[9px]">ساخت گزارش دلخواه</span>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <RefreshCw className="h-3.5 w-3.5" /> آخرین به‌روزرسانی گزارش‌ها: ۱۴۰۳/۰۲/۳۱
        </div>
      </div>
    </div>
  );
}
