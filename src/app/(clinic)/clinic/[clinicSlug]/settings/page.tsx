"use client";

import { useState } from "react";
import { Settings2, Clock3, FileText, Bell, Save, Upload } from "lucide-react";

const TABS = [
  { key: "general", label: "عمومی", icon: Settings2 },
  { key: "hours", label: "ساعات کاری", icon: Clock3 },
  { key: "forms", label: "فرم‌ها و رضایت‌نامه‌ها", icon: FileText },
  { key: "notifications", label: "اطلاع‌رسانی", icon: Bell },
];

const WEEK_DAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

export default function ClinicSettingsPage() {
  const [tab, setTab] = useState("general");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">تنظیمات کلینیک</h1>
        <p className="mt-1 text-sm text-gray-400">اطلاعات عمومی، ساعات کاری و تنظیمات فرم‌ها</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        <div className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
                tab === t.key ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-6">
          {tab === "general" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-gray-800">اطلاعات عمومی کلینیک</h2>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-gray-100" />
                <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600">
                  <Upload className="h-3.5 w-3.5" /> آپلود لوگوی کلینیک
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="نام کلینیک" defaultValue="کلینیک زیبایی آرامش" />
                <Field label="شماره تماس" defaultValue="021-88880000" dir="ltr" />
                <Field label="آدرس" defaultValue="تهران، ولیعصر، بالاتر از ونک" className="sm:col-span-2" />
              </div>
            </div>
          )}

          {tab === "hours" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800">ساعات کاری هفتگی</h2>
              {WEEK_DAYS.map((day) => (
                <div key={day} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-xs">
                  <span className="w-20 text-gray-700">{day}</span>
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue="09:00" className="rounded-lg border border-gray-200 px-2 py-1.5 outline-none" />
                    <span className="text-gray-400">تا</span>
                    <input type="time" defaultValue="20:00" className="rounded-lg border border-gray-200 px-2 py-1.5 outline-none" />
                  </div>
                  <label className="flex items-center gap-1.5 text-gray-500">
                    <input type="checkbox" defaultChecked={day !== "جمعه"} className="h-3.5 w-3.5 rounded text-primary" /> باز
                  </label>
                </div>
              ))}
            </div>
          )}

          {tab === "forms" && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800">فرم‌ها و رضایت‌نامه‌ها</h2>
              <p className="text-xs text-gray-400">
                فرم پذیرش و رضایت‌نامه‌های هر خدمت از اینجا مدیریت می‌شوند.
              </p>
              <button className="rounded-xl bg-primary-light/15 px-4 py-2 text-xs font-medium text-primary-dark">
                رفتن به فرم‌ساز پذیرش و رضایت‌نامه‌ها →
              </button>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-800">تنظیمات اطلاع‌رسانی</h2>
              <ToggleRow title="اطلاع‌رسانی ایمیلی" desc="ایمیل برای رویدادهای مهم کلینیک" checked={emailNotif} onChange={setEmailNotif} />
              <ToggleRow title="اطلاع‌رسانی پیامکی" desc="پیامک برای هشدارهای فوری" checked={smsNotif} onChange={setSmsNotif} />
            </div>
          )}

          <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
              <Save className="h-4 w-4" /> ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, dir, className = "" }: { label: string; defaultValue?: string; dir?: "ltr" | "rtl"; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs text-gray-600">{label}</label>
      <input type="text" defaultValue={defaultValue} dir={dir} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none" />
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange }: { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
      <div>
        <div className="text-sm font-medium text-gray-800">{title}</div>
        <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
      </div>
      <button onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "right-0.5" : "right-5"}`} />
      </button>
    </div>
  );
}
