
"use client";

import { use } from "react";

import {
  HeartPulse,
  Pill,
  ShieldAlert,
  Scissors,
  Droplet,
  Download,
  FileText,
} from "lucide-react";

import { PatientHeader } from "@/components/layout/PatientHeader";

const MEDICAL_INFO = [
  { icon: HeartPulse, label: "بیماری زمینه‌ای", value: "ندارد" },
  { icon: Pill, label: "داروهای مصرفی", value: "ندارد" },
  {
    icon: ShieldAlert,
    label: "حساسیت‌ها",
    value: "حساسیت به پنی‌سیلین",
  },
  { icon: Scissors, label: "سابقه جراحی", value: "ندارد" },
  { icon: Droplet, label: "گروه خونی", value: "O+" },
];

const TREATMENT_TIMELINE = [
  {
    date: "۱۴۰۳/۰۳/۲۸",
    title: "مزوتراپی صورت",
    doctor: "دکتر سارا محمدی",
    note: "جلسه سوم از پکیج ۴ جلسه‌ای انجام شد. عارضه‌ای مشاهده نشد.",
  },
  {
    date: "۱۴۰۳/۰۲/۱۵",
    title: "بوتاکس",
    doctor: "دکتر سارا محمدی",
    note: "تزریق در نواحی پیشانی و اطراف چشم انجام شد.",
  },
  {
    date: "۱۴۰۳/۰۲/۱۰",
    title: "تزریق ژل لب",
    doctor: "دکتر سارا محمدی",
    note: "۱ سی‌سی ژل هیالورونیک در لب بالا و پایین تزریق شد.",
  },
  {
    date: "۱۴۰۳/۰۱/۳۱",
    title: "مزوتراپی مو",
    doctor: "دکتر سارا محمدی",
    note: "شروع دوره درمانی ریزش مو، جلسه اول.",
  },
];

const DOCUMENTS = [
  { name: "پرونده کامل پزشکی", size: "۳.۴ مگابایت" },
  { name: "نتایج آزمایش خون", size: "۹۰۰ کیلوبایت" },
  { name: "گزارش مشاوره اولیه", size: "۱.۱ مگابایت" },
];

export default function MedicalRecordsPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            پرونده پزشکی من
          </h1>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            سوابق درمانی، اطلاعات پزشکی و مستندات شما
          </p>
        </div>

        {/* اطلاعات پزشکی پایه */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/[0.06]">
          <h2 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
            اطلاعات پزشکی پایه
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {MEDICAL_INFO.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                >
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light/15 dark:bg-primary-light/10">
                    <Icon className="h-4 w-4 text-primary-dark dark:text-primary-light" />
                  </div>

                  <div className="text-[11px] text-gray-400 dark:text-gray-500">
                    {item.label}
                  </div>

                  <div className="mt-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline + Documents */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* تاریخچه درمان */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/[0.06] lg:col-span-2">
            <h2 className="mb-5 text-sm font-bold text-gray-800 dark:text-gray-100">
              تاریخچه و یادداشت‌های درمانی
            </h2>

            <div className="relative space-y-6 border-r-2 border-gray-100 pr-5 dark:border-white/10">
              {TREATMENT_TIMELINE.map((treatment) => (
                <div
                  key={treatment.date + treatment.title}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <span className="absolute -right-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-gray-900" />

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {treatment.title}
                    </span>

                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      {treatment.date}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {treatment.doctor}
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {treatment.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* اسناد پزشکی */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-white/[0.06]">
            <h2 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
              اسناد پزشکی
            </h2>

            <div className="space-y-1">
              {DOCUMENTS.map((document) => (
                <div
                  key={document.name}
                  className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.06]">
                      <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                        {document.name}
                      </div>

                      <div className="text-[10px] text-gray-400 dark:text-gray-500">
                        {document.size}
                      </div>
                    </div>
                  </div>

                  <button
                    aria-label={`دانلود ${document.name}`}
                    className="shrink-0 rounded-lg border border-gray-200 p-1.5 text-gray-400 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-gray-500 dark:hover:border-primary-light dark:hover:text-primary-light"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
