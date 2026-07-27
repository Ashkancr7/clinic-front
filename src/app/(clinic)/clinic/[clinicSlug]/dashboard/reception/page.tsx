"use client";

import {
  UserPlus,
  Clock3,
  CheckCircle2,
  Hourglass,
  Phone,
  CalendarPlus,
  Bell,
  ChevronLeft,
} from "lucide-react";

const STATS = [
  { icon: Hourglass, tone: "text-warning bg-amber-50", label: "در انتظار", value: "۶" },
  { icon: Clock3, tone: "text-blue-600 bg-secondary-blue/40", label: "در حال ویزیت", value: "۲" },
  { icon: CheckCircle2, tone: "text-primary-dark bg-primary-light/20", label: "تکمیل‌شده امروز", value: "۱۸" },
  { icon: Bell, tone: "text-purple-600 bg-secondary-purple/40", label: "نیازمند تایید", value: "۳" },
];

const QUEUE = [
  { name: "سارا محمدی", time: "۱۰:۰۰", service: "مزوتراپی صورت", doctor: "دکتر سارا محمدی", status: "در انتظار" },
  { name: "نگین رضوی", time: "۱۰:۳۰", service: "بوتاکس", doctor: "دکتر سارا محمدی", status: "در حال ویزیت" },
  { name: "مریم اکبری", time: "۱۱:۱۵", service: "مشاوره پوست", doctor: "دکتر رضا کاویانی", status: "در انتظار" },
];

const PENDING_CONFIRMATIONS = [
  { name: "الناز حیدری", service: "لیزر موهای زائد", time: "فردا - ۱۴:۰۰" },
  { name: "پریسا کاظمی", service: "تزریق ژل لب", time: "فردا - ۱۶:۳۰" },
  { name: "فاطمه یوسفی", service: "بوتاکس", time: "پس‌فردا - ۱۰:۰۰" },
];

const STATUS_TONE: Record<string, string> = {
  "در انتظار": "bg-amber-50 text-warning",
  "در حال ویزیت": "bg-secondary-blue/40 text-blue-600",
};

export default function ReceptionDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">سلام نگار جان </h1>
          <p className="mt-1 text-sm text-gray-400">صف امروز و کارهای در انتظار پیگیری</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <UserPlus className="h-3.5 w-3.5" /> پذیرش سریع
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-dark">
            <CalendarPlus className="h-3.5 w-3.5" /> ثبت نوبت جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* صف امروز */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-gray-800">صف امروز</h2>
          <div className="space-y-3">
            {QUEUE.map((q) => (
              <div key={q.name} className="flex flex-col gap-3 rounded-xl border border-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex w-12 shrink-0 flex-col items-center text-primary-dark">
                    <Clock3 className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">{q.time}</span>
                  </div>
                  <div className="h-9 w-9 shrink-0 rounded-full bg-gray-100" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{q.name}</div>
                    <div className="text-[11px] text-gray-400">{q.service} · {q.doctor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] ${STATUS_TONE[q.status]}`}>{q.status}</span>
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs text-primary-dark">
            <ChevronLeft className="h-3.5 w-3.5" /> مشاهده صف کامل
          </button>
        </div>

        {/* نوبت‌های نیازمند تایید */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-gray-800">نوبت‌های نیازمند تایید</h3>
          <div className="space-y-3">
            {PENDING_CONFIRMATIONS.map((c) => (
              <div key={c.name} className="rounded-xl border border-gray-50 p-3">
                <div className="text-xs font-semibold text-gray-800">{c.name}</div>
                <div className="text-[11px] text-gray-400">{c.service} · {c.time}</div>
                <div className="mt-2 flex gap-1.5">
                  <button className="flex-1 rounded-lg bg-primary-light/15 py-1.5 text-[10px] text-primary-dark">تایید</button>
                  <button className="flex-1 rounded-lg bg-red-50 py-1.5 text-[10px] text-danger">رد</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
