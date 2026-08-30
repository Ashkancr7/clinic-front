
"use client";

import {
  Plus,
  Receipt,
  Download,
  Wallet,
  RefreshCcw,
  Hourglass,
  FileText,
  Users2,
  ChevronDown,
  Banknote,
  CreditCard,
  Globe,
  Landmark,
  Printer as PrinterIcon,
  Search,
  MoreHorizontal,
} from "lucide-react";

const KPIS = [
  {
    icon: Users2,
    tone: "text-primary-dark bg-primary-light/20 dark:text-primary-light dark:bg-primary/15",
    label: "تعداد دریافت‌ها",
    value: "۳۲۱",
    unit: "دریافت",
    trend: "+۱۳٪",
  },
  {
    icon: Receipt,
    tone: "text-pink-600 bg-secondary-pink/40 dark:text-pink-300 dark:bg-pink-500/15",
    label: "میانگین مبلغ هر فاکتور",
    value: "۹,۲۶۸,۰۰۰",
    unit: "تومان",
    trend: "+۶٪",
  },
  {
    icon: FileText,
    tone: "text-purple-600 bg-secondary-purple/40 dark:text-purple-300 dark:bg-purple-500/15",
    label: "تعداد فاکتورهای این ماه",
    value: "۲۸۶",
    unit: "فاکتور",
    trend: "+۱۸٪",
  },
  {
    icon: Hourglass,
    tone: "text-danger bg-red-50 dark:text-red-300 dark:bg-red-500/15",
    label: "باقی‌مانده وصول‌نشده",
    value: "۳۰۱,۰۰۰,۰۰۰",
    unit: "تومان",
    trend: "-۸٪",
    down: true,
  },
  {
    icon: RefreshCcw,
    tone: "text-blue-600 bg-secondary-blue/40 dark:text-blue-300 dark:bg-blue-500/15",
    label: "دریافت‌شده این ماه",
    value: "۲,۳۴۷,۰۰۰,۰۰۰",
    unit: "تومان",
    trend: "+۲۱٪",
  },
  {
    icon: Wallet,
    tone: "text-primary-dark bg-primary-light/20 dark:text-primary-light dark:bg-primary/15",
    label: "درآمد کل این ماه",
    value: "۲,۶۴۸,۰۰۰,۰۰۰",
    unit: "تومان",
    trend: "+۲۶٪",
  },
];

const OVERDUE_DEBTS = [
  { name: "مینا حسینی", amount: "۹۵۰,۰۰۰", days: "۱۲" },
  { name: "نگین محمدی", amount: "۸,۷۰۰,۰۰۰", days: "۷" },
  { name: "الهام قربانی", amount: "۶,۲۰۰,۰۰۰", days: "۷" },
  { name: "مهسا رفیعی", amount: "۵,۳۰۰,۰۰۰", days: "۵" },
  { name: "پوریا شریفی", amount: "۴,۰۰۰,۰۰۰", days: "۳" },
];

const REVENUE_BY_SERVICE = [
  {
    name: "لیزر موهای زائد",
    percent: 36,
    amount: "۹۵۲م",
    color: "#0EA5A4",
  },
  {
    name: "فیشیال و پاکسازی",
    percent: 22,
    amount: "۵۸۲م",
    color: "#C4B5FD",
  },
  {
    name: "بوتاکس و فیلر",
    percent: 18,
    amount: "۴۷۷م",
    color: "#F9A8D4",
  },
  {
    name: "جوانسازی پوست",
    percent: 12,
    amount: "۳۱۸م",
    color: "#5EEAD4",
  },
  {
    name: "کاشت مو",
    percent: 7,
    amount: "۱۸۴م",
    color: "#FBBF24",
  },
  {
    name: "سایر خدمات",
    percent: 5,
    amount: "۱۳۳م",
    color: "#D1D5DB",
  },
];

const RECEIPTS_TREND = [
  { m: "بهمن", v: 0.4 },
  { m: "اسفند", v: 0.9 },
  { m: "فروردین", v: 1.6 },
  { m: "اردیبهشت", v: 1.8 },
  { m: "خرداد", v: 2.3 },
  { m: "تیر", v: 2.9 },
];

