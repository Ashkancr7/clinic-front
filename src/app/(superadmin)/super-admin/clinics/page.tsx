"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Building2,
  CheckCircle2,
  XCircle,
  Wallet,
  ChevronRight,
  ChevronLeft,
  Images,
  CalendarClock,
  MessageSquare,
  Users,
} from "lucide-react";

const STATS = [
  { icon: Building2, tone: "text-primary-dark bg-primary-light/20", label: "کل کلینیک‌ها", value: "۳۲" },
  { icon: CheckCircle2, tone: "text-primary-dark bg-primary-light/20", label: "کلینیک‌های فعال", value: "۲۸" },
  { icon: XCircle, tone: "text-danger bg-red-50", label: "کلینیک‌های غیرفعال", value: "۴" },
  { icon: Wallet, tone: "text-purple-600 bg-secondary-purple/40", label: "درآمد این ماه", value: "۴۸۶,۰۰۰,۰۰۰ تومان" },
];

const CLINICS = [
  { id: "aramesh", name: "کلینیک زیبایی آرامش", phone: "021-88880000", manager: "سارا موسوی", plan: "پلن حرفه‌ای", planTone: "bg-primary-light/20 text-primary-dark", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۷/۱۵", activeUsers: "۱۲۶" },
  { id: "royan", name: "مرکز پوست و مو رویان", phone: "021-88880001", manager: "نرگس احمدی", plan: "پلن استاندارد", planTone: "bg-gray-100 text-gray-600", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۶/۲۰", activeUsers: "۸۹" },
  { id: "mahrokh", name: "کلینیک لیزر ماهرخ", phone: "021-88880002", manager: "الهام رضایی", plan: "پلن پایه", planTone: "bg-secondary-pink/40 text-pink-600", status: "غیرفعال", statusTone: "text-danger", nextPayment: "-", activeUsers: "۰" },
  { id: "bahar", name: "مرکز جوانسازی بهار", phone: "021-88880003", manager: "مینا یوسفی", plan: "پلن حرفه‌ای", planTone: "bg-primary-light/20 text-primary-dark", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۸/۱۰", activeUsers: "۱۵۴" },
  { id: "niko", name: "کلینیک زیبایی نیکو", phone: "021-88880004", manager: "پریسا کاظمی", plan: "پلن استاندارد", planTone: "bg-gray-100 text-gray-600", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۶/۰۵", activeUsers: "۷۲" },
  { id: "delaram", name: "کلینیک دل‌آرام", phone: "021-88880005", manager: "نازنین قاسمی", plan: "پلن پایه", planTone: "bg-secondary-pink/40 text-pink-600", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۶/۱۲", activeUsers: "۴۱" },
  { id: "royaye-ziba", name: "رویای زیبا", phone: "021-88880006", manager: "شیوا کریمی", plan: "پلن حرفه‌ای", planTone: "bg-primary-light/20 text-primary-dark", status: "فعال", statusTone: "text-primary-dark", nextPayment: "۱۴۰۳/۰۷/۰۱", activeUsers: "۹۸" },
  { id: "poostno", name: "پوست نو", phone: "021-88880007", manager: "لیلا صادقی", plan: "پلن استاندارد", planTone: "bg-gray-100 text-gray-600", status: "غیرفعال", statusTone: "text-danger", nextPayment: "-", activeUsers: "۰" },
];

const STATUS_FILTERS = ["همه", "فعال", "غیرفعال"];
const PLAN_FILTERS = ["همه پلن‌ها", "پلن پایه", "پلن استاندارد", "پلن حرفه‌ای"];

export default function ClinicsListPage() {
  const [statusFilter, setStatusFilter] = useState("همه");
  const [planFilter, setPlanFilter] = useState("همه پلن‌ها");
  const [search, setSearch] = useState("");

  const filteredClinics = useMemo(() => {
    return CLINICS.filter((clinic) => {
      // جستجو
      const matchSearch =
        clinic.name.includes(search) ||
        clinic.manager.includes(search) ||
        clinic.phone.includes(search);

      // وضعیت
      const matchStatus =
        statusFilter === "همه" || clinic.status === statusFilter;

      // پلن
      const matchPlan =
        planFilter === "همه پلن‌ها" || clinic.plan === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [search, statusFilter, planFilter]);

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">کلینیک‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت تمام کلینیک‌های ثبت‌شده در سامانه</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> افزودن کلینیک جدید
        </button>
      </div>

      {/* کارت‌های آماری */}
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

      {/* جدول */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        {/* نوار جستجو و فیلتر */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 lg:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام کلینیک، مدیر یا تلفن..."
              className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
            />
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
            >
              {PLAN_FILTERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
              <SlidersHorizontal className="h-3.5 w-3.5" /> فیلتر بیشتر
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">نام کلینیک</th>
                <th className="py-2 font-medium">مدیر</th>
                <th className="py-2 font-medium">اشتراک</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">پرداخت بعدی</th>
                <th className="py-2 font-medium">ماژول‌های فعال</th>
                <th className="py-2 font-medium">کاربران فعال</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3">
                    <Link href={`/super-admin/clinics/${c.id}`} className="flex items-center gap-2">
                      <Image
                        src="/image/user.PNG"
                        alt="User"
                        width={30}
                        height={30}
                        unoptimized
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800 hover:text-primary-dark">{c.name}</div>
                        <div className="text-[10px] text-gray-400" dir="ltr">
                          {c.phone}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/image/user.PNG"
                        alt="User"
                        width={30}
                        height={30}
                        unoptimized
                        className="rounded-full object-cover"
                      />
                      {c.manager}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${c.planTone}`}>{c.plan}</span>
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 ${c.statusTone}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{c.nextPayment}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 text-gray-300">
                      <Images className="h-3.5 w-3.5" />
                      <CalendarClock className="h-3.5 w-3.5" />
                      <MessageSquare className="h-3.5 w-3.5" />
                      <Users className="h-3.5 w-3.5" />
                    </div>
                  </td>
                  <td className="py-3 text-gray-700">{c.activeUsers}</td>
                  <td className="py-3">
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClinics.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm text-gray-400"
                  >
                    هیچ کلینیکی پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <span className="text-xs text-gray-400">نمایش ۸ از ۳۲ کلینیک</span>
          <div className="flex items-center gap-1.5">
            <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                className={`h-7 w-7 rounded-lg text-xs ${p === 1 ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {p.toLocaleString("fa-IR")}
              </button>
            ))}
            <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
