"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
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
  Check,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { number: 1, label: "اطلاعات شخصی" },
  { number: 2, label: "رضایت‌نامه" },
  { number: 3, label: "سوابق پزشکی" },
  { number: 4, label: "بررسی و تکمیل" },
];

const SIDEBAR_INFO = [
  {
    icon: Lock,
    title: "اطلاعات محرمانه",
    desc: "کلیه اطلاعات شما محفوظ و رمزگذاری شده است.",
  },
  {
    icon: Settings2,
    title: "فرآیند هوشمند",
    desc: "فرم بر اساس پاسخ‌های شما شخصی‌سازی می‌شود.",
  },
  {
    icon: Save,
    title: "دسترسی آسان",
    desc: "در هر زمان می‌توانید ادامه دهید و ذخیره کنید.",
  },
  {
    icon: Clock3,
    title: "پشتیبانی",
    desc: "در صورت سوال، تیم ما در کنار شما هستند.",
  },
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
    question:
      "آیا تاکنون عمل، تزریق یا درمان‌های زیبایی انجام داده‌اید؟",
    placeholder: "توضیح نوع درمان و زمان آن",
  },
];

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function PatientIntakePage() {
  const [agreed, setAgreed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const pickerRef = useRef<any>(null);

  const totalSteps = STEPS.length;

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, totalSteps));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goPrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground"
    >
      {/* ============================ HEADER ============================ */}

      <header className="sticky top-0 z-50 border-b border-border bg-card/95 px-4 py-3 shadow-sm backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
          {/* Logo */}

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>

            <div className="leading-tight">
              <div className="text-base font-bold text-foreground">
                Beauty Clinic CRM
              </div>

              <div className="mt-0.5 text-[11px] text-muted-foreground">
                پلتفرم مدیریت کلینیک زیبایی
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex w-full justify-center gap-2 md:w-auto">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              بازگشت
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================ CONTENT ============================ */}

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row">
        {/* ============================ MAIN ============================ */}

        <main className="min-w-0 flex-1 space-y-6">
          {/* ============================ STEPPER ============================ */}

          <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-max items-center justify-center gap-3 lg:justify-start">
              {STEPS.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isActive = step.number === currentStep;

                return (
                  <div
                    key={step.number}
                    className="flex items-center gap-3"
                  >
                    {index > 0 && (
                      <div
                        className={`h-px w-8 transition-colors ${
                          step.number <= currentStep
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) {
                          setCurrentStep(step.number);

                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isActive
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "border border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          step.number
                        )}
                      </div>

                      <span
                        className={`whitespace-nowrap text-[11px] transition-colors ${
                          isActive
                            ? "font-medium text-primary"
                            : isCompleted
                              ? "text-primary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================ PAGE TITLE ============================ */}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
            <h1 className="flex items-center gap-2 text-lg font-bold text-foreground md:text-xl">
              <Pencil className="h-4 w-4 text-primary" />
              فرم پذیرش و ثبت اطلاعات اولیه بیمار
            </h1>

            <p className="mt-2 text-xs leading-6 text-muted-foreground md:text-sm">
              لطفاً اطلاعات خود را با دقت وارد کنید. کلیه اطلاعات محرمانه
              بوده و صرفاً جهت ارائه خدمات بهتر استفاده می‌شود.
            </p>
          </div>

          {/* ============================ STEP 1 ============================ */}

          {currentStep === 1 && (
            <>
              <FormSection
                icon={UserRound}
                title="اطلاعات شخصی"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field
                    label="نام"
                    required
                    placeholder="نام خود را وارد کنید"
                  />

                  <Field
                    label="نام خانوادگی"
                    required
                    placeholder="نام خانوادگی خود را وارد کنید"
                  />

                  <Field
                    label="کد ملی"
                    required
                    placeholder="کد ملی ۱۰ رقمی خود را وارد کنید"
                  />

                  <Field
                    label="تاریخ تولد"
                    required
                  >
                    <DatePicker
                      ref={pickerRef}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      editable={false}
                      render={(value, openCalendar) => (
                        <div className="flex w-full items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />

                          <input
                            readOnly
                            value={value}
                            onClick={openCalendar}
                            placeholder="انتخاب تاریخ"
                            className="w-full cursor-pointer bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                          />
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

                  <Field
                    label="اشخاص معرفی‌کننده"
                    placeholder="در صورت وجود"
                  />
                </div>
              </FormSection>

              <FormSection
                icon={Phone}
                title="اطلاعات تماس"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field
                    label="شماره موبایل"
                    required
                    placeholder="0912 345 6789"
                  />

                  <Field
                    label="تلفن ثابت"
                    placeholder="مثال: 021-12345678"
                  />

                  <Field
                    label="ایمیل"
                    placeholder="example@email.com"
                  />

                  <Field
                    label="آدرس"
                    placeholder="آدرس دقیق محل سکونت خود را وارد کنید"
                    endIcon={MapPin}
                  />
                </div>
              </FormSection>
            </>
          )}

          {/* ============================ STEP 2 ============================ */}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Consent */}

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    رضایت‌نامه و تعهد
                  </span>
                </div>

                <p className="mb-4 text-[11px] leading-6 text-muted-foreground">
                  اینجانب با آگاهی کامل اعلام می‌کنم که اطلاعات ارائه‌شده
                  صحیح و به‌روز است. با علم به ماهیت خدمات درمانی و مراقبتی،
                  رضایت خود را جهت انجام خدمات در کلینیک اعلام می‌دارم.
                  همچنین می‌پذیرم که کلیه شرایط و مراقبت‌های لازم قبل و بعد
                  از درمان برای من توضیح داده شده است.
                </p>

                <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) =>
                      setAgreed(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-border accent-primary"
                  />

                  <span>
                    من ضمن مطالعه کامل، رضایت و تعهد خود را اعلام می‌کنم.
                  </span>
                </label>
              </div>

              {/* Signature */}

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <SignatureField
                  onChange={(signature) => {
                    console.log(signature);
                  }}
                />
              </div>

              {/* Security */}

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    اطلاعات شما امن است
                  </span>
                </div>

                <p className="text-xs leading-6 text-muted-foreground">
                  کلیه اطلاعات شما مطابق با استانداردهای امنیتی رمزگذاری و
                  محافظت می‌شود.
                </p>
              </div>
            </div>
          )}

          {/* ============================ STEP 3 ============================ */}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MEDICAL_QUESTIONS.map((question) => (
                <MedicalQuestionCard
                  key={question.title}
                  {...question}
                />
              ))}

              {/* Lifestyle */}

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    سبک زندگی
                  </span>
                </div>

                <p className="mb-3 text-xs leading-5 text-muted-foreground">
                  آیا سیگار یا دخانیات مصرف می‌کنید؟
                </p>

                <Field
                  label="مصرف دخانیات"
                  select
                  placeholder="انتخاب کنید"
                  options={[
                    { value: "yes", label: "بله" },
                    { value: "no", label: "نه" },
                  ]}
                />
              </div>

              {/* Notes */}

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="mb-3 flex items-center gap-2">
                  <StickyNote className="h-4 w-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    یادداشت‌های تکمیلی
                  </span>
                </div>

                <p className="mb-3 text-xs leading-5 text-muted-foreground">
                  هر نکته‌ای که فکر می‌کنید لازم است بدانیم.
                </p>

                <textarea
                  placeholder="توضیحات خود را وارد کنید"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* ============================ STEP 4 ============================ */}

          {currentStep === 4 && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ClipboardCheck className="h-7 w-7 text-primary" />
              </div>

              <h2 className="text-base font-bold text-foreground">
                بررسی نهایی اطلاعات
              </h2>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-muted-foreground">
                اطلاعات شخصی، رضایت‌نامه و سوابق پزشکی شما تکمیل شده است.
                پیش از ثبت نهایی، در صورت نیاز می‌توانید به هر مرحله
                بازگردید و اطلاعات را ویرایش کنید.
              </p>
            </div>
          )}

          {/* ============================ ACTIONS ============================ */}

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    ثبت و ادامه
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    ثبت نهایی
                    <Check className="h-4 w-4" />
                  </button>
                )}

                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <ArrowRight className="h-4 w-4" />
                    مرحله قبل
                  </button>
                )}
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                <Save className="h-4 w-4" />
                ذخیره موقت
              </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث
              قرار نمی‌گیرد.
            </p>
          </div>
        </main>

        {/* ============================ SIDEBAR ============================ */}

        <aside className="hidden w-full shrink-0 space-y-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm lg:block lg:w-80">
          {/* Image */}

          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <Image
              src="/image/rigester.png"
              alt="نمای داشبورد و پنل مدیریت کلینیک"
              width={800}
              height={800}
              unoptimized
              className="mx-auto mb-4 w-full max-w-[230px] rounded-xl object-contain"
            />

            <div className="font-semibold text-foreground">
              تکمیل سریع و امن
            </div>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              با تکمیل این فرم، روند ارائه خدمات برای شما سریع‌تر، آسان‌تر
              و دقیق‌تر خواهد بود.
            </p>
          </div>

          {/* Info List */}

          <div className="space-y-2">
            {SIDEBAR_INFO.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground">
                      {item.title}
                    </div>

                    <div className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help */}

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Headset className="h-4 w-4 text-primary" />

              <span className="text-xs font-semibold text-foreground">
                نیاز به راهنمایی دارید؟
              </span>
            </div>

            <p className="mb-3 text-[11px] leading-5 text-muted-foreground">
              پشتیبانی ما آماده پاسخگویی به سوالات شماست.
            </p>

            <a
              href="tel:02112345678"
              dir="ltr"
              className="block rounded-xl bg-muted py-2.5 text-center text-xs font-medium text-foreground transition-colors hover:bg-muted/80"
            >
              021-12345678
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            HELPER COMPONENTS                               */
/* -------------------------------------------------------------------------- */

