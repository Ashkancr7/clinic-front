"use client";

import {
  Clock3,
  Users,
  CheckCircle2,
  StickyNote,
  Video,
  ChevronLeft,
  FileText,
  Images,
  Bell,
} from "lucide-react";

const STATS = [
  { icon: Users, tone: "text-primary-dark bg-primary-light/20", label: "بیماران امروز", value: "۸" },
  { icon: CheckCircle2, tone: "text-blue-600 bg-secondary-blue/40", label: "ویزیت‌های انجام‌شده", value: "۳" },
  { icon: Clock3, tone: "text-purple-600 bg-secondary-purple/40", label: "نوبت بعدی تا", value: "۲۵ دقیقه" },
  { icon: StickyNote, tone: "text-pink-600 bg-secondary-pink/40", label: "یادداشت‌های ناتمام", value: "۲" },
];

const TODAY_PATIENTS = [
  { time: "۱۰:۰۰", name: "سارا محمدی", service: "مزوتراپی صورت", status: "در انتظار", type: "حضوری" },
  { time: "۱۰:۴۵", name: "نگین رضوی", service: "بوتاکس", status: "بعدی", type: "حضوری" },
  { time: "۱۱:۳۰", name: "مریم اکبری", service: "مشاوره پوست", status: "برنامه‌ریزی‌شده", type: "آنلاین" },
  { time: "۱۳:۰۰", name: "الناز حیدری", service: "لیزر موهای زائد", status: "برنامه‌ریزی‌شده", type: "حضوری" },
];

const PENDING_NOTES = [
  { patient: "پریسا کاظمی", service: "تزریق ژل لب", date: "دیروز" },
  { patient: "فاطمه یوسفی", service: "بوتاکس", date: "۲ روز پیش" },
];

const STATUS_TONE: Record<string, string> = {
  "در انتظار": "bg-primary-light/20 text-primary-dark",
  "بعدی": "bg-amber-50 text-warning",
  "برنامه‌ریزی‌شده": "bg-gray-100 text-gray-500",
};

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">سلام دکتر آرش 👋</h1>
        <p className="mt-1 text-sm text-gray-400">برنامه‌ی امروز شما و بیماران در انتظار ویزیت</p>
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
        {/* بیماران امروز */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-gray-800">بیماران امروز</h2>
          <div className="space-y-3">
            {TODAY_PATIENTS.map((p) => (
              <div key={p.time} className="flex items-center justify-between rounded-xl border border-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex w-12 shrink-0 flex-col items-center text-primary-dark">
                    <Clock3 className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">{p.time}</span>
                  </div>
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{p.name}</div>
                    <div className="text-[11px] text-gray-400">{p.service}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.type === "آنلاین" && <Video className="h-3.5 w-3.5 text-blue-500" />}
                  <span className={`rounded-full px-2.5 py-1 text-[10px] ${STATUS_TONE[p.status]}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-xs text-primary-dark">
            <ChevronLeft className="h-3.5 w-3.5" /> مشاهده تقویم کامل
          </button>
        </div>

        {/* یادداشت‌های ناتمام */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-800">
              <StickyNote className="h-4 w-4 text-primary-dark" /> یادداشت‌های ناتمام
            </h3>
            <div className="space-y-3">
              {PENDING_NOTES.map((n) => (
                <div key={n.patient} className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-gray-700">{n.patient}</div>
                    <div className="text-[10px] text-gray-400">{n.service} · {n.date}</div>
                  </div>
                  <button className="rounded-lg bg-primary-light/15 px-2.5 py-1 text-[10px] text-primary-dark">تکمیل</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-gray-800">
              <Bell className="h-4 w-4 text-primary-dark" /> یادآوری‌ها
            </h3>
            <p className="text-xs leading-relaxed text-gray-500">
              بیمار «سارا محمدی» سابقه‌ی حساسیت به لیدوکائین دارد — قبل از تزریق بررسی شود.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickLink icon={FileText} label="ثبت یادداشت جلسه" />
        <QuickLink icon={Images} label="آپلود تصاویر قبل/بعد" />
        <QuickLink icon={Users} label="مشاهده پرونده بیمار" />
        <QuickLink icon={Video} label="شروع ویزیت آنلاین" />
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label }: { icon: typeof FileText; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 hover:shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light/20">
        <Icon className="h-4 w-4 text-primary-dark" />
      </div>
      <span className="text-center text-[11px] font-medium text-gray-700">{label}</span>
    </button>
  );
}
