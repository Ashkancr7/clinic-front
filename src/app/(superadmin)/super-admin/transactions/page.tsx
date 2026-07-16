"use client";

import { useState } from "react";
import {
    Search,
    SlidersHorizontal,
    Download,
    Wallet,
    TrendingUp,
    XCircle,
    Receipt,
    CheckCircle2,
    Clock,
    CreditCard,
    Landmark,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

const STATS = [
    { icon: Wallet, tone: "text-primary-dark bg-primary-light/20", label: "درآمد این ماه", value: "۴۸۶,۰۰۰,۰۰۰ تومان" },
    { icon: TrendingUp, tone: "text-purple-600 bg-secondary-purple/40", label: "تعداد تراکنش‌ها", value: "۱۴۸" },
    { icon: CheckCircle2, tone: "text-primary-dark bg-primary-light/20", label: "تراکنش‌های موفق", value: "۱۳۹" },
    { icon: XCircle, tone: "text-danger bg-red-50", label: "تراکنش‌های ناموفق", value: "۹" },
];

const STATUS_STYLES: Record<string, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
    success: { label: "موفق", tone: "text-primary-dark", icon: CheckCircle2 },
    pending: { label: "در انتظار", tone: "text-warning", icon: Clock },
    failed: { label: "ناموفق", tone: "text-danger", icon: XCircle },
};

const TYPE_STYLES: Record<string, { label: string; tone: string }> = {
    subscription: { label: "پرداخت اشتراک", tone: "bg-primary-light/20 text-primary-dark" },
    renewal: { label: "تمدید اشتراک", tone: "bg-secondary-blue/40 text-blue-600" },
    refund: { label: "بازگشت وجه", tone: "bg-secondary-pink/40 text-pink-600" },
};

const TRANSACTIONS = [
    { id: "TRX-10248", clinic: "کلینیک زیبایی آرامش", type: "renewal", method: "کارت بانکی", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۵ - ۱۰:۱۵", status: "success" },
    { id: "TRX-10247", clinic: "مرکز پوست و مو رویان", type: "subscription", method: "درگاه اینترنتی", amount: "۴,۵۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۵ - ۰۹:۴۷", status: "success" },
    { id: "TRX-10246", clinic: "کلینیک لیزر ماهرخ", type: "renewal", method: "کارت بانکی", amount: "۱,۹۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۴ - ۱۶:۳۰", status: "failed" },
    { id: "TRX-10245", clinic: "مرکز جوانسازی بهار", type: "subscription", method: "درگاه اینترنتی", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۴ - ۱۴:۱۰", status: "pending" },
    { id: "TRX-10244", clinic: "کلینیک زیبایی نیکو", type: "renewal", method: "کارت بانکی", amount: "۴,۵۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۳ - ۱۱:۰۵", status: "success" },
    { id: "TRX-10243", clinic: "کلینیک دل‌آرام", type: "refund", method: "کیف پول", amount: "۱,۹۰۰,۰۰۰-", date: "۱۴۰۳/۰۴/۱۲ - ۰۸:۲۰", status: "success" },
    { id: "TRX-10242", clinic: "رویای زیبا", type: "subscription", method: "درگاه اینترنتی", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۰ - ۱۹:۴۰", status: "success" },
];

const TYPE_FILTERS = [
    { value: "all", label: "همه انواع" },
    { value: "subscription", label: "پرداخت اشتراک" },
    { value: "renewal", label: "تمدید اشتراک" },
    { value: "refund", label: "بازگشت وجه" },
];

export default function TransactionsPage() {
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredTransactions = TRANSACTIONS.filter((t) => {
        const matchType =
            typeFilter === "all" || t.type === typeFilter;

        const keyword = search.trim().toLowerCase();

        const matchSearch =
            keyword === "" ||
            t.id.toLowerCase().includes(keyword) ||
            t.clinic.toLowerCase().includes(keyword) ||
            t.method.toLowerCase().includes(keyword) ||
            t.amount.includes(keyword);

        return matchType && matchSearch;
    });

    return (
        <div className="space-y-6">
            {/* هدر صفحه */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 md:text-2xl">تراکنش‌ها</h1>
                    <p className="mt-1 text-sm text-gray-400">تاریخچه‌ی کامل پرداخت‌ها و تراکنش‌های مالی سامانه</p>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                    <Download className="h-4 w-4" /> خروجی اکسل
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

            {/* جدول تراکنش‌ها */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 lg:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی شناسه تراکنش یا نام کلینیک..."
                            className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
                        />
                        <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
                        >
                            {TYPE_FILTERS.map((f) => (
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
                    <table className="w-full min-w-[820px] text-right text-xs">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400">
                                <th className="py-2 font-medium">شناسه تراکنش</th>
                                <th className="py-2 font-medium">کلینیک</th>
                                <th className="py-2 font-medium">نوع</th>
                                <th className="py-2 font-medium">روش پرداخت</th>
                                <th className="py-2 font-medium">مبلغ (تومان)</th>
                                <th className="py-2 font-medium">تاریخ</th>
                                <th className="py-2 font-medium">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((t) => {
                                const StatusIcon = STATUS_STYLES[t.status].icon;
                                const isRefund = t.type === "refund";
                                return (
                                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                                        <td className="py-3 font-medium text-gray-700" dir="ltr">
                                            {t.id}
                                        </td>
                                        <td className="py-3 text-gray-700">{t.clinic}</td>
                                        <td className="py-3">
                                            <span className={`rounded-full px-2.5 py-1 text-[11px] ${TYPE_STYLES[t.type].tone}`}>
                                                {TYPE_STYLES[t.type].label}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                {t.method === "کیف پول" ? (
                                                    <Wallet className="h-3.5 w-3.5 text-gray-300" />
                                                ) : t.method === "کارت بانکی" ? (
                                                    <CreditCard className="h-3.5 w-3.5 text-gray-300" />
                                                ) : (
                                                    <Landmark className="h-3.5 w-3.5 text-gray-300" />
                                                )}
                                                {t.method}
                                            </span>
                                        </td>
                                        <td className={`py-3 ${isRefund ? "text-danger" : "text-gray-700"}`}>{t.amount}</td>
                                        <td className="py-3 text-gray-500">{t.date}</td>
                                        <td className="py-3">
                                            <span className={`flex items-center gap-1 ${STATUS_STYLES[t.status].tone}`}>
                                                <StatusIcon className="h-3.5 w-3.5" /> {STATUS_STYLES[t.status].label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredTransactions.length === 0 && (
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
                    <span className="text-xs text-gray-400">نمایش ۷ از ۱۴۸ تراکنش</span>
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
