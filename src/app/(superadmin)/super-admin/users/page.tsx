"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    SlidersHorizontal,
    MoreHorizontal,
    Users,
    ShieldCheck,
    Stethoscope,
    UserRound,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import Image from "next/image";


const STATS = [
    { icon: Users, tone: "text-primary-dark bg-primary-light/20", label: "کل کاربران", value: "۳,۲۸۶" },
    { icon: ShieldCheck, tone: "text-purple-600 bg-secondary-purple/40", label: "مدیران و کارکنان کلینیک", value: "۲۱۴" },
    { icon: Stethoscope, tone: "text-blue-600 bg-secondary-blue/40", label: "پزشکان و کارشناسان", value: "۱۵۸" },
    { icon: UserRound, tone: "text-pink-600 bg-secondary-pink/40", label: "بیماران", value: "۲,۹۱۴" },
];

const ROLE_LABEL: Record<string, { label: string; tone: string }> = {
    superadmin: { label: "سوپرادمین", tone: "bg-secondary-purple/40 text-purple-600" },
    clinic_admin: { label: "مدیر کلینیک", tone: "bg-primary-light/20 text-primary-dark" },
    doctor: { label: "پزشک", tone: "bg-secondary-blue/40 text-blue-600" },
    receptionist: { label: "منشی", tone: "bg-secondary-pink/40 text-pink-600" },
    patient: { label: "بیمار", tone: "bg-gray-100 text-gray-600" },
};

const USERS = [
    { name: "علی رستمی", contact: "0912-000-0001", role: "superadmin", clinic: "همه کلینیک‌ها", joined: "۱۴۰۲/۰۲/۱۰", lastLogin: "امروز، ۰۹:۱۰", status: "فعال" },
    { name: "سارا موسوی", contact: "0912-000-0002", role: "clinic_admin", clinic: "کلینیک زیبایی آرامش", joined: "۱۴۰۲/۰۳/۱۵", lastLogin: "امروز، ۰۸:۴۵", status: "فعال" },
    { name: "دکتر رضا کاویانی", contact: "0912-000-0003", role: "doctor", clinic: "مرکز پوست و مو رویان", joined: "۱۴۰۲/۰۴/۰۱", lastLogin: "دیروز، ۱۷:۲۰", status: "فعال" },
    { name: "نگار حسینی", contact: "0912-000-0004", role: "receptionist", clinic: "کلینیک لیزر ماهرخ", joined: "۱۴۰۲/۰۵/۱۲", lastLogin: "دیروز، ۱۲:۰۵", status: "غیرفعال" },
    { name: "مینا یوسفی", contact: "0912-000-0005", role: "clinic_admin", clinic: "مرکز جوانسازی بهار", joined: "۱۴۰۲/۰۵/۲۰", lastLogin: "۲ روز پیش", status: "فعال" },
    { name: "پریسا کاظمی", contact: "0912-000-0006", role: "patient", clinic: "کلینیک زیبایی نیکو", joined: "۱۴۰۲/۰۶/۰۱", lastLogin: "۳ روز پیش", status: "فعال" },
    { name: "دکتر آرش نیکنام", contact: "0912-000-0007", role: "doctor", clinic: "کلینیک زیبایی آرامش", joined: "۱۴۰۲/۰۶/۱۰", lastLogin: "امروز، ۱۰:۳۰", status: "فعال" },
];

const ROLE_FILTERS = [
    { value: "all", label: "همه نقش‌ها" },
    { value: "superadmin", label: "سوپرادمین" },
    { value: "clinic_admin", label: "مدیر کلینیک" },
    { value: "doctor", label: "پزشک" },
    { value: "receptionist", label: "منشی" },
    { value: "patient", label: "بیمار" },
];

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredUsers = USERS.filter((user) => {
        const matchRole =
            roleFilter === "all" || user.role === roleFilter;

        const keyword = search.trim().toLowerCase();

        const matchSearch =
            keyword === "" ||
            user.name.toLowerCase().includes(keyword) ||
            user.contact.includes(keyword) ||
            user.clinic.toLowerCase().includes(keyword);

        return matchRole && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* هدر صفحه */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 md:text-2xl">کاربران</h1>
                    <p className="mt-1 text-sm text-gray-400">مدیریت تمام کاربران سامانه در همه کلینیک‌ها</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
                    <Plus className="h-4 w-4" /> افزودن کاربر جدید
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

            {/* جدول کاربران */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 lg:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی نام، شماره موبایل یا کلینیک..."
                            className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
                        />
                        <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
                        >
                            {ROLE_FILTERS.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
                            <SlidersHorizontal className="h-3.5 w-3.5" /> فیلتر بیشتر
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-right text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400">
                                <th className="py-2 font-medium">کاربر</th>
                                <th className="py-2 font-medium">نقش</th>
                                <th className="py-2 font-medium">کلینیک</th>
                                <th className="py-2 font-medium">تاریخ عضویت</th>
                                <th className="py-2 font-medium">آخرین ورود</th>
                                <th className="py-2 font-medium">وضعیت</th>
                                <th className="py-2 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.contact} className="border-b border-gray-50 hover:bg-gray-50/60">
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
                                                <div className="font-medium text-gray-800">{u.name}</div>
                                                <div className="text-[10px] text-gray-400" dir="ltr">
                                                    {u.contact}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${ROLE_LABEL[u.role].tone}`}>
                                            {ROLE_LABEL[u.role].label}
                                        </span>
                                    </td>
                                    <td className="py-3 text-gray-600">{u.clinic}</td>
                                    <td className="py-3 text-gray-500">{u.joined}</td>
                                    <td className="py-3 text-gray-500">{u.lastLogin}</td>
                                    <td className="py-3">
                                        <span
                                            className={`flex items-center gap-1 ${u.status === "فعال" ? "text-primary-dark" : "text-danger"
                                                }`}
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-current" /> {u.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10 text-center text-sm text-gray-400"
                                    >
                                        موردی یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* صفحه‌بندی */}
                <div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                    <span className="text-xs text-gray-400">
                        نمایش {filteredUsers.length.toLocaleString("fa-IR")} از{" "}
                        {USERS.length.toLocaleString("fa-IR")} کاربر
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        {[1, 2, 3].map((p) => (
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
