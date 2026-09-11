"use client";

import { use, useState, type ReactNode } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Save,
  RefreshCcw,
  CheckCircle2,
  UserRound,
  HeartPulse,
  Sparkles,
  PenLine,
  Copy,
  Trash2,
  Plus,
  Type,
  AlignLeft,
  Hash,
  Calendar,
  Phone,
  Mail,
  CheckSquare,
  ListChecks,
  ChevronDown,
  Circle,
  FileDigit,
  Upload,
  Fingerprint,
  Palette,
  Image as ImageIcon,
  Star,
  SlidersHorizontal,
  FileType,
  Minus,
  Info,
  GripVertical,
  Eye,
  X,
  Loader2,
} from "lucide-react";

import {
  getConsentTemplates,
  getConsentVersions,
  createConsentTemplate,
  updateConsentTemplate,
  createConsentVersion,
  type ConsentTemplate,
} from "@/lib/api/consents";

import { getServices } from "@/lib/api/services";
import { queryKeys } from "@/lib/query/keys";

const FIELD_LIBRARY = {
  "اطلاعات پایه": [
    { icon: Type, label: "متن کوتاه" },
    { icon: AlignLeft, label: "متن بلند" },
    { icon: Hash, label: "عدد" },
    { icon: Calendar, label: "تاریخ" },
    { icon: Phone, label: "تلفن" },
    { icon: Mail, label: "ایمیل" },
    { icon: CheckSquare, label: "انتخابی" },
    { icon: ListChecks, label: "چندانتخابی" },
    { icon: ChevronDown, label: "کشویی" },
    { icon: Circle, label: "بله / خیر" },
    { icon: FileDigit, label: "کد ملی" },
    { icon: Upload, label: "بارگذاری فایل" },
  ],

  "اطلاعات پیشرفته": [
    { icon: Fingerprint, label: "امضای دیجیتال" },
    { icon: Palette, label: "رنگ پوست" },
    { icon: ImageIcon, label: "تصویر" },
    { icon: Star, label: "امتیاز" },
    { icon: SlidersHorizontal, label: "اسلایدر (مقیاس)" },
    { icon: FileType, label: "محاسبه خودکار" },
  ],

  "اجزای کمکی": [
    { icon: Type, label: "عنوان بخش" },
    { icon: Minus, label: "خط جداکننده" },
    { icon: Info, label: "توضیح متنی" },
  ],
};

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  const [activeTab, setActiveTab] = useState<"intake" | "consents">(
    "intake",
  );

  const [fieldEnabled, setFieldEnabled] = useState(true);

  const queryClient = useQueryClient();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showEditTemplateInfo, setShowEditTemplateInfo] = useState(false);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [consentsError, setConsentsError] = useState<string | null>(null);

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: queryKeys.consents.templates(clinicSlug),
    queryFn: () => getConsentTemplates(clinicSlug),
    enabled: !!clinicSlug && activeTab === "consents",
  });

  const selectedTemplate: ConsentTemplate | null =
    templates.find((t) => t.id === selectedTemplateId) ?? templates[0] ?? null;

  const { data: versions = [], isLoading: versionsLoading } = useQuery({
    queryKey: queryKeys.consents.versions(clinicSlug, selectedTemplate?.id ?? ""),
    queryFn: () => getConsentVersions(clinicSlug, selectedTemplate!.id),
    enabled: !!clinicSlug && !!selectedTemplate,
  });

  function invalidateTemplates() {
    queryClient.invalidateQueries({ queryKey: queryKeys.consents.templates(clinicSlug) });
  }

  function invalidateVersions() {
    if (selectedTemplate) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consents.versions(clinicSlug, selectedTemplate.id),
      });
    }
  }

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            فرم‌ساز پذیرش و رضایت‌نامه‌ها
          </h1>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            تنظیمات ‹ فرم‌ساز پذیرش و رضایت‌نامه‌ها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="
              flex items-center gap-1.5 rounded-xl
              border border-gray-200 bg-white px-4 py-2
              text-xs text-gray-600 transition
              hover:bg-gray-50
              dark:border-gray-700 dark:bg-gray-900
              dark:text-gray-300 dark:hover:bg-gray-800
            "
          >
            <Eye className="h-3.5 w-3.5" />
            پیش‌نمایش فرم
          </button>

          <button
            className="
              flex items-center gap-2 rounded-xl
              bg-primary px-5 py-2.5 text-xs font-medium text-white
              transition hover:bg-primary-dark
            "
          >
            <Save className="h-3.5 w-3.5" />
            ذخیره و انتشار
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="
          flex flex-wrap items-center justify-between gap-2
          rounded-2xl border border-gray-100 bg-white p-3
          dark:border-gray-800 dark:bg-gray-900
        "
      >
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setActiveTab("intake")}
            className={`
              border-b-2 pb-2 transition
              ${
                activeTab === "intake"
                  ? "border-primary font-medium text-primary-dark dark:text-primary-light"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }
            `}
          >
            فرم پذیرش
          </button>

          <button
            onClick={() => setActiveTab("consents")}
            className={`
              border-b-2 pb-2 transition
              ${
                activeTab === "consents"
                  ? "border-primary font-medium text-primary-dark dark:text-primary-light"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }
            `}
          >
            رضایت‌نامه‌ها
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
          <RefreshCcw className="h-3.5 w-3.5" />
          آخرین ذخیره: ۱۰:۳۵

          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-primary-dark dark:text-primary-light" />

          ذخیره خودکار فعال
        </div>
      </div>

      {/* Intake Builder */}
      {activeTab === "intake" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Field Settings */}
          <div
            className="
              rounded-2xl border border-gray-100 bg-white p-4
              dark:border-gray-800 dark:bg-gray-900
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                تنظیمات فیلد
              </h3>

              <GripVertical className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
            </div>

            <div className="mb-3 text-[10px] text-gray-400 dark:text-gray-500">
              نام و نام‌خانوادگی (متن کوتاه)
            </div>

            <div className="mb-3 flex gap-1 rounded-lg bg-gray-50 p-1 text-[10px] dark:bg-gray-800">
              <button className="flex-1 rounded-md bg-white py-1.5 font-medium text-primary-dark shadow-sm dark:bg-gray-700 dark:text-primary-light">
                عمومی
              </button>

              <button className="flex-1 py-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                قوانین
              </button>

              <button className="flex-1 py-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                پیشرفته
              </button>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  اجباری
                </span>

                <button
                  onClick={() => setFieldEnabled((v) => !v)}
                  className={`
                    relative h-5 w-9 rounded-full transition
                    ${fieldEnabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 h-4 w-4 rounded-full
                      bg-white shadow transition-all
                      ${fieldEnabled ? "right-0.5" : "right-4"}
                    `}
                  />
                </button>
              </div>

              <TinyInput
                label="برچسب فیلد"
                value="نام و نام‌خانوادگی"
              />

              <TinyInput
                label="متن راهنما"
                value="مثال: علی رضایی"
              />

              <TinyInput label="متن فرض" value="—" />

              <TinySelect
                label="اعتبارسنجی"
                value="حداقل ۳ کاراکتر"
              />

              <TinyInput label="حداکثر کاراکتر" value="۷۰" />

              <TinySelect
                label="اتصال به خدمات"
                value="همه خدمات"
              />

              <TinySelect
                label="گروه‌بندی داده"
                value="اطلاعات پایه"
              />
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
              <div className="mb-2 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                قوانین نمایش (شرطی)
              </div>

              <p className="mb-2 text-[9px] text-gray-400 dark:text-gray-500">
                این فیلد را زمانی نمایش دهید که:
              </p>

              <div className="mb-2 flex items-center gap-1.5">
                <TinySelectInline value="جنسیت" />
                <TinySelectInline value="مساوی" />
                <TinySelectInline value="رد" />
              </div>

              <button className="flex items-center gap-1 text-[10px] text-primary-dark dark:text-primary-light">
                <Plus className="h-3 w-3" />
                افزودن شرط
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span
                className="text-[10px] text-gray-400 dark:text-gray-500"
                dir="ltr"
              >
                first_name_lh
              </span>

              <button className="flex items-center gap-1 text-[10px] text-danger hover:opacity-80">
                <Trash2 className="h-3 w-3" />
                حذف فیلد
              </button>
            </div>
          </div>

          {/* Form Canvas */}
          <div className="space-y-3 lg:col-span-2">
            <FormSectionCard
              icon={UserRound}
              title="اطلاعات شخصی"
            >
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                <MiniField label="نام" required />
                <MiniField label="نام خانوادگی" required />
                <MiniField label="کد ملی" required />
                <MiniField label="تاریخ تولد" required />
                <MiniField label="جنسیت" required select />
                <MiniField label="ایمیل" />
                <MiniField label="شماره موبایل" required />
              </div>
            </FormSectionCard>

            <FormSectionCard
              icon={HeartPulse}
              title="سابقه پزشکی"
            >
              <p className="mb-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                آیا به بیماری خاصی مبتلا هستید؟
              </p>

              <div className="flex items-center gap-3 text-[10px] text-gray-600 dark:text-gray-300">
                <label className="flex items-center gap-1">
                  <input type="radio" className="h-3 w-3" />
                  بله
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    className="h-3 w-3"
                    defaultChecked
                  />
                  خیر
                </label>

                <span className="text-gray-300 dark:text-gray-600">
                  در صورت «بله»، شرح دهید
                </span>
              </div>
            </FormSectionCard>

            <FormSectionCard
              icon={Sparkles}
              title="سابقه زیبایی و درمانی"
            >
              <p className="mb-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                آیا تاکنون عمل زیبایی انجام داده‌اید؟
              </p>

              <div className="flex items-center gap-3 text-[10px] text-gray-600 dark:text-gray-300">
                <label className="flex items-center gap-1">
                  <input type="radio" className="h-3 w-3" />
                  بله
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    className="h-3 w-3"
                    defaultChecked
                  />
                  خیر
                </label>

                <span className="text-gray-300 dark:text-gray-600">
                  تاریخ انجام / نوع خدمات انجام‌شده
                </span>
              </div>
            </FormSectionCard>

            <FormSectionCard
              icon={PenLine}
              title="امضا و تایید نهایی"
            >
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="
                    rounded-lg border border-dashed
                    border-gray-200 bg-gray-50 p-3
                    text-center text-[9px] text-gray-400
                    dark:border-gray-700 dark:bg-gray-800
                    dark:text-gray-500
                  "
                >
                  امضای مراجعه‌کننده
                </div>

                <label className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                  <input type="checkbox" className="h-3 w-3" />
                  تایید اطلاعات
                </label>
              </div>
            </FormSectionCard>

            <button
              className="
                flex w-full items-center justify-center gap-1.5
                rounded-xl border border-dashed
                border-gray-200 py-3 text-xs text-gray-400
                transition hover:bg-gray-50
                dark:border-gray-700 dark:text-gray-500
                dark:hover:bg-gray-900
              "
            >
              <Plus className="h-4 w-4" />
              افزودن بخش جدید
            </button>
          </div>

          {/* Field Library */}
          <div
            className="
              rounded-2xl border border-gray-100 bg-white p-4
              dark:border-gray-800 dark:bg-gray-900
            "
          >
            <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-100">
              کتابخانه فیلدها
            </h3>

            <p className="mb-3 text-[10px] text-gray-400 dark:text-gray-500">
              فیلد مورد نظر را بکشید و در فرم رها کنید.
            </p>

            {Object.entries(FIELD_LIBRARY).map(
              ([group, fields]) => (
                <div key={group} className="mb-4">
                  <div className="mb-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {group}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {fields.map((field) => {
                      const Icon = field.icon;

                      return (
                        <button
                          key={field.label}
                          className="
                            flex flex-col items-center gap-1
                            rounded-lg border border-gray-100
                            p-2 text-center transition
                            hover:bg-gray-50
                            dark:border-gray-800
                            dark:hover:bg-gray-800
                          "
                        >
                          <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />

                          <span className="text-[8px] text-gray-500 dark:text-gray-400">
                            {field.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ),
            )}

            <div className="rounded-xl bg-primary-light/10 p-2.5 text-[9px] leading-relaxed text-gray-500 dark:bg-primary/10 dark:text-gray-400">
              نکته: برای ساخت شرطی بین فیلدها از قابلیت
              «قوانین نمایش» در پنل سمت راست استفاده کنید.
            </div>

            <button className="mt-2 text-[10px] text-primary-dark dark:text-primary-light">
              راهنمای فرم‌ساز
            </button>
          </div>
        </div>
      )}

      {/* Consents */}
      {activeTab === "consents" && (
        <div className="space-y-4">
          {consentsError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10 dark:text-red-300">
              {consentsError}
            </p>
          )}

          {templatesLoading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-xs text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
              در حال بارگذاری...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Template info */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-100">
                  اطلاعات قالب
                </h3>

                {!selectedTemplate ? (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    ابتدا یک قالب رضایت‌نامه بسازید.
                  </p>
                ) : (
                  <>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">خدمت مرتبط</div>
                    <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-200">
                      {selectedTemplate.serviceName ?? "بدون خدمت خاص (عمومی)"}
                    </div>

                    <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">وضعیت قالب</div>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${
                        selectedTemplate.status === "active"
                          ? "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {selectedTemplate.status === "active"
                        ? "فعال"
                        : selectedTemplate.status === "draft"
                          ? "پیش‌نویس"
                          : "غیرفعال"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowEditTemplateInfo(true)}
                      className="mt-3 flex items-center gap-1 text-[10px] text-primary-dark dark:text-primary-light"
                    >
                      <PenLine className="h-3 w-3" />
                      ویرایش عنوان / خدمت
                    </button>
                  </>
                )}
              </div>

              {/* Versions */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    {selectedTemplate ? selectedTemplate.title : "نسخه‌ها"}
                  </h3>
                </div>

                {!selectedTemplate ? (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">قالبی انتخاب نشده.</p>
                ) : versionsLoading ? (
                  <p className="py-6 text-center text-[11px] text-gray-400 dark:text-gray-500">
                    در حال بارگذاری...
                  </p>
                ) : versions.length === 0 ? (
                  <p className="py-6 text-center text-[11px] text-gray-400 dark:text-gray-500">
                    نسخه‌ای برای این قالب ثبت نشده.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-[10px]">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                          <th className="pb-2 font-medium">نسخه</th>
                          <th className="pb-2 font-medium">وضعیت</th>
                          <th className="pb-2 font-medium">متن</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...versions]
                          .sort((a, b) => b.versionNumber - a.versionNumber)
                          .map((v) => (
                            <tr key={v.id} className="border-b border-gray-50 dark:border-gray-800">
                              <td className="py-2 text-gray-700 dark:text-gray-200">
                                {v.versionNumber.toLocaleString("fa-IR")}
                              </td>
                              <td className="py-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 ${
                                    v.status === "active"
                                      ? "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  {v.status === "active" ? "فعال" : v.status === "draft" ? "پیش‌نویس" : "بایگانی"}
                                </span>
                              </td>
                              <td className="max-w-[220px] truncate py-2 text-gray-500 dark:text-gray-400">
                                {v.content}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    disabled={!selectedTemplate}
                    onClick={() => setShowNewVersion(true)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                    نسخه جدید
                  </button>
                </div>
              </div>

              {/* Templates list */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    قالب‌های رضایت‌نامه
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowCreateTemplate(true)}
                    className="flex items-center gap-1 rounded-lg bg-primary-light/15 px-2 py-1 text-[10px] text-primary-dark dark:bg-primary/10 dark:text-primary-light"
                  >
                    <Plus className="h-3 w-3" />
                    قالب جدید
                  </button>
                </div>

                {templates.length === 0 ? (
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">قالبی ثبت نشده.</p>
                ) : (
                  <div className="space-y-1.5">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(t.id)}
                        className={`w-full rounded-xl border p-2.5 text-right transition ${
                          selectedTemplate?.id === t.id
                            ? "border-primary bg-primary-light/5 dark:bg-primary/10"
                            : "border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                          {t.title}
                        </div>
                        <div className="text-[9px] text-gray-400 dark:text-gray-500">
                          {t.serviceName ?? "عمومی"} ·{" "}
                          {t.status === "active" ? "فعال" : t.status === "draft" ? "پیش‌نویس" : "غیرفعال"}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showCreateTemplate && (
        <CreateTemplateModal
          clinicSlug={clinicSlug}
          onClose={() => setShowCreateTemplate(false)}
          onCreated={(templateId) => {
            setShowCreateTemplate(false);
            setSelectedTemplateId(templateId);
            setConsentsError(null);
            invalidateTemplates();
          }}
        />
      )}

      {showEditTemplateInfo && selectedTemplate && (
        <EditTemplateInfoModal
          clinicSlug={clinicSlug}
          template={selectedTemplate}
          onClose={() => setShowEditTemplateInfo(false)}
          onSaved={() => {
            setShowEditTemplateInfo(false);
            setConsentsError(null);
            invalidateTemplates();
          }}
        />
      )}

      {showNewVersion && selectedTemplate && (
        <CreateVersionModal
          clinicSlug={clinicSlug}
          template={selectedTemplate}
          onClose={() => setShowNewVersion(false)}
          onSaved={() => {
            setShowNewVersion(false);
            setConsentsError(null);
            invalidateVersions();
            invalidateTemplates();
          }}
        />
      )}
    </div>
  );
}

function CreateTemplateModal({
  clinicSlug,
  onClose,
  onCreated,
}: {
  clinicSlug: string;
  onClose: () => void;
  onCreated: (templateId: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [content, setContent] = useState("");
  const [activate, setActivate] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["services", clinicSlug, "for-consent-template"],
    queryFn: () => getServices(clinicSlug),
    enabled: !!clinicSlug,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!title.trim()) throw new Error("عنوان قالب الزامی است.");
      if (!content.trim()) throw new Error("متن رضایت‌نامه الزامی است.");
      return createConsentTemplate(clinicSlug, {
        title: title.trim(),
        service_id: serviceId || undefined,
        content: content.trim(),
        activate,
      });
    },
    onSuccess: (template) => onCreated(template.id),
    onError: (e) => setFormError(e instanceof Error ? e.message : "ایجاد قالب ناموفق بود"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px] dark:bg-black/60">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#18201e]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">قالب رضایت‌نامه جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10 dark:text-red-300">
            {formError}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">عنوان</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: رضایت‌نامه تزریقات زیبایی"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">
              خدمت مرتبط (اختیاری)
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
            >
              <option value="">عمومی (بدون خدمت خاص)</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">
              متن رضایت‌نامه (نسخه اول)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={activate}
              onChange={(e) => setActivate(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
            />
            بلافاصله فعال شود
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "در حال ثبت..." : "ایجاد قالب"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTemplateInfoModal({
  clinicSlug,
  template,
  onClose,
  onSaved,
}: {
  clinicSlug: string;
  template: ConsentTemplate;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(template.title);
  const [serviceId, setServiceId] = useState(template.serviceId ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: services = [] } = useQuery({
    queryKey: ["services", clinicSlug, "for-consent-template"],
    queryFn: () => getServices(clinicSlug),
    enabled: !!clinicSlug,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (!title.trim()) throw new Error("عنوان قالب الزامی است.");
      return updateConsentTemplate(clinicSlug, template.id, {
        title: title.trim(),
        service_id: serviceId || null,
      });
    },
    onSuccess: () => onSaved(),
    onError: (e) => setFormError(e instanceof Error ? e.message : "ویرایش قالب ناموفق بود"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px] dark:bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#18201e]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">ویرایش قالب</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10 dark:text-red-300">
            {formError}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">عنوان</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">خدمت مرتبط</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
            >
              <option value="">عمومی (بدون خدمت خاص)</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateVersionModal({
  clinicSlug,
  template,
  onClose,
  onSaved,
}: {
  clinicSlug: string;
  template: ConsentTemplate;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [content, setContent] = useState("");
  const [activate, setActivate] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!content.trim()) throw new Error("متن نسخه‌ی جدید الزامی است.");
      return createConsentVersion(clinicSlug, template.id, { content: content.trim(), activate });
    },
    onSuccess: () => onSaved(),
    onError: (e) => setFormError(e instanceof Error ? e.message : "ایجاد نسخه‌ی جدید ناموفق بود"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px] dark:bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#18201e]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            نسخه‌ی جدید «{template.title}»
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10 dark:text-red-300">
            {formError}
          </p>
        )}

        <p className="mb-2 text-[10px] text-gray-400 dark:text-gray-500">
          نسخه‌های قبلی هرگز تغییر نمی‌کنند؛ این متن به‌عنوان نسخه‌ی جدید ثبت می‌شود.
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
        />

        <label className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={activate}
            onChange={(e) => setActivate(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-gray-300"
          />
          این نسخه فعال شود (نسخه‌ی فعال قبلی غیرفعال می‌شود)
        </label>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "در حال ثبت..." : "ثبت نسخه جدید"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl border border-gray-100 bg-white p-4
        dark:border-gray-800 dark:bg-gray-900
      "
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-100">
          <Icon className="h-3.5 w-3.5 text-primary-dark dark:text-primary-light" />
          {title}
        </span>

        <div className="flex items-center gap-1 text-gray-300 dark:text-gray-600">
          <Copy className="h-3.5 w-3.5" />
          <Trash2 className="h-3.5 w-3.5" />
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      </div>

      {children}
    </div>
  );
}

function MiniField({
  label,
  required,
  select,
}: {
  label: string;
  required?: boolean;
  select?: boolean;
}) {
  return (
    <div>
      <div className="mb-1">
        {label}{" "}
        {required && <span className="text-danger">*</span>}
      </div>

      <div
        className="
          flex items-center justify-between
          rounded-lg border border-gray-100
          px-2 py-1.5 text-gray-300
          dark:border-gray-800 dark:text-gray-600
        "
      >
        {select ? "انتخاب کنید" : "..."}

        {select && (
          <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </div>
  );
}

function TinyInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-gray-500 dark:text-gray-400">
        {label}
      </label>

      <input
        defaultValue={value}
        className="
          w-full rounded-lg border border-gray-200
          bg-white px-2.5 py-1.5 text-gray-700
          outline-none transition
          focus:border-primary focus:ring-1 focus:ring-primary/20
          dark:border-gray-700 dark:bg-gray-800
          dark:text-gray-200
          dark:focus:border-primary
        "
      />
    </div>
  );
}

function TinySelect({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-gray-500 dark:text-gray-400">
        {label}
      </label>

      <div
        className="
          flex items-center justify-between
          rounded-lg border border-gray-200
          bg-white px-2.5 py-1.5 text-gray-700
          dark:border-gray-700 dark:bg-gray-800
          dark:text-gray-200
        "
      >
        {value}

        <ChevronDown className="h-3 w-3 text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  );
}

function TinySelectInline({
  value,
}: {
  value: string;
}) {
  return (
    <div
      className="
        flex flex-1 items-center justify-between
        rounded-lg border border-gray-200
        bg-white px-2 py-1
        text-[10px] text-gray-600
        dark:border-gray-700 dark:bg-gray-800
        dark:text-gray-300
      "
    >
      {value}

      <ChevronDown className="h-3 w-3 text-gray-300 dark:text-gray-600" />
    </div>
  );
}