const PAYMENT_STATUS_FILTERS = [
  { label: "همه", value: "864" },
  { label: "تکمیل شده", value: "۵۶۲", dot: "bg-primary" },
  { label: "در انتظار پرداخت", value: "۱۸۶", dot: "bg-warning" },
  { label: "سررسید گذشته", value: "۶۵", dot: "bg-danger" },
  {
    label: "بازپرداخت شده",
    value: "۲۲",
    dot: "bg-purple-500",
  },
  {
    label: "ابطال شده",
    value: "۲۹",
    dot: "bg-gray-400 dark:bg-gray-500",
  },
];

const SELECTED_INVOICE = {
  id: "INV-1403-03-233-001",
  customer: "مینا حسینی",
  date: "۱۴۰۳/۰۳/۲۳",
  total: "۱۲,۵۰۰,۰۰۰",
  paid: "۱۲,۵۰۰,۰۰۰",
  remaining: "۰",
  status: "تکمیل شده",
};

const PAYMENT_METHODS = [
  {
    icon: Banknote,
    tone: "text-primary-dark bg-primary-light/20 dark:text-primary-light dark:bg-primary/15",
    label: "نقدی",
    amount: "۹۵۳,۰۰۰,۰۰۰",
    percent: "۳۶٪",
  },
  {
    icon: CreditCard,
    tone: "text-blue-600 bg-secondary-blue/40 dark:text-blue-300 dark:bg-blue-500/15",
    label: "کارتخوان",
    amount: "۱,۲۶۷,۰۰۰,۰۰۰",
    percent: "۴۸٪",
  },
  {
    icon: Globe,
    tone: "text-purple-600 bg-secondary-purple/40 dark:text-purple-300 dark:bg-purple-500/15",
    label: "آنلاین",
    amount: "۳۲۸,۰۰۰,۰۰۰",
    percent: "۱۲٪",
  },
  {
    icon: Landmark,
    tone: "text-pink-600 bg-secondary-pink/40 dark:text-pink-300 dark:bg-pink-500/15",
    label: "انتقال بانکی",
    amount: "۱۰۰,۰۰۰,۰۰۰",
    percent: "۴٪",
  },
];

const TODAY_SUMMARY = [
  { label: "دریافت کارت", value: "۱۲۵,۰۰۰,۰۰۰", receipts: "۱۵" },
  { label: "دریافت آنلاین", value: "۲۱۶,۰۰۰,۰۰۰", receipts: "۲۴" },
  { label: "دریافت نقدی", value: "۸۷,۰۰۰,۰۰۰", receipts: "۱۶" },
  { label: "جمع کل", value: "۴۲۸,۰۰۰,۰۰۰", receipts: "۵۵" },
];

const TRANSACTIONS = [
  {
    customer: "مینا حسینی",
    method: "کارتخوان",
    amount: "۱۲,۵۰۰,۰۰۰",
    ref: "INV-1403-03-233-001",
    date: "۱۴۰۳/۰۳/۲۳ - ۱۶:۱۰",
    status: "تکمیل شده",
  },
  {
    customer: "نگین محمدی",
    method: "نقدی",
    amount: "۸,۷۰۰,۰۰۰",
    ref: "INV-1403-03-233-002",
    date: "۱۴۰۳/۰۳/۲۳ - ۱۰:۵۵",
    status: "تکمیل شده",
  },
  {
    customer: "الهام قربانی",
    method: "آنلاین",
    amount: "۶,۲۰۰,۰۰۰",
    ref: "INV-1403-03-233-003",
    date: "۱۴۰۳/۰۳/۲۲ - ۱۴:۳۰",
    status: "تکمیل شده",
  },
  {
    customer: "پوریا شریفی",
    method: "کارتخوان",
    amount: "۷,۰۰۰,۰۰۰",
    ref: "REF-1403-03-233-001",
    date: "۱۴۰۳/۰۳/۲۳ - ۱۳:۱۵",
    status: "بازپرداخت شده",
  },
  {
    customer: "مهسا رفیعی",
    method: "اعتباری",
    amount: "۵,۳۰۰,۰۰۰",
    ref: "INV-1403-03-233-004",
    date: "۱۴۰۳/۰۳/۲۳ - ۱۱:۰۰",
    status: "در انتظار پرداخت",
  },
];

