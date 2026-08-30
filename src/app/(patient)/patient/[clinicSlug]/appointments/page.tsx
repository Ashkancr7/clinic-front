"use client";

import { use, useState } from "react";

import {
  CalendarPlus,
  Clock3,
  MapPin,
  MoreHorizontal,
  Video,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { PatientHeader } from "@/components/layout/PatientHeader";

const TABS = [
  { key: "upcoming", label: "نوبت‌های آینده" },
  { key: "past", label: "نوبت‌های گذشته" },
  { key: "canceled", label: "لغوشده‌ها" },
];

const UPCOMING = [
  {
    service: "مزوتراپی صورت",
    doctor: "دکتر سارا محمدی",
    date: "چهارشنبه ۳۱ اردیبهشت ۱۴۰۳",
    time: "۱۰:۳۰",
    type: "حضوری",
    location: "کلینیک زیبایی آرامش - طبقه ۲",
  },
  {
    service: "مشاوره آنلاین پوست",
    doctor: "دکتر آرش نیکنام",
    date: "شنبه ۱۰ خرداد ۱۴۰۳",
    time: "۱۷:۰۰",
    type: "آنلاین",
    location: "تماس تصویری",
  },
];

const PAST = [
  {
    service: "بوتاکس",
    doctor: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۲/۱۵",
    status: "انجام‌شده",
  },
  {
    service: "تزریق ژل لب",
    doctor: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۲/۱۰",
    status: "انجام‌شده",
  },
  {
    service: "مزوتراپی مو",
    doctor: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۱/۳۱",
    status: "انجام‌شده",
  },
];

const CANCELED = [
  {
    service: "لیزر موهای زائد",
    doctor: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۱/۱۵",
    status: "لغوشده",
  },
];

export default function AppointmentsPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              نوبت‌های من
            </h1>

            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              مدیریت و پیگیری نوبت‌های رزروشده
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark dark:bg-primary/90 dark:hover:bg-primary">
            <CalendarPlus className="h-4 w-4" />
            درخواست نوبت جدید
          </button>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4 dark:border-white/10 dark:bg-white/[0.06]">
          <div className="flex min-w-max items-center gap-6 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 py-3 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary font-medium text-primary-dark dark:border-primary-light dark:text-primary-light"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {UPCOMING.map((a) => (
              <div
                key={a.service + a.date}
                className="rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.08]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/20 dark:bg-primary-light/10">
                      {a.type === "آنلاین" ? (
                        <Video className="h-5 w-5 text-primary-dark dark:text-primary-light" />
                      ) : (
                        <Clock3 className="h-5 w-5 text-primary-dark dark:text-primary-light" />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {a.service}
                      </div>

                      <div className="text-xs text-gray-400">
                        {a.doctor}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {a.date} - {a.time}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {a.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        a.type === "آنلاین"
                          ? "bg-secondary-blue/40 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
                          : "bg-primary-light/20 text-primary-dark dark:bg-primary-light/10 dark:text-primary-light"
                      }`}
                    >
                      {a.type}
                    </span>

                    <button
                      aria-label="گزینه‌های بیشتر"
                      className="rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-primary hover:text-primary dark:border-white/15 dark:text-gray-400 dark:hover:border-primary-light dark:hover:text-primary-light"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past */}
        {activeTab === "past" && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/[0.06]">
            {PAST.map((a, i) => (
              <div
                key={a.service + a.date}
                className={`flex items-center justify-between p-4 ${
                  i !== PAST.length - 1
                    ? "border-b border-gray-50 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary-dark dark:text-primary-light" />

                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {a.service}
                    </div>

                    <div className="text-xs text-gray-400">
                      {a.doctor} · {a.date}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-primary-light/20 px-3 py-1 text-[11px] text-primary-dark dark:bg-primary-light/10 dark:text-primary-light">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Canceled */}
        {activeTab === "canceled" && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/[0.06]">
            {CANCELED.map((a, i) => (
              <div
                key={a.service + a.date}
                className={`flex items-center justify-between p-4 ${
                  i !== CANCELED.length - 1
                    ? "border-b border-gray-50 dark:border-white/10"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-danger" />

                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {a.service}
                    </div>

                    <div className="text-xs text-gray-400">
                      {a.doctor} · {a.date}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] text-danger dark:bg-red-500/15 dark:text-red-300">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}