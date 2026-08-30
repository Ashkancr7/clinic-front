
"use client";

import { use, useState } from "react";

import {
  Search,
  CalendarPlus,
  Sparkles,
  Syringe,
  Scissors,
  Droplet,
} from "lucide-react";

import { PatientHeader } from "@/components/layout/PatientHeader";

const CATEGORIES = ["همه", "پوست", "مو", "تزریقات", "لیزر"];

const SERVICES = [
  {
    icon: Sparkles,
    tone: "from-primary-light/60 to-primary-light/20",
    name: "مزوتراپی صورت",
    category: "پوست",
    desc: "جوان‌سازی و شادابی پوست با تزریق ویتامین",
    price: "۲,۵۰۰,۰۰۰ تومان",
  },
  {
    icon: Syringe,
    tone: "from-pink-200 to-pink-100",
    name: "تزریق ژل لب",
    category: "تزریقات",
    desc: "فرم‌دهی و حجم‌دهی طبیعی لب‌ها",
    price: "۳,۸۰۰,۰۰۰ تومان",
  },
  {
    icon: Syringe,
    tone: "from-secondary-purple/60 to-secondary-purple/20",
    name: "بوتاکس",
    category: "تزریقات",
    desc: "رفع خطوط ریز و چروک صورت",
    price: "۲,۹۰۰,۰۰۰ تومان",
  },
  {
    icon: Droplet,
    tone: "from-secondary-blue/60 to-secondary-blue/20",
    name: "مزوتراپی مو",
    category: "مو",
    desc: "تقویت ریشه مو و کاهش ریزش",
    price: "۱,۸۰۰,۰۰۰ تومان",
  },
  {
    icon: Scissors,
    tone: "from-primary-light/60 to-secondary-blue/30",
    name: "لیزر موهای زائد",
    category: "لیزر",
    desc: "حذف دائمی موهای زائد با دستگاه دیود",
    price: "۱,۲۰۰,۰۰۰ تومان",
  },
  {
    icon: Sparkles,
    tone: "from-secondary-pink/60 to-secondary-pink/20",
    name: "میکرونیدلینگ",
    category: "پوست",
    desc: "بازسازی پوست و کاهش جای جوش",
    price: "۲,۲۰۰,۰۰۰ تومان",
  },
];

export default function ServicesPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  const [category, setCategory] = useState("همه");
  const [search, setSearch] = useState("");

  const filtered = SERVICES.filter((service) => {
    const matchesCategory =
      category === "همه" || service.category === category;

    const matchesSearch =
      service.name.includes(search) ||
      service.desc.includes(search) ||
      service.category.includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              خدمات کلینیک
            </h1>

            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              خدمات ارائه‌شده در این کلینیک را مشاهده و رزرو کنید
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{filtered.length}</span>
            <span>خدمت</span>
          </div>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 transition focus-within:border-primary/40 dark:border-white/10 dark:bg-white/[0.06]">
            <Search className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی خدمت..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300 dark:text-gray-200 dark:placeholder:text-gray-500 sm:w-64"
            />
          </div>

          {/* Categories */}
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-xs transition-colors ${
                    category === item
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.1]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.name}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.08]"
                >
                  {/* Icon Header */}
                  <div
                    className={`flex h-28 items-center justify-center bg-gradient-to-br ${service.tone} dark:opacity-90`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Icon className="h-7 w-7 text-white/90" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {service.name}
                      </span>

                      <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-white/10 dark:text-gray-400">
                        {service.category}
                      </span>
                    </div>

                    <p className="mb-4 min-h-[36px] text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                      {service.desc}
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-50 pt-3 dark:border-white/10">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {service.price}
                      </span>

                      <button className="flex items-center gap-1.5 rounded-lg bg-primary-light/15 px-3 py-2 text-[11px] font-medium text-primary-dark transition hover:bg-primary-light/25 dark:bg-primary-light/10 dark:text-primary-light dark:hover:bg-primary-light/20">
                        <CalendarPlus className="h-3.5 w-3.5" />
                        رزرو نوبت
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-gray-100 bg-white py-14 text-center dark:border-white/10 dark:bg-white/[0.06]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/10">
              <Search className="h-5 w-5 text-primary-light" />
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              خدمتی پیدا نشد
            </p>

            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              عبارت جستجو یا دسته‌بندی دیگری را امتحان کنید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}