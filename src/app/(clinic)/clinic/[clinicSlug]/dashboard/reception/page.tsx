"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Link2,
  UserPlus,
  Pencil,
  Coffee,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";


const STATS = [
  { icon: ShieldCheck, tone: "text-primary-dark bg-primary-light/20", label: "تکمیل شده", value: "۹", unit: "نفر" },
  { icon: UserPlus, tone: "text-pink-600 bg-secondary-pink/40", label: "در حال خدمت", value: "۳", unit: "نفر" },
  { icon: Users, tone: "text-amber-500 bg-amber-50", label: "بیماران حاضر", value: "۶", unit: "نفر" },
  { icon: ChevronLeft, tone: "text-primary-dark bg-primary-light/20", label: "نوبت‌های باقی‌مانده", value: "۱۸", unit: "نوبت" },
  { icon: CalendarDays, tone: "text-purple-600 bg-secondary-purple/40", label: "نوبت‌های امروز", value: "۲۸", unit: "نوبت" },
];

const STATUS_BREAKDOWN = [
  { label: "برنامه‌ریزی شده", value: "۱۸", dot: "bg-blue-400" },
  { label: "حاضر شده", value: "۶", dot: "bg-primary" },
  { label: "در حال خدمت", value: "۳", dot: "bg-purple-500" },
  { label: "تکمیل شده", value: "۹", dot: "bg-primary" },
  { label: "لغو شده", value: "۱", dot: "bg-danger" },
  { label: "غیبت / نیامده", value: "۱", dot: "bg-warning" },
];

const WAITLIST = [
  { name: "سارا محمدی", service: "تزریق ژل لب", wait: "۱۵ دقیقه انتظار", tone: "bg-red-50 text-danger" },
  { name: "نگین احمدی", service: "مشاوره پوست", wait: "۵ دقیقه انتظار", tone: "bg-amber-50 text-warning" },
  { name: "حسین رضایی", service: "پاکسازی پوست", wait: "در انتظار", tone: "bg-amber-50 text-warning" },
];

const SCHEDULE = [
  { time: "۰۹:۰۰", name: "مینا یوسفی", service: "مشاوره پوست", status: "حاضر شده", tone: "bg-primary-light/10 border-primary-light/40", badgeTone: "bg-primary-light/20 text-primary-dark" },
  { time: "۱۰:۰۰", name: "سارا محمدی", service: "تزریق ژل لب", status: "در حال خدمت", tone: "bg-secondary-pink/10 border-secondary-pink/50", badgeTone: "bg-secondary-pink/40 text-pink-600", active: true },
  { time: "۱۱:۰۰", name: "نگین احمدی", service: "مزوتراپی", status: "حاضر شده", tone: "bg-primary-light/10 border-primary-light/40", badgeTone: "bg-primary-light/20 text-primary-dark" },
  { time: "۱۲:۰۰", name: "الهام رضایی", service: "پاکسازی پوست", status: "برنامه‌ریزی شده", tone: "border-gray-100", badgeTone: "bg-secondary-blue/40 text-blue-600" },
  { time: "۱۳:۰۰", name: "", service: "", status: "استراحت", isBreak: true },
  { time: "۱۴:۰۰", name: "پروا طلبی", service: "لیزر صورت", status: "برنامه‌ریزی شده", tone: "border-gray-100", badgeTone: "bg-secondary-blue/40 text-blue-600" },
  { time: "۱۵:۰۰", name: "سمیرا کریمی", service: "فیشیال تخصصی", status: "برنامه‌ریزی شده", tone: "border-gray-100", badgeTone: "bg-secondary-blue/40 text-blue-600" },
  { time: "۱۶:۰۰", name: "مریم حسینی", service: "بوتاکس", status: "در انتظار تایید", tone: "border-amber-100", badgeTone: "bg-amber-50 text-warning" },
  { time: "۱۷:۰۰", name: "نازنین مرادی", service: "لیفت با نخ", status: "لغو شده", tone: "border-red-100", badgeTone: "bg-red-50 text-danger" },
];

const SELECTED_APPOINTMENT = {
  patient: "سارا محمدی",
  phone: "0912 345 6789",
  service: "تزریق ژل لب",
  doctor: "دکتر سارا محمدی",
  room: "اتاق تزریق ۱",
  time: "۱۰:۰۰ - ۱۰:۳۰",
  code: "1404-03-26-1023",
  paymentStatus: "پرداخت شده",
  note: "بیمار حساسیت دارویی ندارد.",
  status: "در حال خدمت",
};

