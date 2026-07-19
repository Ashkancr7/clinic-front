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
  { icon: ShieldAlert, label: "حساسیت‌ها", value: "حساسیت به پنی‌سیلین" },
  { icon: Scissors, label: "سابقه جراحی", value: "ندارد" },
  { icon: Droplet, label: "گروه خونی", value: "O+" },
];

const TREATMENT_TIMELINE = [
  { date: "۱۴۰۳/۰۳/۲۸", title: "مزوتراپی صورت", doctor: "دکتر سارا محمدی", note: "جلسه سوم از پکیج ۴ جلسه‌ای انجام شد. عارضه‌ای مشاهده نشد." },
  { date: "۱۴۰۳/۰۲/۱۵", title: "بوتاکس", doctor: "دکتر سارا محمدی", note: "تزریق در نواحی پیشانی و اطراف چشم انجام شد." },
  { date: "۱۴۰۳/۰۲/۱۰", title: "تزریق ژل لب", doctor: "دکتر سارا محمدی", note: "۱ سی‌سی ژل هیالورونیک در لب بالا و پایین تزریق شد." },
  { date: "۱۴۰۳/۰۱/۳۱", title: "مزوتراپی مو", doctor: "دکتر سارا محمدی", note: "شروع دوره درمانی ریزش مو، جلسه اول." },
];

const DOCUMENTS = [
  { name: "پرونده کامل پزشکی", size: "۳.۴ مگابایت" },
  { name: "نتایج آزمایش خون", size: "۹۰۰ کیلوبایت" },
  { name: "گزارش مشاوره اولیه", size: "۱.۱ مگابایت" },
];

export default function MedicalRecordsPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">پرونده پزشکی من</h1>
          <p className="mt-1 text-sm text-gray-400">سوابق درمانی، اطلاعات پزشکی و مستندات شما</p>
        </div>

        {/* اطلاعات پزشکی */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-800">اطلاعات پزشکی پایه</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MEDICAL_INFO.map((m) => (
              <div key={m.label} className="rounded-xl border border-gray-100 p-3">
                <m.icon className="mb-2 h-4 w-4 text-primary-dark" />
                <div className="text-[11px] text-gray-400">{m.label}</div>
                <div className="mt-0.5 text-xs font-medium text-gray-700">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* تایم‌لاین درمان */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
            <h2 className="mb-4 text-sm font-bold text-gray-800">تاریخچه و یادداشت‌های درمانی</h2>
            <div className="relative space-y-6 border-r-2 border-gray-100 pr-4">
              {TREATMENT_TIMELINE.map((t) => (
                <div key={t.date + t.title} className="relative">
                  <span className="absolute -right-[21px] top-1 h-3 w-3 rounded-full border-2 border-white bg-primary" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{t.title}</span>
                    <span className="text-[11px] text-gray-400">{t.date}</span>
                  </div>
                  <div className="text-xs text-gray-400">{t.doctor}</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* اسناد */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-800">اسناد پزشکی</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-gray-300" />
                    <div>
                      <div className="text-xs font-medium text-gray-700">{d.name}</div>
                      <div className="text-[10px] text-gray-400">{d.size}</div>
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
      </div>
    </div>
  );
}