const STATUS_TONE: Record<string, string> = {
  "تکمیل شده":
    "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light",

  "بازپرداخت شده":
    "bg-secondary-purple/40 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",

  "در انتظار پرداخت":
    "bg-amber-50 text-warning dark:bg-amber-500/15 dark:text-amber-300",
};

const INSTALLMENTS = [
  {
    label: "تسویه شده",
    value: "۱۸۳",
    percent: 44,
    color: "#0EA5A4",
  },
  {
    label: "در حال پرداخت",
    value: "۱۶",
    percent: 38,
    color: "#C4B5FD",
  },
  {
    label: "معوق",
    value: "۵",
    percent: 14,
    color: "#FBBF24",
  },
  {
    label: "لغو شده",
    value: "۴",
    percent: 5,
    color: "#F9A8D4",
  },
];

const CHEQUES = [
  {
    status: "در انتظار وصول",
    tone: "bg-amber-50 text-warning dark:bg-amber-500/15 dark:text-amber-300",
    due: "۱۴۰۳/۰۴/۱۵",
    number: "۱۲۳۴۵۶",
    bank: "ملت",
  },
  {
    status: "در انتظار وصول",
    tone: "bg-amber-50 text-warning dark:bg-amber-500/15 dark:text-amber-300",
    due: "۱۴۰۳/۰۵/۲۰",
    number: "۵۶۴۳۲۱",
    bank: "ملی",
  },
  {
    status: "وصول شده",
    tone:
      "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light",
    due: "۱۴۰۳/۰۶/۱۰",
    number: "۹۸۷۶۵۴",
    bank: "پارسیان",
  },
];

const EXPENSES = [
  { label: "حقوق و دستمزد", amount: "۱۸۵,۰۰۰,۰۰۰" },
  { label: "اجاره و شارژ", amount: "۶۵,۰۰۰,۰۰۰" },
  { label: "خرید مواد مصرفی", amount: "۲۸,۰۰۰,۰۰۰" },
  { label: "تبلیغات و بازاریابی", amount: "۱۵,۰۰۰,۰۰۰" },
];

const QUICK_ACTIONS = [
  "ثبت دریافت جدید",
  "بازپرداخت وجه",
  "ارسال پیامک یادآوری",
  "ثبت هزینه جدید",
];

