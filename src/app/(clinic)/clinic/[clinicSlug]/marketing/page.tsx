"use client";

import { Plus, Send, Percent, Users, TrendingUp, MoreHorizontal } from "lucide-react";

const STATS = [
  { icon: Send, tone: "text-primary-dark bg-primary-light/20", label: "کمپین‌های فعال", value: "۳" },
  { icon: Users, tone: "text-purple-600 bg-secondary-purple/40", label: "مخاطبان رسیده", value: "۱,۸۴۰" },
  { icon: Percent, tone: "text-pink-600 bg-secondary-pink/40", label: "کدهای تخفیف فعال", value: "۵" },
  { icon: TrendingUp, tone: "text-blue-600 bg-secondary-blue/40", label: "نرخ تبدیل", value: "۱۲٪" },
];

const CAMPAIGNS = [
  { name: "تخفیف تابستانه بوتاکس", type: "پیامکی", audience: "۶۴۰ نفر", status: "فعال", statusTone: "bg-primary-light/20 text-primary-dark" },
  { name: "کد تخفیف اولین مراجعه", type: "لینک اختصاصی", audience: "نامحدود", status: "فعال", statusTone: "bg-primary-light/20 text-primary-dark" },
  { name: "یادآوری مراجعین غیرفعال", type: "پیامکی", audience: "۳۲۰ نفر", status: "زمان‌بندی‌شده", statusTone: "bg-amber-50 text-warning" },
  { name: "کمپین نوروزی", type: "پیامکی + ایمیل", audience: "۱,۲۰۰ نفر", status: "پایان‌یافته", statusTone: "bg-gray-100 text-gray-500" },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">بازاریابی</h1>
          <p className="mt-1 text-sm text-gray-400">کمپین‌ها، کدهای تخفیف و جذب مجدد مراجعین</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> کمپین جدید
        </button>
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
        <h2 className="mb-4 text-sm font-bold text-gray-800">کمپین‌ها</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">نام کمپین</th>
                <th className="py-2 font-medium">نوع</th>
                <th className="py-2 font-medium">مخاطبان</th>
                <th className="py-2 font-medium">وضعیت</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c) => (
                <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="py-3 text-gray-500">{c.type}</td>
                  <td className="py-3 text-gray-500">{c.audience}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${c.statusTone}`}>{c.status}</span>
                  </td>
                  <td className="py-3">
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
