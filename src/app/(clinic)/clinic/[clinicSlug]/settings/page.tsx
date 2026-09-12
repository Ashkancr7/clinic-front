"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings2, ToggleLeft, FileText, Save } from "lucide-react";

import { getClinicSettings, updateClinicSettings, type ClinicSettings } from "@/lib/api/clinic-settings";
import { queryKeys } from "@/lib/query/keys";

const TABS = [
  { key: "general", label: "عمومی", icon: Settings2 },
  { key: "features", label: "ویژگی‌ها", icon: ToggleLeft },
  { key: "forms", label: "فرم‌ها و رضایت‌نامه‌ها", icon: FileText },
];

const FEATURE_LABELS: { key: keyof ClinicSettings; title: string; desc: string }[] = [
  { key: "patientPortalEnabled", title: "پنل بیمار", desc: "دسترسی بیماران به پنل شخصی خودشان" },
  { key: "intakeLinkEnabled", title: "لینک فرم پذیرش", desc: "امکان ارسال لینک فرم پذیرش آنلاین به بیمار" },
  { key: "qrEnabled", title: "کد QR ورودی", desc: "نمایش کد QR برای پذیرش سریع در کلینیک" },
  { key: "smsEnabled", title: "پیامک", desc: "ارسال پیامک‌های خودکار و دستی" },
  { key: "videoEnabled", title: "تماس تصویری", desc: "امکان برگزاری ویزیت آنلاین" },
  { key: "chatEnabled", title: "چت داخلی", desc: "گفتگوی متنی بین کلینیک و بیمار" },
];

export default function ClinicSettingsPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [tab, setTab] = useState("general");
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: queryKeys.clinicSettings.detail(clinicSlug),
    queryFn: () => getClinicSettings(clinicSlug),
    enabled: !!clinicSlug,
  });

  const [form, setForm] = useState<ClinicSettings | null>(null);
  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateClinicSettings>[1]) => updateClinicSettings(clinicSlug, payload),
    onSuccess: (data) => {
      setForm(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.clinicSettings.detail(clinicSlug) });
    },
  });

  function handleSave() {
    if (!form) return;
    updateMutation.mutate({
      timezone: form.timezone,
      calendar_type: form.calendarType,
      default_language: form.defaultLanguage,
      intake_link_enabled: form.intakeLinkEnabled,
      qr_enabled: form.qrEnabled,
      patient_portal_enabled: form.patientPortalEnabled,
      sms_enabled: form.smsEnabled,
      video_enabled: form.videoEnabled,
      chat_enabled: form.chatEnabled,
    });
  }

  if (isLoading) return <div className="py-20 text-center text-sm text-gray-400">در حال بارگذاری...</div>;
  if (error || !form) return <div className="py-20 text-center text-sm text-danger">خطا در دریافت تنظیمات</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">تنظیمات کلینیک</h1>
        <p className="mt-1 text-sm text-gray-400">منطقه‌ی زمانی، تقویم، زبان و ویژگی‌های فعال کلینیک</p>
      </div>

      {updateMutation.isSuccess && (
        <p className="rounded-lg bg-primary-light/15 px-3 py-2 text-xs font-medium text-primary-dark">تنظیمات ذخیره شد.</p>
      )}
      {updateMutation.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
          {updateMutation.error instanceof Error ? updateMutation.error.message : "ذخیره ناموفق بود"}
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        <div className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                tab === t.key ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <t.icon className="h-4 w-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-6">
          {tab === "general" && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold text-gray-800">تنظیمات عمومی</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-gray-600">منطقه‌ی زمانی (Timezone)</label>
                  <input
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    dir="ltr"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-primary"
                    placeholder="Asia/Tehran"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-gray-600">نوع تقویم</label>
                  <select
                    value={form.calendarType}
                    onChange={(e) => setForm({ ...form, calendarType: e.target.value as ClinicSettings["calendarType"] })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none"
                  >
                    <option value="jalali">شمسی</option>
                    <option value="gregorian">میلادی</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-gray-600">زبان پیش‌فرض</label>
                  <select
                    value={form.defaultLanguage}
                    onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none"
                  >
                    <option value="fa">فارسی</option>
                    <option value="en">انگلیسی</option>
                  </select>
                </div>
              </div>

              <p className="rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                نام، تلفن، آدرس و لوگوی کلینیک از این صفحه قابل ویرایش نیست — این اطلاعات فقط توسط سوپرادمین سامانه قابل تغییر است.
              </p>
            </div>
          )}

          {tab === "features" && (
            <div className="space-y-3">
              <h2 className="mb-2 text-sm font-bold text-gray-800">ویژگی‌های فعال</h2>
              {FEATURE_LABELS.map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{f.title}</div>
                    <p className="mt-0.5 text-xs text-gray-400">{f.desc}</p>
                  </div>
                  <button
                    onClick={() => setForm({ ...form, [f.key]: !form[f.key] })}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${form[f.key] ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${form[f.key] ? "right-0.5" : "right-5"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "forms" && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-800">فرم‌ها و رضایت‌نامه‌ها</h2>
              <p className="text-xs leading-6 text-gray-400">فرم پذیرش و رضایت‌نامه‌های هر خدمت از اینجا مدیریت می‌شوند.</p>
              <Link
                href={`/clinic/${clinicSlug}/settings/forms`}
                className="inline-block rounded-xl bg-primary-light/15 px-4 py-2 text-xs font-medium text-primary-dark hover:bg-primary-light/25"
              >
                رفتن به فرم‌ساز پذیرش و رضایت‌نامه‌ها ←
              </Link>
            </div>
          )}

          {tab !== "forms" && (
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}