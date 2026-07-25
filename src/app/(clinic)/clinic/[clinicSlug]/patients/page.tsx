"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  Send,
  FileSpreadsheet,
  Calendar,
  Link2,
  FolderOpen,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Users,
  ArrowDownUp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";


const PATIENTS = [
  {
    id: "sara-yousefi",
    firstName: "سارا",
    lastName: "یوسفی",
    phone: "0912 345 6789",
    nationalCode: "1234567890",
    age: 28,
    lastVisit: "۱۴۰۳/۰۳/۱۵",
    nextVisit: "۱۴۰۳/۰۳/۲۹",
    nextVisitTime: "۱۰:۰۰",
    doctor: "دکتر سارا محمدی",
    doctorSpecialty: "متخصص پوست",
    status: "فعال",
  },
  {
    id: "maryam-ahmadi",
    firstName: "مریم",
    lastName: "احمدی",
    phone: "0912 987 6543",
    nationalCode: "1345678901",
    age: 34,
    lastVisit: "۱۴۰۳/۰۳/۱۰",
    nextVisit: "۱۴۰۳/۰۳/۲۵",
    nextVisitTime: "۱۳:۳۰",
    doctor: "دکتر نازنین رضایی",
    doctorSpecialty: "متخصص پوست",
    status: "فعال",
  },
  {
    id: "ali-golmohammadi",
    firstName: "علی",
    lastName: "گل‌محمدی",
    phone: "0912 222 3333",
    nationalCode: "1234567892",
    age: 42,
    lastVisit: "۱۴۰۳/۰۲/۲۸",
    nextVisit: null,
    nextVisitTime: null,
    doctor: "دکتر علی یوسفی",
    doctorSpecialty: "متخصص مو",
    status: "غیرفعال",
  },
  {
    id: "negin-sadeghi",
    firstName: "نگین",
    lastName: "صادقی",
    phone: "0912 777 8888",
    nationalCode: "1456789012",
    age: 30,
    lastVisit: "۱۴۰۳/۰۳/۱۸",
    nextVisit: "۱۴۰۳/۰۴/۰۵",
    nextVisitTime: "۱۶:۳۰",
    doctor: "دکتر سارا محمدی",
    doctorSpecialty: "متخصص پوست",
    status: "فعال",
  },
  {
    id: "hossein-moradi",
    firstName: "حسین",
    lastName: "مرادی",
    phone: "0912 666 4444",
    nationalCode: "1112233445",
    age: 39,
    lastVisit: "۱۴۰۳/۰۳/۱۲",
    nextVisit: null,
    nextVisitTime: null,
    doctor: "دکتر علی یوسفی",
    doctorSpecialty: "متخصص مو",
    status: "دارای هشدار",
  },
  {
    id: "fatemeh-karimi",
    firstName: "فاطمه",
    lastName: "کریمی",
    phone: "0912 444 5555",
    nationalCode: "1334445556",
    age: 26,
    lastVisit: null,
    nextVisit: "۱۴۰۳/۰۳/۳۰",
    nextVisitTime: "۱۱:۰۰",
    doctor: "دکتر نازنین رضایی",
    doctorSpecialty: "متخصص پوست",
    status: "فعال",
  },
  {
    id: "reza-beheshti",
    firstName: "رضا",
    lastName: "بهشتی",
    phone: "0912 123 4567",
    nationalCode: "1010203040",
    age: 45,
    lastVisit: "۱۴۰۳/۰۲/۱۵",
    nextVisit: null,
    nextVisitTime: null,
    doctor: "دکتر علی یوسفی",
    doctorSpecialty: "متخصص مو",
    status: "غیرفعال",
  },
];

const STATUS_STYLE: Record<string, { dot: string; text: string }> = {
  فعال: { dot: "bg-primary", text: "text-primary-dark" },
  غیرفعال: { dot: "bg-gray-300", text: "text-gray-400" },
  "دارای هشدار": { dot: "bg-danger", text: "text-danger" },
};

const STATS = [
  {
    key: "total",
    label: "کل مراجعین",
    value: "۱٬۴۸۶ نفر",
    icon: Users,
    tone: "bg-secondary-purple/30 text-purple-600",
  },
  {
    key: "active",
    label: "مراجعین فعال",
    value: "۱٬۲۳۵ نفر",
    icon: CheckCircle2,
    tone: "bg-primary/10 text-primary-dark",
  },
  {
    key: "upcoming",
    label: "دارای نوبت آینده",
    value: "۴۲۳ نفر",
    icon: CalendarClock,
    tone: "bg-blue-50 text-blue-500",
  },
  {
    key: "alerts",
    label: "هشدار پزشکی",
    value: "۲۹ نفر",
    icon: AlertTriangle,
    tone: "bg-danger/10 text-danger",
  },
];