function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <h2 className="text-sm font-bold text-foreground">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

interface Option {
  value: string;
  label: string;
}

interface FieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  select?: boolean;
  options?: Option[];
  endIcon?: LucideIcon;
  bare?: boolean;
  className?: string;
  children?: ReactNode;
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
}: FieldProps) {
  const inputClasses =
    "w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className={className}>
      {!bare && (
        <label className="mb-1.5 block text-xs font-medium text-foreground">
          {label}

          {required && (
            <span className="mr-1 text-destructive">*</span>
          )}
        </label>
      )}

      <div className="flex min-h-[42px] items-center rounded-xl border border-border bg-background px-3 py-2.5 transition-colors focus-within:border-primary">
        {children ? (
          <div className="w-full">{children}</div>
        ) : select ? (
          <select
            className={`${inputClasses} cursor-pointer`}
            defaultValue=""
          >
            <option
              value=""
              disabled
            >
              {placeholder}
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
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
              <EndIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
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
  icon: LucideIcon;
  title: string;
  question: string;
  placeholder: string;
}) {
  const [answer, setAnswer] = useState<"yes" | "no">("no");

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <span className="text-sm font-semibold text-foreground">
          {title}
        </span>
      </div>

      <p className="mb-3 text-xs leading-5 text-muted-foreground">
        {question}
      </p>

      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="radio"
            name={title}
            checked={answer === "yes"}
            onChange={() => setAnswer("yes")}
            className="h-3.5 w-3.5 accent-primary"
          />

          بله
        </label>

        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="radio"
            name={title}
            checked={answer === "no"}
            onChange={() => setAnswer("no")}
            className="h-3.5 w-3.5 accent-primary"
          />

          خیر
        </label>
      </div>

      <input
        type="text"
        disabled={answer === "no"}
        placeholder={
          answer === "yes"
            ? placeholder
            : "در صورت انتخاب «بله» فعال می‌شود"
        }
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}