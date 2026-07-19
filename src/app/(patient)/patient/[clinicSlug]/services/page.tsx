"use client";

import { use, useState } from "react";
import { Search, CalendarPlus, Sparkles, Syringe, Scissors, Droplet } from "lucide-react";
import { PatientHeader } from "@/components/layout/PatientHeader";

const CATEGORIES = ["همه", "پوست", "مو", "تزریقات", "لیزر"];

const SERVICES = [
  { icon: Sparkles, tone: "from-primary-light/60 to-primary-light/20", name: "مزوتراپی صورت", category: "پوست", desc: "جوان‌سازی و شادابی پوست با تزریق ویتامین", price: "۲,۵۰۰,۰۰۰ تومان" },
  { icon: Syringe, tone: "from-pink-200 to-pink-100", name: "تزریق ژل لب", category: "تزریقات", desc: "فرم‌دهی و حجم‌دهی طبیعی لب‌ها", price: "۳,۸۰۰,۰۰۰ تومان" },
  { icon: Syringe, tone: "from-secondary-purple/60 to-secondary-purple/20", name: "بوتاکس", category: "تزریقات", desc: "رفع خطوط ریز و چروک صورت", price: "۲,۹۰۰,۰۰۰ تومان" },
  { icon: Droplet, tone: "from-secondary-blue/60 to-secondary-blue/20", name: "مزوتراپی مو", category: "مو", desc: "تقویت ریشه مو و کاهش ریزش", price: "۱,۸۰۰,۰۰۰ تومان" },
  { icon: Scissors, tone: "from-primary-light/60 to-secondary-blue/30", name: "لیزر موهای زائد", category: "لیزر", desc: "حذف دائمی موهای زائد با دستگاه دیود", price: "۱,۲۰۰,۰۰۰ تومان" },
  { icon: Sparkles, tone: "from-secondary-pink/60 to-secondary-pink/20", name: "میکرونیدلینگ", category: "پوست", desc: "بازسازی پوست و کاهش جای جوش", price: "۲,۲۰۰,۰۰۰ تومان" },
];

export default function ServicesPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [category, setCategory] = useState("همه");

  const filtered = SERVICES.filter((s) => category === "همه" || s.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">خدمات من</h1>
          <p className="mt-1 text-sm text-gray-400">خدمات ارائه‌شده در این کلینیک را مشاهده و رزرو کنید</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:w-72">
            <input
              type="text"
              placeholder="جستجوی خدمت..."
              className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-300"
            />
            <Search className="h-4 w-4 shrink-0 text-gray-300" />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-xs ${
                  category === c
                    ? "bg-primary text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${s.tone}`}>
                <s.icon className="h-8 w-8 text-white/90" />
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                  <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500">{s.category}</span>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-gray-400">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{s.price}</span>
                  <button className="flex items-center gap-1 rounded-lg bg-primary-light/15 px-3 py-1.5 text-[11px] font-medium text-primary-dark hover:bg-primary-light/25">
                    <CalendarPlus className="h-3.5 w-3.5" /> رزرو نوبت
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