export default function ReceptionQueuePage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "filtered">("all");

  return (
    <div className="space-y-6">

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{s.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">{s.value}</div>
            <div className="text-[10px] text-gray-400">{s.unit}</div>
          </div>
        ))}
      </div>

      {/* دکمه‌های اکشن */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

        <button
          onClick={() => setActiveFilter("filtered")}
          className="flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-xs font-medium text-primary-dark"
        >
          <Filter className="h-4 w-4" /> فیلتر نوبت‌ها
        </button>

        <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-600 hover:bg-gray-50">
          <UserPlus className="h-4 w-4" /> ثبت بیمار جدید
        </button>


        <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-600 hover:bg-gray-50">
          <Link2 className="h-4 w-4" /> ارسال لینک فرم پذیرش
        </button>

      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

        {/* ستون چپ: جزئیات نوبت انتخاب‌شده */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-800">جزئیات نوبت</h3>
            <Pencil className="h-3.5 w-3.5 text-gray-300" />
          </div>
          <div className="mb-3 flex items-center gap-2.5">
            <Image
              src="/image/user.PNG"
              alt="User"
              width={30}
              height={30}
              unoptimized
              className="rounded-full object-cover"
            />
            <div>
              <div className="text-xs font-bold text-gray-900">{SELECTED_APPOINTMENT.patient}</div>
              <div className="text-[10px] text-gray-400" dir="ltr">{SELECTED_APPOINTMENT.phone}</div>
            </div>
            <span className="mr-auto rounded-full bg-secondary-pink/40 px-2 py-0.5 text-[9px] text-pink-600">
              {SELECTED_APPOINTMENT.status}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <Row label="خدمت" value={SELECTED_APPOINTMENT.service} />
            <Row label="پزشک" value={SELECTED_APPOINTMENT.doctor} />
            <Row label="اتاق" value={SELECTED_APPOINTMENT.room} />
            <Row label="ساعت" value={SELECTED_APPOINTMENT.time} />
            <Row label="کد نوبت" value={SELECTED_APPOINTMENT.code} dir="ltr" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">وضعیت پرداخت</span>
              <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-[10px] text-primary-dark">
                {SELECTED_APPOINTMENT.paymentStatus}
              </span>
            </div>
            <div>
              <div className="text-gray-400">یادداشت</div>
              <p className="mt-0.5 text-gray-600">{SELECTED_APPOINTMENT.note}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full rounded-xl bg-primary py-2.5 text-xs font-medium text-white hover:bg-primary-dark">تکمیل خدمت</button>
            <button className="w-full rounded-xl border border-gray-200 py-2.5 text-xs text-gray-600 hover:bg-gray-50">تغییر زمان</button>
            <button className="w-full rounded-xl border border-red-100 py-2.5 text-xs text-danger hover:bg-red-50">لغو نوبت</button>
          </div>
        </div>



        {/* ستون وسط: برنامه روزانه */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <CalendarDays className="h-4 w-4 text-primary-dark" /> برنامه روزانه
            </h3>
            <Pencil className="h-3.5 w-3.5 text-gray-300" />
          </div>

          <div className="space-y-2">
            {SCHEDULE.map((s) => (
              <div key={s.time} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-[11px] text-gray-400">{s.time}</span>
                {s.isBreak ? (
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2 text-[11px] text-gray-400">
                    <Coffee className="h-3.5 w-3.5" /> استراحت
                  </div>
                ) : (
                  <div className={`flex flex-1 items-center justify-between rounded-xl border px-3 py-2 ${s.tone} ${s.active ? "ring-1 ring-pink-300" : ""}`}>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/image/user.PNG"
                        alt="User"
                        width={30}
                        height={30}
                        unoptimized
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div className="text-[11px] font-medium text-gray-800">{s.name}</div>
                        <div className="text-[10px] text-gray-400">{s.service}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] ${s.badgeTone}`}>{s.status}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ستون راست: وضعیت + لیست انتظار */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <ShieldCheck className="h-4 w-4 text-primary-dark" /> وضعیت نوبت‌ها
            </h3>
            <div className="space-y-2">
              {STATUS_BREAKDOWN.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
                  </span>
                  <span className="font-medium text-gray-700">{s.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1 text-[11px] text-primary-dark">
              <ChevronRight className="h-3 w-3" /> مشاهده گزارش کامل
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Users className="h-4 w-4 text-primary-dark" /> لیست انتظار
            </h3>
            <div className="space-y-2.5">
              {WAITLIST.map((w) => (
                <div key={w.name} className="flex items-center gap-2.5">
                  <Image
                    src="/image/user.PNG"
                    alt="User"
                    width={30}
                    height={30}
                    unoptimized
                    className="rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-medium text-gray-700">{w.name}</div>
                    <div className="truncate text-[10px] text-gray-400">{w.service}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] ${w.tone}`}>{w.wait}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1 text-[11px] text-primary-dark">
              <ChevronRight className="h-3 w-3" /> مشاهده همه
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function Row({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700" dir={dir}>{value}</span>
    </div>
  );
}
