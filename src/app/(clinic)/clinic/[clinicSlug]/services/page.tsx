"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Sparkles, Syringe, Scissors, Droplet } from "lucide-react";

const CATEGORIES = ["همه", "پوست", "مو", "تزریقات", "لیزر"];

const SERVICES = [
  { icon: Sparkles, tone: "from-primary-light/60 to-primary-light/20", name: "مزوتراپی صورت", category: "پوست", duration: "۴۵ دقیقه", price: "۲,۵۰۰,۰۰۰", active: true },
  { icon: Syringe, tone: "from-pink-200 to-pink-100", name: "تزریق ژل لب", category: "تزریقات", duration: "۳۰ دقیقه", price: "۳,۸۰۰,۰۰۰", active: true },
  { icon: Syringe, tone: "from-secondary-purple/60 to-secondary-purple/20", name: "بوتاکس", category: "تزریقات", duration: "۳۰ دقیقه", price: "۲,۹۰۰,۰۰۰", active: true },
  { icon: Droplet, tone: "from-secondary-blue/60 to-secondary-blue/20", name: "مزوتراپی مو", category: "مو", duration: "۴۰ دقیقه", price: "۱,۸۰۰,۰۰۰", active: true },
  { icon: Scissors, tone: "from-primary-light/60 to-secondary-blue/30", name: "لیزر موهای زائد", category: "لیزر", duration: "۲۰ دقیقه", price: "۱,۲۰۰,۰۰۰", active: false },
  { icon: Sparkles, tone: "from-secondary-pink/60 to-secondary-pink/20", name: "میکرونیدلینگ", category: "پوست", duration: "۵۰ دقیقه", price: "۲,۲۰۰,۰۰۰", active: true },
];

export default function ServicesManagementPage() {
  const [category, setCategory] = useState("همه");
  const filtered = SERVICES.filter((s) => category === "همه" || s.category === category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">خدمات</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت خدمات، قیمت‌ها و مدت‌زمان هر خدمت</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> افزودن خدمت جدید
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:w-72">
          <input type="text" placeholder="جستجوی خدمت..." className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-300" />
          <Search className="h-4 w-4 shrink-0 text-gray-300" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs ${category === c ? "bg-primary text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.name} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className={`flex h-24 items-center justify-center bg-gradient-to-br ${s.tone}`}>
              <s.icon className="h-7 w-7 text-white/90" />
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                <span className={`h-2 w-2 rounded-full ${s.active ? "bg-primary" : "bg-gray-300"}`} />
              </div>
              <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-400">
                <span>{s.category}</span> · <span>{s.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">{s.price} تومان</span>
                <div className="flex gap-1">
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-primary-dark">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
