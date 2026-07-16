"use client";

import { useState, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import SignatureField from "@/components/forms/SignatureField";

import {
  Leaf,
  ArrowRight,
  LogOut,
  ArrowLeft,
  Save,
  Pencil,
  UserRound,
  Phone,
  Calendar,
  ChevronDown,
  MapPin,
  Lock,
  Settings2,
  Clock3,
  Headset,
  HeartPulse,
  AlertCircle,
  Pill,
  ShieldAlert,
  Scissors,
  Droplet,
  StickyNote,
  FileText,
  Eraser,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";


const STEPS = [
  { number: 1, label: "اطلاعات شخصی" },
  { number: 2, label: "رضایت‌نامه" },
  { number: 3, label: "سوابق پزشکی" },
  { number: 4, label: "بررسی و تکمیل" },
];

const SIDEBAR_INFO = [
  { icon: Lock, title: "اطلاعات محرمانه", desc: "کلیه اطلاعات شما محفوظ و رمزگذاری شده است." },
  { icon: Settings2, title: "فرآیند هوشمند", desc: "فرم بر اساس پاسخ‌های شما شخصی‌سازی می‌شود." },
  { icon: Save, title: "دسترسی آسان", desc: "در هر زمان می‌توانید ادامه دهید و ذخیره کنید." },
  { icon: Clock3, title: "پشتیبانی", desc: "در صورت سوال، تیم ما در کنار شما هستند." },
];

const MEDICAL_QUESTIONS = [
  {
    icon: HeartPulse,
    title: "سوابق پزشکی",
    question: "آیا بیماری زمینه‌ای دارید؟",
    placeholder: "در صورت بله، توضیح دهید",
  },
  {
    icon: AlertCircle,
    title: "بیماری خاص",
    question: "آیا به بیماری خاص مبتلا هستید؟",
    placeholder: "در صورت بله، توضیح دهید",
  },
  {
    icon: Pill,
    title: "داروهای مصرفی",
    question: "آیا دارویی به‌طور منظم مصرف می‌کنید؟",
    placeholder: "نام داروها را وارد کنید",
  },
  {
    icon: ShieldAlert,
    title: "حساسیت‌ها",
    question: "آیا به دارو، غذا یا ماده خاصی حساسیت دارید؟",
    placeholder: "در صورت بله، توضیح دهید",
  },
  {
    icon: Scissors,
    title: "سابقه جراحی",
    question: "آیا سابقه جراحی دارید؟",
    placeholder: "در صورت بله، نوع و تاریخ جراحی را وارد کنید",
  },
  {
    icon: Droplet,
    title: "سوابق زیبایی / تزریق",
    question: "آیا تاکنون عمل، تزریق یا درمان‌های زیبایی انجام داده‌اید؟",
    placeholder: "توضیح نوع درمان و زمان آن",
  },
];

export default function PatientIntakePage() {
  const [agreed, setAgreed] = useState(false);
  const pickerRef = useRef<any>(null);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50  text-sm">
      {/* هدر بالای صفحه */}
      <header className="sticky top-0 z-50 flex flex-col items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 shadow-sm md:flex-row md:justify-between md:px-8">
        {/* لوگو */}
        <div className="flex items-center gap-2 text-center md:text-right">
          <Leaf className="h-7 w-7 text-emerald-600" />

          <div className="leading-tight">
            <div className="text-base font-bold text-gray-900">
              Beauty Clinic CRM
            </div>

            <div className="text-[11px] text-gray-400">
              پلتفرم مدیریت کلینیک زیبایی
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex w-full justify-center gap-2 md:w-auto md:justify-end">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            <LogOut className="h-4 w-4" />
            خروج
          </button>

          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            بازگشت
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row">
        {/* ستون فرم اصلی */}
        <main className="w-full  border-2 rounded-lg  lg:flex-1 space-y-6 p-4">
          {/* استپر */}
          <div className="overflow-x-auto rounded-2xl border-2 border-gray-100 bg-white p-4">
            <div className="flex min-w-max items-center justify-center gap-3 lg:justify-start">
              {STEPS.map((step, i) => (
                <div key={step.number} className="flex items-center gap-3">
                  {i > 0 && <div className="h-px w-8 bg-gray-200" />}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step.number === 1
                        ? "bg-primary text-white"
                        : "border border-gray-200 text-gray-400"
                        }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`whitespace-nowrap text-[11px] ${step.number === 1 ? "font-medium text-primary-dark" : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* عنوان صفحه */}
          <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 md:p-6">
            <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900 md:text-xl">
              <Pencil className="h-4 w-4 text-primary" />
              فرم پذیرش و ثبت اطلاعات اولیه بیمار
            </h1>
            <p className="mt-2 text-xs text-gray-400 md:text-sm">
              لطفاً اطلاعات خود را با دقت وارد کنید. کلیه اطلاعات محرمانه بوده و صرفاً جهت ارائه
              خدمات بهتر استفاده می‌شود.
            </p>
          </div>

          {/* اطلاعات شخصی */}
          <FormSection icon={UserRound} title="اطلاعات شخصی">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="نام" required placeholder="نام خود را وارد کنید" />
              <Field label="نام خانوادگی" required placeholder="نام خانوادگی خود را وارد کنید" />
              <Field label="کد ملی" required placeholder="کد ملی ۱۰ رقمی خود را وارد کنید" />
                
              <Field label="تاریخ تولد" required  >
                <DatePicker
                  ref={pickerRef}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  editable={false}
                  render={(value, openCalendar) => (
                    <div className="flex items-center justify-between w-full">
                      <input
                        readOnly
                        value={value}
                        onClick={openCalendar}
                        placeholder="انتخاب تاریخ"
                        className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300 cursor-pointer"
                      />

                      {/* <Calendar
                        onClick={openCalendar}
                        className="mr-2 h-4 w-4 shrink-0 text-gray-300 cursor-pointer"
                      /> */}
                    </div>
                  )}
                />
              </Field>

              <Field
                label="جنسیت"
                required
                select
                placeholder="انتخاب کنید"
                options={[
                  { value: "male", label: "مرد" },
                  { value: "female", label: "زن" },
                ]}
              />
              <Field
                label="وضعیت تأهل"
                select
                placeholder="انتخاب کنید"
                options={[
                  { value: "single", label: "مجرد" },
                  { value: "married", label: "متأهل" },
                  { value: "divorced", label: "مطلقه" },
                  { value: "widowed", label: "بیوه" },
                ]}
              />
              <Field
                label="شغل"
                select
                placeholder="انتخاب کنید"
                options={[
                  { value: "doctor", label: "پزشک" },
                  { value: "employee", label: "کارمند" },
                  { value: "teacher", label: "معلم" },
                  { value: "student", label: "دانشجو" },
                  { value: "freelancer", label: "آزاد" },
                  { value: "other", label: "سایر" },
                ]}
              />
              <Field label="اشخاص معرفی‌کننده" placeholder="در صورت وجود" />
            </div>
          </FormSection>

          {/* اطلاعات تماس */}
          <FormSection icon={Phone} title="اطلاعات تماس">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="شماره موبایل" required placeholder="0912 345 6789" />
              <Field label="تلفن ثابت" placeholder="مثال: 021-12345678" />
              <Field label="ایمیل" placeholder="example@email.com" />
              <Field
                label="آدرس"
                placeholder="آدرس دقیق محل سکونت خود را وارد کنید"
                endIcon={MapPin}
                className="sm:col-span-2 lg:col-span-1"
              />
            </div>
          </FormSection>

          {/* سوالات پزشکی */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEDICAL_QUESTIONS.map((q) => (
              <MedicalQuestionCard key={q.title} {...q} />
            ))}

            {/* سبک زندگی */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary-dark" />
                <span className="text-sm font-semibold text-primary">سبک زندگی</span>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                آیا سیگار یا دخانیات مصرف می‌کنید؟
              </p>
              <Field label="مصرف الکل" select placeholder="انتخاب کنید" 
                options={[
                  { value: "yes", label: "بله" },
                  { value: "no", label: "نه" },
                  
                ]}
              />
            </div>

            {/* یادداشت‌های تکمیلی */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:col-span-2 lg:col-span-1">
              <div className="mb-2 flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary-dark" />
                <span className="text-sm font-semibold text-primary">یادداشت‌های تکمیلی</span>
              </div>
              <p className="mb-3 text-xs text-gray-500">
                هر نکته‌ای که فکر می‌کنید لازم است بدانیم.
              </p>
              <textarea
                placeholder="توضیحات خود را وارد کنید"
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* امنیت / امضا / رضایت‌نامه */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            <div className="rounded-2xl border-2 border-gray-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-dark" />
                <span className="text-sm font-semibold text-primary">رضایت‌نامه و تعهد</span>
              </div>
              <p className="mb-3 text-[11px] leading-relaxed text-gray-400">
                اینجانب با آگاهی کامل اعلام می‌کنم که اطلاعات ارائه‌شده صحیح و به‌روز است. با
                علم به ماهیت خدمات به‌عمل رفته، بیمار، درمانی و مراقبتی، رضایت خود را جهت انجام
                خدمات در کلینیک اعلام می‌دارم. همچنین می‌پذیرم که کلیه شرایط‌وضوابط، مراقبت‌های
                خانگی که در درمان به من توضیح داده شده و بعد از درمان برایم توضیح داده خواهد شد را
                جهت سوالات خود می‌پذیرم.
              </p>
              <label className="flex items-start gap-2 text-[11px] text-gray-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-primary"
                />
                من ضمن مطالعه کامل، رضایت و تعهد خود را اعلام می‌کنم. *
              </label>
            </div>
            <SignatureField
              onChange={(signature) => {
                console.log(signature);
              }}
            />

            <div className="rounded-2xl border-2 border-gray-100 bg-white p-5">
              <div className="mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary-dark" />
                <span className="text-sm font-semibold text-primary">اطلاعات شما امن است</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                کلیه اطلاعات شما مطابق با استانداردهای امنیتی رمزگذاری و محافظت می‌شود.
              </p>
            </div>

          </div>

          {/* اکشن‌ها */}
          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-dark">
              ثبت و ادامه <ArrowLeft className="h-4 w-4" />
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:bg-gray-50">
              <Save className="h-4 w-4" /> ذخیره موقت
            </button>

          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
          </p>
        </main>

        {/* ستون کناری - مخفی در موبایل */}
        <aside className="hidden w-full border-2 rounded-lg lg:block lg:w-80 shrink-0 space-y-4 p-4 bg-gradient-to-bl from-primary-light/15 via-primary-light/10 to-white/50">
          {/* تصویر */}
          <div className="rounded-2xl border-2 border-gray-100 p-6 text-center">
            
            <Image
              src="/image/rigester.png"
              alt="نمای دشبورد و پنل مدیریت کلینیک"
              width={800}
              height={800}
              unoptimized
              className="w-full max-w-lg object-contain rounded-lg "
            />
            <div className="font-semibold text-gray-800">تکمیل سریع و امن</div>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              با تکمیل این فرم، روند ارائه خدمات برای شما سریع‌تر، آسان‌تر و دقیق‌تر خواهد بود.
            </p>
          </div>

          {/* لیست اطلاعات */}
          <div className="space-y-2">
            {SIDEBAR_INFO.map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border-2 border-gray-100 bg-white p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light/20">
                  <item.icon className="h-4 w-4 text-primary-dark" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700">{item.title}</div>
                  <div className="text-[11px] text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* راهنمایی */}
          <div className="rounded-2xl border-2 border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Headset className="h-4 w-4 text-primary-dark" />
              <span className="text-xs font-semibold text-gray-700">نیاز به راهنمایی دارید؟</span>
            </div>
            <p className="mb-2 text-[11px] text-gray-400">
              پشتیبانی ما آماده پاسخگویی به سوالات شماست.
            </p>
            <a
              href="tel:02112345678"
              className="block rounded-lg bg-gray-50 py-2 text-center text-xs font-medium text-gray-600"
            >
              021-12345678
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- کامپوننت‌های کمکی محلی ---------- */

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-dark" />
        <h2 className="text-sm font-bold text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface Option {
  value: string;
  label: string;
}

function Field({
  label,
  required,
  placeholder,
  select,
  options = [],
  endIcon: EndIcon,
  bare,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  select?: boolean;
  options?: Option[];
  endIcon?: typeof Calendar;
  bare?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const inputClasses =
    "w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300";

  return (
    <div className={className}>
      {!bare && (
        <label className="mb-1.5 block text-xs text-black">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="flex items-center rounded-lg border border-gray-200 px-3 py-2.5">
        {children ? (
          children
        ) : select ? (
          <select className={inputClasses} defaultValue="">
            <option value="" disabled>
              {placeholder}
            </option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input
              type="text"
              placeholder={placeholder}
              className={inputClasses}
            />
            {EndIcon && (
              <EndIcon className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            )}
          </>
        )}
      </div>
    </div>
  );
}



function MedicalQuestionCard({
  icon: Icon,
  title,
  question,
  placeholder,
}: {
  icon: typeof HeartPulse;
  title: string;
  question: string;
  placeholder: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-dark" />
        <span className="text-sm font-semibold text-primary">{title}</span>
      </div>
      <p className="mb-2 text-xs text-gray-500">{question}</p>
      <div className="mb-2 flex items-center gap-4 text-xs text-gray-600">
        <label className="flex items-center gap-1.5">
          <input type="radio" name={title} className="h-3.5 w-3.5 text-primary" /> بله
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" name={title} className="h-3.5 w-3.5 text-primary" defaultChecked /> خیر
        </label>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none placeholder:text-gray-300"
      />
    </div>
  );
}
