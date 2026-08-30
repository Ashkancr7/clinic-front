
"use client";

import { useState, type ReactNode } from "react";

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
} from "lucide-react";

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

const CONSENT_TEMPLATES = [
  {
    name: "رضایت‌نامه عکاسی و استفاده از تصاویر",
    version: "نسخه ۲",
  },
  {
    name: "رضایت‌نامه تزریقات زیبایی",
    version: "نسخه ۳",
    active: true,
  },
  {
    name: "رضایت‌نامه لیزر و دستگاه‌های انرژی‌محور",
    version: "نسخه ۱",
  },
  {
    name: "رضایت‌نامه جراحی‌های زیبایی",
    version: "نسخه ۱",
  },
];

const CONSENT_VERSIONS = [
  {
    number: "۳",
    version: "بروزرسانی بند عوارض و مراقبت‌ها",
    createdBy: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۳/۲۱",
    status: "فعال",
    statusTone:
      "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light",
  },
  {
    number: "۲",
    version: "افزودن توضیحات دقیق‌تر",
    createdBy: "دکتر سارا محمدی",
    date: "۱۴۰۳/۰۱/۱۵",
    status: "غیرفعال",
    statusTone:
      "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
  {
    number: "۱",
    version: "نسخه اولیه",
    createdBy: "دکتر سارا محمدی",
    date: "۱۴۰۲/۱۱/۰۲",
    status: "غیرفعال",
    statusTone:
      "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
];

const CONNECTED_SERVICES = [
  { name: "تزریق ژل", checked: true },
  { name: "بوتاکس", checked: true },
  { name: "مزوتراپی", checked: true },
  { name: "فیلر زیر چشم", checked: false },
];

export default function FormBuilderPage() {
  const [activeTab, setActiveTab] = useState<"intake" | "consents">(
    "intake",
  );

  const [fieldEnabled, setFieldEnabled] = useState(true);

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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Connected Services */}
          <div
            className="
              rounded-2xl border border-gray-100 bg-white p-4
              dark:border-gray-800 dark:bg-gray-900
            "
          >
            <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-100">
              اتصال به خدمات
            </h3>

            <p className="mb-2 text-[10px] text-gray-400 dark:text-gray-500">
              خدماتی که این رضایت‌نامه در آن‌ها نمایش داده شود.
            </p>

            <div className="space-y-2 text-[11px]">
              {CONNECTED_SERVICES.map((service) => (
                <label
                  key={service.name}
                  className="flex items-center justify-between text-gray-600 dark:text-gray-300"
                >
                  {service.name}

                  <input
                    type="checkbox"
                    defaultChecked={service.checked}
                    className="h-3.5 w-3.5 rounded text-primary"
                  />
                </label>
              ))}
            </div>

            <button className="mt-3 text-[10px] text-primary-dark dark:text-primary-light">
              انتخاب همه
            </button>
          </div>

          {/* Versions */}
          <div
            className="
              rounded-2xl border border-gray-100 bg-white p-4
              dark:border-gray-800 dark:bg-gray-900
              lg:col-span-2
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                رضایت‌نامه تزریقات زیبایی
              </h3>

              <PenLine className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-[10px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
                    <th className="pb-2 font-medium">نسخه</th>
                    <th className="pb-2 font-medium">وضعیت</th>
                    <th className="pb-2 font-medium">تاریخ ایجاد</th>
                    <th className="pb-2 font-medium">
                      ایجاد شده توسط
                    </th>
                    <th className="pb-2 font-medium">
                      تغییرات متصل
                    </th>
                    <th className="pb-2 font-medium">عملیات</th>
                  </tr>
                </thead>

                <tbody>
                  {CONSENT_VERSIONS.map((version) => (
                    <tr
                      key={version.number}
                      className="border-b border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2 text-gray-700 dark:text-gray-200">
                        {version.number}
                      </td>

                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 ${version.statusTone}`}
                        >
                          {version.status}
                        </span>
                      </td>

                      <td className="py-2 text-gray-500 dark:text-gray-400">
                        {version.date}
                      </td>

                      <td className="py-2 text-gray-500 dark:text-gray-400">
                        {version.createdBy}
                      </td>

                      <td className="py-2 text-gray-500 dark:text-gray-400">
                        {version.version}
                      </td>

                      <td className="py-2">
                        <div className="flex gap-1">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                            <Copy className="h-3 w-3" />
                          </button>

                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                className="
                  flex items-center gap-1 rounded-lg
                  bg-primary px-3 py-1.5
                  text-[10px] font-medium text-white
                  hover:bg-primary-dark
                "
              >
                <Eye className="h-3 w-3" />
                پیش‌نمایش قالب
              </button>

              <button className="text-[10px] text-primary-dark dark:text-primary-light">
                مشاهده همه نسخه‌ها
              </button>
            </div>
          </div>

          {/* Templates */}
          <div
            className="
              rounded-2xl border border-gray-100 bg-white p-4
              dark:border-gray-800 dark:bg-gray-900
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                قالب‌های رضایت‌نامه
              </h3>

              <button
                className="
                  flex items-center gap-1 rounded-lg
                  bg-primary-light/15 px-2 py-1
                  text-[10px] text-primary-dark
                  dark:bg-primary/10 dark:text-primary-light
                "
              >
                <Plus className="h-3 w-3" />
                قالب جدید
              </button>
            </div>

            <div className="space-y-1.5">
              {CONSENT_TEMPLATES.map((template) => (
                <div
                  key={template.name}
                  className={`
                    rounded-xl border p-2.5 transition
                    ${
                      template.active
                        ? "border-primary bg-primary-light/5 dark:bg-primary/10"
                        : "border-gray-100 dark:border-gray-800"
                    }
                  `}
                >
                  <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                    {template.name}
                  </div>

                  <div className="text-[9px] text-gray-400 dark:text-gray-500">
                    {template.version}
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-3 flex items-center gap-1 text-[10px] text-primary-dark dark:text-primary-light">
              <SlidersHorizontal className="h-3 w-3" />
              مشاهده همه قالب‌ها
            </button>
          </div>
        </div>
      )}
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

