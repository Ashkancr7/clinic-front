"use client";

import { useState } from "react";
import {
  UserPlus,
  Download,
  Search,
  SlidersHorizontal,
  Filter,
  ShieldCheck,
  Briefcase,
  Headset,
  Stethoscope,
  Users as UsersIcon,
  Check,
  Minus,
  Pencil,
  Plus,
} from "lucide-react";

import Image from "next/image";


const STATS = [
  { icon: UsersIcon, tone: "text-gray-600 bg-gray-100", label: "کل کاربران", value: "۱۲۶" },
  { icon: Stethoscope, tone: "text-primary-dark bg-primary-light/20", label: "پزشکان", value: "۱۸" },
  { icon: Headset, tone: "text-blue-600 bg-secondary-blue/40", label: "منشی‌ها", value: "۲۸" },
  { icon: Briefcase, tone: "text-purple-600 bg-secondary-purple/40", label: "مدیران کلینیک", value: "۶" },
  { icon: ShieldCheck, tone: "text-pink-600 bg-secondary-pink/40", label: "سوپر ادمین", value: "۳" },

];

const ROLE_TONE: Record<string, string> = {
  "مدیر کلینیک": "bg-primary-light/20 text-primary-dark",
  "پزشک": "bg-secondary-purple/40 text-purple-600",
  "منشی": "bg-secondary-pink/40 text-pink-600",
};

const USERS = [
  { name: "دکتر سارا محمدی", email: "sara.mohammadi@clinic.com", phone: "0912 123 4567", role: "مدیر کلینیک", lastLogin: "امروز، ۱۰:۳۰", status: "فعال", isMe: true },
  { name: "دکتر علی رضایی", email: "ali.rezaei@clinic.com", phone: "0912 222 3333", role: "پزشک", lastLogin: "امروز، ۹:۱۵", status: "فعال" },
  { name: "نرگس حسینی", email: "n.hosseini@clinic.com", phone: "0912 333 4444", role: "منشی", lastLogin: "دیروز، ۱۶:۴۵", status: "فعال" },
  { name: "محمد قربانی", email: "m.ghorbani@clinic.com", phone: "0912 444 5555", role: "مدیر کلینیک", lastLogin: "۳ روز پیش", status: "غیرفعال" },
  { name: "الهام اکبری", email: "e.akbari@clinic.com", phone: "0912 555 6666", role: "منشی", lastLogin: "دیروز", status: "فعال" },
];

const PERMISSION_ROWS = [
  { label: "داشبورد و گزارش‌ها", perms: [null, true, true, true, true] },
  { label: "مدیریت کاربران", perms: [null, true, true, false, true] },
  { label: "مدیریت نقش‌ها", perms: [null, true, true, false, true] },
  { label: "مدیریت نوبت‌ها", perms: [true, true, true, true, true] },
  { label: "پرونده‌های مراجعین", perms: [null, false, true, true, true] },
  { label: "بیمه‌ها و قراردادها", perms: [null, true, true, false, true] },
  { label: "خدمات و تعرفه‌ها", perms: [null, true, true, false, true] },
  { label: "مالی و پرداخت‌ها", perms: [null, true, true, false, true] },
];

const ROLE_COLUMNS = ["منشی نوبت‌دهی", "منشی", "مدیر کلینیک", "پزشک", "سوپر ادمین"];

const CHANGE_LOG = [
  { ip: "192.168.1.12", device: "Chrome / Windows", detail: 'نوبت جدید برای مراجع «مریم احمدی» در تاریخ ۱۴۰۳/۰۳/۲۴ ساعت ۱۱:۰۰', action: "ایجاد", user: "دکتر سارا مخمدی", time: "۱۴۰۳/۰۳/۲۳ ۱۰:۲۵" },
  { ip: "192.168.1.15", device: "Chrome / Windows", detail: "ویرایش اطلاعات تماس مراجع «رضا کریمی»", action: "ویرایش", user: "نرگس حسینی", time: "۱۴۰۳/۰۳/۲۳ ۱۰:۱۵" },
  { ip: "192.168.1.18", device: "Safari / macOS", detail: 'تغییر وضعیت نوبت «فاطمه یوسفی» به «تکمیل‌شده»', action: "تغییر وضعیت", user: "دکتر علی رضایی", time: "۱۴۰۳/۰۳/۲۳ ۹:۴۵" },
  { ip: "192.168.1.22", device: "Chrome / Windows", detail: "حذف فاکتور شماره #۱۲۷۷-۱۴۰۳-۲۲۳", action: "حذف", user: "محمد قربانی", time: "۱۴۰۳/۰۳/۲۳ ۹:۳۰" },
  { ip: "192.168.1.12", device: "Chrome / Windows", detail: "ایجاد کاربر جدید با نقش «منشی نوبت‌دهی»", action: "ایجاد", user: "دکتر سارا محمدی", time: "۱۴۰۳/۰۳/۲۳ ۹:۱۰" },
];

const ACTION_TONE: Record<string, string> = {
  "ایجاد": "bg-primary-light/20 text-primary-dark",
  "ویرایش": "bg-secondary-blue/40 text-blue-600",
  "تغییر وضعیت": "bg-secondary-purple/40 text-purple-600",
  "حذف": "bg-red-50 text-danger",
};

