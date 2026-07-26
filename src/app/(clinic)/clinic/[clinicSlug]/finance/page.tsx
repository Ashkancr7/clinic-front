"use client";

import { Wallet, Receipt, Clock3, TrendingDown, Search, Download, Plus, MoreHorizontal } from "lucide-react";

import { useState } from "react";

const STATS = [
  { icon: Wallet, tone: "text-primary-dark bg-primary-light/20", label: "درآمد این ماه", value: "۹۸,۰۰۰,۰۰۰ ت" },
  { icon: Receipt, tone: "text-blue-600 bg-secondary-blue/40", label: "فاکتورهای صادرشده", value: "۱۴۶" },
  { icon: Clock3, tone: "text-warning bg-amber-50", label: "مطالبات معوق", value: "۱۲,۴۰۰,۰۰۰ ت" },
  { icon: TrendingDown, tone: "text-danger bg-red-50", label: "هزینه‌های این ماه", value: "۱۸,۲۰۰,۰۰۰ ت" },
];

const INVOICES = [
  { id: "INV-1403-241", patient: "سارا محمدی", service: "مزوتراپی صورت", amount: "۲,۵۰۰,۰۰۰", date: "۱۴۰۳/۰۳/۲۱", status: "پرداخت‌شده" },
  { id: "INV-1403-240", patient: "نگین رضوی", service: "بوتاکس", amount: "۲,۹۰۰,۰۰۰", date: "۱۴۰۳/۰۳/۲۰", status: "پرداخت‌شده" },
  { id: "INV-1403-239", patient: "مریم اکبری", service: "مشاوره پوست", amount: "۵۰۰,۰۰۰", date: "۱۴۰۳/۰۳/۱۸", status: "در انتظار" },
  { id: "INV-1403-238", patient: "الناز حیدری", service: "لیزر موهای زائد", amount: "۱,۲۰۰,۰۰۰", date: "۱۴۰۳/۰۳/۱۵", status: "معوق" },
];

const STATUS_TONE: Record<string, string> = {
  "پرداخت‌شده": "bg-primary-light/20 text-primary-dark",
  "در انتظار": "bg-amber-50 text-warning",
  "معوق": "bg-red-50 text-danger",
};

export default function FinancePage() {

  const [search, setSearch] = useState("");

  const filteredInvoices = INVOICES.filter((invoice) => {
    const value = search.trim();

    return (
      invoice.id.includes(value) ||
      invoice.patient.includes(value) ||
      invoice.service.includes(value) ||
      invoice.amount.includes(value) ||
      invoice.date.includes(value) ||
      invoice.status.includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">مالی</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت فاکتورها، پرداخت‌ها و وضعیت مالی کلینیک</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <Download className="h-3.5 w-3.5" /> خروجی اکسل
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4" /> صدور فاکتور جدید
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

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold text-gray-800">فاکتورها</h2>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی فاکتور یا مراجع..."
              className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
            />
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">شماره فاکتور</th>
                <th className="py-2 font-medium">مراجع</th>
                <th className="py-2 font-medium">خدمت</th>
                <th className="py-2 font-medium">مبلغ (تومان)</th>
                <th className="py-2 font-medium">تاریخ</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3 font-medium text-gray-700" dir="ltr">{inv.id}</td>
                  <td className="py-3 text-gray-700">{inv.patient}</td>
                  <td className="py-3 text-gray-500">{inv.service}</td>
                  <td className="py-3 text-gray-700">{inv.amount}</td>
                  <td className="py-3 text-gray-500">{inv.date}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_TONE[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="py-3">
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    {/* بقیه کد */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
