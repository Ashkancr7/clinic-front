"use client";

import { Search, SlidersHorizontal, FolderHeart, FileText, Download } from "lucide-react";

const RECORDS = [
  { patient: "نسترن موسوی", type: "پرونده کامل پزشکی", updatedAt: "۱۴۰۳/۰۳/۲۱", size: "۳.۴ مگابایت" },
  { patient: "نگین رضوی", type: "نتایج آزمایش خون", updatedAt: "۱۴۰۳/۰۳/۱۸", size: "۹۰۰ کیلوبایت" },
  { patient: "مریم اکبری", type: "گزارش مشاوره اولیه", updatedAt: "۱۴۰۳/۰۳/۱۵", size: "۱.۱ مگابایت" },
  { patient: "الناز حیدری", type: "پرونده کامل پزشکی", updatedAt: "۱۴۰۳/۰۳/۱۰", size: "۲.۸ مگابایت" },
];

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FolderHeart className="h-5 w-5 text-primary-dark" /> پرونده‌ها
        </h1>
        <p className="mt-1 text-sm text-gray-400">دسترسی سریع به پرونده‌های پزشکی همه‌ی مراجعین</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-72">
            <input type="text" placeholder="جستجوی نام مراجع یا نوع پرونده..." className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300" />
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
            <SlidersHorizontal className="h-3.5 w-3.5" /> فیلتر
          </button>
        </div>

        <div className="space-y-3">
          {RECORDS.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-gray-50 p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-gray-300" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">{r.type}</div>
                  <div className="text-[11px] text-gray-400">
                    {r.patient} · {r.updatedAt} · {r.size}
                  </div>
                </div>
              </div>
              <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-primary-dark">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