const FILTERS = [
  { label: "بازه ثبت‌نام", icon: Calendar },
  { label: "خدمت" },
  { label: "پزشک معالج" },
  { label: "هشدار پزشکی" },
  { label: "دارای نوبت آینده" },
];

export default function PatientsListPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [search, setSearch] = useState("");

 const filtered = PATIENTS.filter((p) => {
  const q = search.trim().toLowerCase();

  if (!q) return true;

  return (
    p.firstName.toLowerCase().includes(q) ||
    p.lastName.toLowerCase().includes(q) ||
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
    p.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
    p.nationalCode.includes(q) ||
    p.doctor.toLowerCase().includes(q) ||
    p.doctorSpecialty.toLowerCase().includes(q) ||
    p.status.toLowerCase().includes(q) ||
    p.age.toString().includes(q)
  );
});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">لیست مراجعین</h1>
          <p className="mt-1 text-sm text-gray-400">جستجو، فیلتر و مدیریت اطلاعات بیماران کلینیک</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            <FileSpreadsheet className="h-4 w-4" /> خروجی اکسل
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            <Send className="h-4 w-4" /> ارسال پیامک
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
            <UserPlus className="h-4 w-4" /> افزودن مراجعه‌کننده
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="جستجو بر اساس نام، نام خانوادگی، کد ملی یا موبایل..."
                className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
              />
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
              <SlidersHorizontal className="h-3.5 w-3.5" /> فیلترها
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] text-gray-500 hover:bg-gray-50"
              >
                {f.icon ? <f.icon className="h-3 w-3" /> : null}
                {f.label}
              </button>
            ))}

            <div className="ms-auto">
              <button className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                پاک کردن همه
              </button>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.key} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="text-[11px] text-gray-400">{s.label}</p>
                <p className="mt-1 text-base font-bold text-gray-900">{s.value}</p>
              </div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <ArrowDownUp className="h-3.5 w-3.5" /> مرتب‌سازی: جدیدترین
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">نام و نام خانوادگی</th>
                <th className="py-2 font-medium">موبایل</th>
                <th className="py-2 font-medium">کد ملی</th>
                <th className="py-2 font-medium">سن</th>
                <th className="py-2 font-medium">آخرین مراجعه</th>
                <th className="py-2 font-medium">نوبت بعدی</th>
                <th className="py-2 font-medium">پزشک معالج</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = STATUS_STYLE[p.status];
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3">
                      <Link href={`/clinic/${clinicSlug}/patients/${p.id}`} className="flex items-center gap-2">
                        <Image
                          src="/image/user.PNG"
                          alt="User"
                          width={30}
                          height={30}
                          unoptimized
                          className="rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800 hover:text-primary-dark">
                          {p.firstName} {p.lastName}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 text-gray-500" dir="ltr">
                      {p.phone}
                    </td>
                    <td className="py-3 text-gray-500" dir="ltr">
                      {p.nationalCode}
                    </td>
                    <td className="py-3 text-gray-500">{p.age.toLocaleString("fa-IR")}</td>
                    <td className="py-3 text-gray-500">{p.lastVisit ?? "—"}</td>
                    <td className="py-3 text-gray-500">
                      {p.nextVisit ? (
                        <>
                          {p.nextVisit}
                          <span className="block text-[10px] text-gray-300">{p.nextVisitTime}</span>
                        </>
                      ) : (
                        "ندارد"
                      )}
                    </td>
                    <td className="py-3">
                      <div className="text-gray-700">{p.doctor}</div>
                      <div className="text-[10px] text-gray-300">{p.doctorSpecialty}</div>
                    </td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 ${status.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /> {p.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button title="ارسال لینک به" className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                          <Link2 className="h-3.5 w-3.5" />
                        </button>
                        <button title="ثبت نوبت" className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                          <Calendar className="h-3.5 w-3.5" />
                        </button>
                        <button title="مشاهده پرونده" className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                          <FolderOpen className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <span className="text-xs text-gray-400">
            نمایش {filtered.length.toLocaleString("fa-IR")} از ۱٬۴۸۶ مورد
          </span>
          <div className="flex items-center gap-1.5">
            <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={`h-7 w-7 rounded-lg text-xs ${p === 1 ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                {p.toLocaleString("fa-IR")}
              </button>
            ))}
            <span className="px-1 text-xs text-gray-300">...</span>
            <button className="h-7 w-7 rounded-lg text-xs text-gray-500 hover:bg-gray-50">۲۵</button>
            <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}