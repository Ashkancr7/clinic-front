"use client";

import {
  Plus,
  Check,
  Pencil,
  MoreHorizontal,
  Sparkles,
  Zap,
  Crown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

const PLAN_TIERS = [
  {
    icon: Sparkles,
    tone: "text-pink-600 bg-secondary-pink/40",
    name: "پلن پایه",
    price: "۱,۹۰۰,۰۰۰",
    period: "تومان / ماه",
    subscribers: "۶ کلینیک",
    features: [
      "تا ۲ کاربر فعال",
      "مدیریت نوبت‌دهی و مراجعین",
      "پرونده پایه بیمار",
      "پشتیبانی ایمیلی",
    ],
    highlight: false,
  },
  {
    icon: Zap,
    tone: "text-gray-600 bg-gray-100",
    name: "پلن استاندارد",
    price: "۴,۵۰۰,۰۰۰",
    period: "تومان / ماه",
    subscribers: "۱۴ کلینیک",
    features: [
      "تا ۸ کاربر فعال",
      "همه امکانات پلن پایه",
      "عکس‌های قبل و بعد + گالری",
      "پیامک اتوماتیک و یادآوری",
      "پشتیبانی تلفنی",
    ],
    highlight: true,
  },
  {
    icon: Crown,
    tone: "text-primary-dark bg-primary-light/20",
    name: "پلن حرفه‌ای",
    price: "۹,۸۰۰,۰۰۰",
    period: "تومان / ماه",
    subscribers: "۱۲ کلینیک",
    features: [
      "کاربران نامحدود",
      "همه امکانات پلن استاندارد",
      "تماس تصویری و پرونده مرکزی",
      "گزارش‌های مدیریتی پیشرفته",
      "پشتیبانی اختصاصی ۲۴/۷",
    ],
    highlight: false,
  },
];

const SUBSCRIPTIONS = [
  { clinic: "کلینیک زیبایی آرامش", plan: "پلن حرفه‌ای", planTone: "bg-primary-light/20 text-primary-dark", start: "۱۴۰۲/۰۷/۱۵", renewal: "۱۴۰۳/۰۷/۱۵", amount: "۹,۸۰۰,۰۰۰", status: "پرداخت‌شده", statusTone: "text-primary-dark" },
  { clinic: "مرکز پوست و مو رویان", plan: "پلن استاندارد", planTone: "bg-gray-100 text-gray-600", start: "۱۴۰۲/۰۶/۲۰", renewal: "۱۴۰۳/۰۶/۲۰", amount: "۴,۵۰۰,۰۰۰", status: "پرداخت‌شده", statusTone: "text-primary-dark" },
  { clinic: "کلینیک لیزر ماهرخ", plan: "پلن پایه", planTone: "bg-secondary-pink/40 text-pink-600", start: "۱۴۰۲/۰۴/۰۲", renewal: "۱۴۰۳/۰۴/۰۲", amount: "۱,۹۰۰,۰۰۰", status: "منقضی‌شده", statusTone: "text-danger" },
  { clinic: "مرکز جوانسازی بهار", plan: "پلن حرفه‌ای", planTone: "bg-primary-light/20 text-primary-dark", start: "۱۴۰۲/۰۸/۱۰", renewal: "۱۴۰۳/۰۸/۱۰", amount: "۹,۸۰۰,۰۰۰", status: "در انتظار پرداخت", statusTone: "text-warning" },
  { clinic: "کلینیک زیبایی نیکو", plan: "پلن استاندارد", planTone: "bg-gray-100 text-gray-600", start: "۱۴۰۲/۰۶/۰۵", renewal: "۱۴۰۳/۰۶/۰۵", amount: "۴,۵۰۰,۰۰۰", status: "پرداخت‌شده", statusTone: "text-primary-dark" },
];

export default function PlansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");

  const filteredSubscriptions = useMemo(() => {
    return SUBSCRIPTIONS.filter((item) => {
      const matchSearch =
        item.clinic.includes(search) ||
        item.plan.includes(search);

      const matchStatus =
        statusFilter === "همه" ||
        item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);


  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">اشتراک‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت پلن‌های اشتراک و وضعیت پرداخت کلینیک‌ها</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> ایجاد پلن جدید
        </button>
      </div>

      {/* کارت‌های پلن */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {PLAN_TIERS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border bg-white p-6 ${plan.highlight ? "border-primary shadow-md" : "border-gray-100"
              }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-medium text-white">
                محبوب‌ترین
              </span>
            )}

            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${plan.tone}`}>
                <plan.icon className="h-5 w-5" />
              </div>
              <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="text-base font-bold text-gray-900">{plan.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-xs text-gray-400">{plan.period}</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">{plan.subscribers} مشترک</div>

            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-dark" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* جدول اشتراک‌های فعال */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-gray-900">اشتراک‌های کلینیک‌ها</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی کلینیک..."
                className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
              />
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none"
            >
              <option value="همه">همه وضعیت‌ها</option>
              <option value="پرداخت‌شده">پرداخت‌شده</option>
              <option value="در انتظار پرداخت">در انتظار پرداخت</option>
              <option value="منقضی‌شده">منقضی‌شده</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400">
                <th className="py-2 font-medium">کلینیک</th>
                <th className="py-2 font-medium">پلن</th>
                <th className="py-2 font-medium">تاریخ شروع</th>
                <th className="py-2 font-medium">تاریخ تمدید</th>
                <th className="py-2 font-medium">مبلغ (تومان)</th>
                <th className="py-2 font-medium">وضعیت پرداخت</th>
                <th className="py-2 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((s) => (
                <tr key={s.clinic} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="py-3 font-medium text-gray-800">{s.clinic}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${s.planTone}`}>{s.plan}</span>
                  </td>
                  <td className="py-3 text-gray-500">{s.start}</td>
                  <td className="py-3 text-gray-500">{s.renewal}</td>
                  <td className="py-3 text-gray-700">{s.amount}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 ${s.statusTone}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {s.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSubscriptions.length === 0 && (
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
      </div>
    </div>
  );
}