export default function UsersRolesPage() {
  const [tab, setTab] = useState<"roles" | "matrix">("matrix");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <ShieldCheck className="h-5 w-5 text-primary-dark" /> کاربران، نقش‌ها و لاگ تغییرات
          </h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت دسترسی کاربران، تعریف نقش‌ها و بررسی تاریخچه فعالیت‌ها در سیستم</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <Download className="h-3.5 w-3.5" /> خروجی اکسل
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
            <UserPlus className="h-4 w-4" /> دعوت از کاربر جدید
          </button>
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
            <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-lg font-bold text-gray-900">{s.value} نفر</div>
            <div className="text-[11px] text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

        {/* نقش‌ها و دسترسی‌ها */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2 scrollbar-hide">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
              <ShieldCheck className="h-4 w-4 text-primary-dark" /> نقش‌ها و دسترسی‌ها
            </h3>
            <button className="flex items-center gap-1 rounded-lg bg-primary-light/15 px-2.5 py-1.5 text-[11px] text-primary-dark">
              <Plus className="h-3 w-3" /> نقش جدید
            </button>
          </div>

          <div className="mb-3 flex gap-4 border-b border-gray-100 text-xs">
            <button
              onClick={() => setTab("matrix")}
              className={`border-b-2 pb-2 ${tab === "matrix" ? "border-primary font-medium text-primary-dark" : "border-transparent text-gray-400"}`}
            >
              ماتریس دسترسی
            </button>
            <button
              onClick={() => setTab("roles")}
              className={`border-b-2 pb-2 ${tab === "roles" ? "border-primary font-medium text-primary-dark" : "border-transparent text-gray-400"}`}
            >
              نقش‌ها
            </button>
          </div>

          {tab === "matrix" ? (
            <div className="overflow-x-auto ">
              <table className="w-full min-w-[380px] text-[10px]">
                <thead>
                  <tr className="text-gray-400">
                    <th className="pb-2 text-right font-medium">بخش</th>
                    {ROLE_COLUMNS.map((r) => (
                      <th key={r} className="pb-2 text-center font-medium">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_ROWS.map((row) => (
                    <tr key={row.label} className="border-t border-gray-50">
                      <td className="py-2 text-right text-gray-600">{row.label}</td>
                      {row.perms.map((p, i) => (
                        <td key={i} className="py-2 text-center">
                          {p === null ? (
                            <Minus className="mx-auto h-3 w-3 text-gray-200" />
                          ) : p ? (
                            <Check className="mx-auto h-3 w-3 text-primary-dark" />
                          ) : (
                            <Minus className="mx-auto h-3 w-3 text-gray-200" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mt-3 mr-auto flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-[11px] text-primary ">
                <Pencil className="h-3 w-3" /> ویرایش نقش
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {ROLE_COLUMNS.map((r) => (
                <div key={r} className="flex items-center justify-between rounded-xl border border-gray-100 p-2.5 text-xs">
                  <span className="text-gray-700">{r}</span>
                  <button className="text-gray-400">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* جدول کاربران */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-3">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-56">
              <input
                type="text"
                placeholder="جستجو در کاربران..."
                className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
              />
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            </div>
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
              <SlidersHorizontal className="h-3.5 w-3.5" /> فیلتر
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="py-2 font-medium">کاربر</th>
                  <th className="py-2 font-medium">نقش</th>
                  <th className="py-2 font-medium">آخرین ورود</th>
                  <th className="py-2 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((u) => (
                  <tr key={u.email} className="border-b border-gray-50">
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
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-gray-800">
                            {u.name}
                            {u.isMe && (
                              <span className="rounded-full bg-primary-light/20 px-1.5 py-0.5 text-[9px] text-primary-dark">
                                شما
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400" dir="ltr">
                            {u.email} · {u.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${ROLE_TONE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="py-3 text-gray-500">{u.lastLogin}</td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 ${u.status === "فعال" ? "text-primary-dark" : "text-danger"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-[11px] text-gray-400">نمایش ۱ تا ۵ از ۱۲۶ نفر</div>
        </div>


      </div>

      {/* لاگ تغییرات */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-gray-800">لاگ تغییرات اخیر</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-[11px] text-gray-600">
              <Filter className="h-3.5 w-3.5" /> همه اقدامات
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-48">
              <input
                type="text"
                placeholder="جستجو در لاگ‌ها..."
                className="w-full bg-transparent text-[11px] text-gray-600 outline-none placeholder:text-gray-300"
              />
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-right text-[11px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">دستگاه / IP</th>
                <th className="py-2 font-medium">جزئیات</th>
                <th className="py-2 font-medium">اقدام</th>
                <th className="py-2 font-medium">کاربر</th>
                <th className="py-2 font-medium">زمان</th>
              </tr>
            </thead>
            <tbody>
              {CHANGE_LOG.map((l, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2.5 text-gray-500" dir="ltr">
                    <div>{l.ip}</div>
                    <div className="text-[9px] text-gray-300">{l.device}</div>
                  </td>
                  <td className="py-2.5 text-gray-600">{l.detail}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 ${ACTION_TONE[l.action]}`}>{l.action}</span>
                  </td>
                  <td className="py-2.5 text-gray-700">{l.user}</td>
                  <td className="py-2.5 text-gray-400">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-3 mr-auto block rounded-lg border border-primary px-2 py-1 text-[11px] text-primary-dark">
          مشاهده همه لاگ‌ها
        </button>
      </div>
    </div>
  );
}