export default function FinancePaymentsPage() {
  let cumulative = 0;

  const donutGradient = REVENUE_BY_SERVICE.map((c) => {
    const start = cumulative;
    cumulative += c.percent;

    return `${c.color} ${start}% ${cumulative}%`;
  }).join(", ");

  const lineW = 300;
  const lineH = 110;

  const maxV = Math.max(...RECEIPTS_TREND.map((r) => r.v));

  const stepX = lineW / (RECEIPTS_TREND.length - 1);

  const coords = RECEIPTS_TREND.map((r, i) => ({
    x: i * stepX,
    y: lineH - (r.v / (maxV + 0.3)) * lineH,
  }));

  let instCumulative = 0;

  const instGradient = INSTALLMENTS.map((c) => {
    const start = instCumulative;
    instCumulative += c.percent;

    return `${c.color} ${start}% ${instCumulative}%`;
  }).join(", ");

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            مالی و پرداخت‌ها
          </h1>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            داشبورد &lt; مالی و پرداخت‌ها
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-white transition hover:bg-primary-dark">
            <Plus className="h-3.5 w-3.5" />
            صدور فاکتور جدید
          </button>

          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Receipt className="h-3.5 w-3.5" />
            ثبت دریافت
          </button>

          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <PrinterIcon className="h-3.5 w-3.5" />
            چاپ رسید
          </button>

          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="h-3.5 w-3.5" />
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {k.label}
              </span>

              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${k.tone}`}
              >
                <k.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="text-base font-bold text-gray-900 dark:text-gray-100">
              {k.value}
            </div>

            <div className="text-[9px] text-gray-400 dark:text-gray-500">
              {k.unit}
            </div>

            <div
              className={`mt-1.5 text-[10px] font-medium ${
                k.down
                  ? "text-danger"
                  : "text-primary-dark dark:text-primary-light"
              }`}
            >
              {k.trend} {k.down ? "↓" : "↑"}
            </div>
          </div>
        ))}
      </div>

      {/* Main analytics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Payment filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
            فیلتر وضعیت پرداخت
          </h3>

          <div className="space-y-2">
            {PAYMENT_STATUS_FILTERS.map((f) => (
              <button
                key={f.label}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[11px] transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  {f.dot && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${f.dot}`}
                    />
                  )}

                  {f.label}
                </span>

                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {f.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Receipts analysis */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
              تجزیه و تحلیل دریافت‌ها
            </h3>

            <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[9px] text-gray-500 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
              ۶ ماهه
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <svg
            viewBox={`-5 0 ${lineW + 10} ${lineH + 20}`}
            className="w-full"
          >
            <polyline
              points={coords
                .map((c) => `${c.x},${c.y}`)
                .join(" ")}
              fill="none"
              stroke="#0EA5A4"
              strokeWidth="2.5"
            />

            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r="3"
                fill="#0EA5A4"
              />
            ))}

            {RECEIPTS_TREND.map((r, i) => (
              <text
                key={r.m}
                x={coords[i].x}
                y={lineH + 14}
                fontSize="7"
                fill="#9CA3AF"
                textAnchor="middle"
              >
                {r.m}
              </text>
            ))}
          </svg>

          <button className="mt-1 text-[11px] text-primary-dark transition hover:text-primary dark:text-primary-light">
            گزارش کامل دریافت‌ها
          </button>
        </div>

        {/* Revenue by service */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
            نمودار درآمد به تفکیک خدمات
          </h3>

          <div className="flex justify-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${donutGradient})`,
              }}
            >
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-center dark:bg-gray-900">
                <span className="text-[8px] text-gray-400 dark:text-gray-500">
                  کل درآمد
                </span>

                <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  ۲,۶۴۸م
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1 text-[9px]">
            {REVENUE_BY_SERVICE.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />

                  {s.name}
                </span>

                <span className="text-gray-700 dark:text-gray-300">
                  {s.percent}٪ {s.amount}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-2 text-[11px] text-primary-dark transition hover:text-primary dark:text-primary-light">
            گزارش کامل خدمات
          </button>
        </div>

        {/* Overdue debts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
            بدهی‌های سررسید گذشته
          </h3>

          <div className="space-y-2.5">
            {OVERDUE_DEBTS.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {d.name}
                </span>

                <div className="text-left">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {d.amount} تومان
                  </div>

                  <div className="text-[9px] text-danger">
                    {d.days} روز گذشته
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-3 text-[11px] text-primary-dark dark:text-primary-light">
            مشاهده همه بدهی‌ها
          </button>
        </div>
      </div>

      {/* Invoice / today / payment methods */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Selected invoice */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            جزئیات فاکتور منتخب
          </h3>

          <div className="space-y-1.5 text-[11px]">
            <Row
              label="شماره فاکتور"
              value={SELECTED_INVOICE.id}
              dir="ltr"
            />

            <Row
              label="مشتری"
              value={SELECTED_INVOICE.customer}
            />

            <Row
              label="تاریخ"
              value={SELECTED_INVOICE.date}
            />

            <Row
              label="مبلغ کل"
              value={`${SELECTED_INVOICE.total} تومان`}
            />

            <Row
              label="مبلغ دریافت‌شده"
              value={`${SELECTED_INVOICE.paid} تومان`}
            />

            <Row
              label="باقی‌مانده"
              value={`${SELECTED_INVOICE.remaining} تومان`}
            />

            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">
                وضعیت
              </span>

              <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-[10px] text-primary-dark dark:bg-primary/15 dark:text-primary-light">
                {SELECTED_INVOICE.status}
              </span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-[11px] text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              فاکتور
            </button>

            <button className="flex-1 rounded-lg bg-primary py-2 text-[11px] font-medium text-white transition hover:bg-primary-dark">
              چاپ فاکتور
            </button>
          </div>
        </div>

        {/* Today summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
            خلاصه امروز (۱۴۰۳/۰۳/۲۳)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {TODAY_SUMMARY.map((t) => (
              <div
                key={t.label}
                className="rounded-xl bg-gray-50 p-2.5 text-center transition dark:bg-gray-800/70"
              >
                <div className="text-xs font-bold text-gray-800 dark:text-gray-100">
                  {t.value}
                </div>

                <div className="text-[9px] text-gray-400 dark:text-gray-500">
                  {t.label}
                </div>

                <div className="text-[9px] text-gray-400 dark:text-gray-500">
                  {t.receipts} فیش
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
            وضعیت روش‌های پرداخت
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PAYMENT_METHODS.map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full ${m.tone}`}
                >
                  <m.icon className="h-5 w-5" />
                </div>

                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {m.label}
                </div>

                <div className="text-[10px] text-gray-400 dark:text-gray-500">
                  {m.amount} تومان
                </div>

                <div className="text-[10px] font-medium text-primary-dark dark:text-primary-light">
                  {m.percent}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 text-[11px] text-primary-dark dark:text-primary-light">
            گزارش کامل روش‌های پرداخت
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            آخرین تراکنش‌ها
          </h3>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 sm:w-56 dark:border-gray-700 dark:bg-gray-800">
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300 dark:text-gray-200 dark:placeholder:text-gray-500"
            />

            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <th className="py-2 font-medium">مشتری</th>
                <th className="py-2 font-medium">روش پرداخت</th>
                <th className="py-2 font-medium">مبلغ</th>
                <th className="py-2 font-medium">شماره پیگیری</th>
                <th className="py-2 font-medium">تاریخ و زمان</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {TRANSACTIONS.map((t) => (
                <tr
                  key={t.ref}
                  className="border-b border-gray-50 transition hover:bg-gray-50/60 dark:border-gray-800/80 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                    {t.customer}
                  </td>

                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {t.method}
                  </td>

                  <td className="py-3 text-gray-700 dark:text-gray-300">
                    {t.amount}
                  </td>

                  <td
                    className="py-3 text-gray-500 dark:text-gray-400"
                    dir="ltr"
                  >
                    {t.ref}
                  </td>

                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {t.date}
                  </td>

                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_TONE[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <PrinterIcon className="h-3.5 w-3.5" />
                      </button>

                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <Search className="h-3.5 w-3.5" />
                      </button>

                      <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="mt-3 text-[11px] text-primary-dark dark:text-primary-light">
          مشاهده همه تراکنش‌ها
        </button>
      </div>

      {/* Expenses / Cheques / Installments */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Expenses + quick actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
              هزینه‌ها و پرداخت‌ها
            </h3>

            <div className="space-y-2 text-[11px]">
              {EXPENSES.map((e) => (
                <div
                  key={e.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-500 dark:text-gray-400">
                    {e.label}
                  </span>

                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {e.amount} تومان
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-3 text-[11px] text-primary-dark dark:text-primary-light">
              مشاهده همه هزینه‌ها
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
              عملیات سریع
            </h3>

            <div className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a}
                  className="w-full rounded-xl border border-gray-100 px-3 py-2 text-right text-[11px] text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cheques */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
            چک‌های دریافتی
          </h3>

          <div className="space-y-3">
            {CHEQUES.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[11px]"
              >
                <div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${c.tone}`}
                  >
                    {c.status}
                  </span>

                  <div className="mt-1 text-gray-500 dark:text-gray-400">
                    شماره: {c.number} · {c.bank}
                  </div>
                </div>

                <span className="text-gray-500 dark:text-gray-400">
                  {c.due}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-3 text-[11px] text-primary-dark dark:text-primary-light">
            مشاهده همه چک‌ها
          </button>
        </div>

        {/* Installments */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
            وضعیت طرح‌های اقساطی
          </h3>

          <div className="flex items-center gap-4">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${instGradient})`,
              }}
            >
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-center dark:bg-gray-900">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  ۴۲
                </span>

                <span className="text-[8px] text-gray-400 dark:text-gray-500">
                  کل طرح فعال
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px]">
              {INSTALLMENTS.map((i) => (
                <div
                  key={i.label}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: i.color }}
                  />

                  <span className="text-gray-500 dark:text-gray-400">
                    {i.label}
                  </span>

                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ({i.value}٪)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-3 text-[11px] text-primary-dark dark:text-primary-light">
            مشاهده همه طرح‌ها
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-400 dark:text-gray-500">
        {label}
      </span>

      <span
        className="text-left text-gray-700 dark:text-gray-300"
        dir={dir}
      >
        {value}
      </span>
    </div>
  );
}

