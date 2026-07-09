import React from "react";
import {
  Video,
  MessageCircle,
  UserRound,
  Images,
  CalendarClock,
  FolderHeart,
  ScanLine,
  ShieldCheck,
  Briefcase,
  Stethoscope,
  Headset,
  Users,
  ChevronLeft,
  Lock,
  RefreshCcw,
  GraduationCap,
  Mail,
  LogOut,
  Calendar,
  Play,


} from "lucide-react";

import Image from "next/image";
import Navbar from "@/components/navbar/page";

const FEATURES = [
  {
    icon: ScanLine,
    bg: "bg-secondary-pink/50",
    iconColor: "text-pink-600",
    title: "پذیرش دیجیتال",
    desc: "پذیرش از طریق QR و لینک، فرم‌های هوشمند و رضایت‌نامه",
  },
  // {
  //   icon: FolderHeart,
  //   bg: "bg-primary-light/25",
  //   iconColor: "text-primary-dark",
  //   title: "پرونده مرکزی بیمار",
  //   desc: "سوابق درمانی، اسناد و تاریخچه کامل در یک‌جا",
  // },
  {
    icon: FolderHeart,
    bg: "bg-primary-light/25",
    iconColor: "text-primary-dark",
    title: "پرونده مرکزی بیمار",
    desc: "سوابق درمانی، اسناد و یادداشت‌ها در یک‌جا",
  },
  {
    icon: CalendarClock,
    bg: "bg-secondary-purple/40",
    iconColor: "text-purple-600",
    title: "نوبت‌دهی هوشمند",
    desc: "تقویم آنلاین، یادآوری خودکار و مدیریت تداخل‌ها",
  },
  {
    icon: Images,
    bg: "bg-secondary-pink/50",
    iconColor: "text-pink-600",
    title: "عکس‌های قبل و بعد",
    desc: "مقایسه تصاویر، گالری و تعقیب نتایج درمانی",
  },
  {
    icon: UserRound,
    bg: "bg-primary-light/25",
    iconColor: "text-primary-dark",
    title: "پنل بیمار",
    desc: "دسترسی به پرونده، نوبت‌ها و صورت‌حساب‌ها",
  },
  {
    icon: MessageCircle,
    bg: "bg-secondary-blue/40",
    iconColor: "text-blue-600",
    title: "چت و پیام‌ها",
    desc: "پیام‌رسانی درون‌برنامه‌ای و اطلاع‌رسانی خودکار",
  },
  {
    icon: Video,
    bg: "bg-primary-light/25",
    iconColor: "text-primary-dark",
    title: "تماس تصویری",
    desc: "مشاوره آنلاین امن و ارتباط ویدیویی یکپارچه",
  },
];

const ROLES = [
  {
    icon: Users,
    title: "مراجعین",
    desc: "ثبت‌نام و پذیرش سریع مشاهده نوبت‌ها و نتایج",
  },
  {
    icon: Headset,
    title: "منشی و پذیرش",
    desc: "مدیریت نوبت‌ها، پذیرش پیام‌ها و امور روزانه",
  },
  {
    icon: Stethoscope,
    title: "پزشکان و کارشناسان",
    desc: "بررسی پرونده، ثبت خدمات نسخه‌نویسی و پیگیری",
  },
  {
    icon: Briefcase,
    title: "مدیر کلینیک",
    desc: "نظارت بر عملکرد و تیم، درآمد و تصمیم‌گیری‌ها",
  },
  {
    icon: ShieldCheck,
    title: "مدیر سیستم",
    desc: "تنظیمات، کاربران، دسترسی‌ها امنیت و پشتیبانی",
  },
];

const TRUST_LOGOS = ["دل آرام", "پویانک", "پوست نو", "ماهرخ", "رویای زیبا"];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* هدر */}
      <Navbar />

      {/* هیرو */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/10 to-white px-6 pb-20 pt-14 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* متن هیرو */}
          <div className="order-2 text-right lg:order-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-light/20 px-3 py-1 text-xs font-medium text-primary-dark">
              راهکار جامع مدیریت کلینیک‌های زیبایی ✦
            </span>

            <h1 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl">
              مدیریت هوشمند کلینیک،
              <br />
              <span className="text-primary-dark">تجربه‌ای بی‌نقص برای شما و مراجعین</span>
            </h1>

            <p className="mt-5 max-w-xl text-gray-500 text-[14px]">
              پلتفرم Beauty Clinic CRM تمامی ابزارهای موردنیاز کلینیک‌های زیبایی را در یک سیستم
              یکپارچه ارائه می‌دهد. از پذیرش و نوبت‌دهی تا پرونده پزشکی، عکس‌های قبل و بعد،
              پیام‌رسانی و گزارش‌های مدیریتی.
            </p>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-3 ">

              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-[5px] bg-primary px-7 py-2 text-sm font-medium text-white transition-all hover:bg-primary-dark active:scale-95"
              >
                <Calendar className="h-4 w-4 " />
                درخواست دمو
              </a>

              {/* دکمه ورود به پنل */}
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-[5px] border border-primary px-7 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                ورود به پنل
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              بدون نیاز به نصب &nbsp;·&nbsp; راه‌اندازی سریع &nbsp;·&nbsp; پشتیبانی اختصاصی
            </p>

            <div className="mt-6 flex flex-wrap gap-1 text-xs text-gray-500 pb-1 pr-2 rounded-[2px] border border-gray-100">
              <span className="flex items-center py-2 gap-1 " >
                <ShieldCheck className="h-4 w-4 text-primary" /> اطلاعات امن و رمزنگاری‌شده
              </span>
              <div className="hidden md:block w-[1px] h-4 mt-2 bg-gray-300 flex-shrink-0"></div>

              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-primary" /> پشتیبانی و آموزش تخصصی
              </span>
              <div className="hidden md:block w-[1px] h-4 mt-2 bg-gray-300 flex-shrink-0"></div>

              <span className="flex items-center gap-1">
                <RefreshCcw className="h-4 w-4 text-primary" /> به‌روزرسانی مداوم
              </span>
              <div className="hidden md:block w-[1px] h-4 mt-2 bg-gray-300 flex-shrink-0"></div>

              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-primary" /> بدون نیاز به نصب
              </span>
            </div>
          </div>

          {/* پیش‌نمایش دشبورد و موبایل */}
          <div className="order-1 flex justify-center lg:order-2">
            <Image
              src="/image/Hero.webp"
              alt="نمای دشبورد و پنل مدیریت کلینیک"
              width={800}
              height={800}
              unoptimized
              className="w-full max-w-lg object-contain "
            />
          </div>
        </div>
      </section>

      {/* امکانات */}
      <section id="features" className="px-6 py-16 md:px-12">
        <h2 className="mb-10 text-center text-xl font-bold text-gray-900 md:text-2xl">
          همه‌ی ابزارهای موردنیاز کلینیک شما در یک پلتفرم
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl  border border-gray-100 p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${f.bg}`}>
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <div className="font-semibold text-gray-800">{f.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* نقش‌ها */}
      <section className="bg-gray-50 px-6 py-16 md:px-12">
        <h2 className="mb-10 text-center text-xl font-bold text-gray-900 md:text-2xl">
          هر نقش، ابزار مخصوص خود را دارد
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:flex lg:items-stretch lg:justify-center lg:gap-3">
          {ROLES.map((role, i) => (
            <React.Fragment key={i}>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:w-48">
                <role.icon className="mb-2 h-6 w-6 text-primary-dark" />

                <div className="text-sm font-semibold text-gray-800">
                  {role.title}
                </div>

                <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
                  {role.desc}
                </p>
              </div>

              {i < ROLES.length - 1 && (
                <span className="hidden lg:flex items-center text-2xl text-gray-300">
                  ⟵
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* اعتماد مشتریان */}
      <section className="mx-6 mb-16 md:mx-12">
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          {/* Divider */}
          <div className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-gray-200 lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* خبرنامه */}
            <div className="flex flex-col items-center gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">

              <img
                src="/image/newsletter.PNG"
                alt=""
                className="w-28 sm:w-36 shrink-0"
              />

              <div className="w-full flex-1 text-center lg:text-right">
                <h3 className="text-xl font-bold text-gray-800">
                  همیشه یک قدم جلوتر باشید
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-500">
                  جدیدترین قابلیت‌ها، نکات مدیریتی و Beauty Clinic CRM را دریافت کنید.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="flex-1 rounded-lg border border-gray-200 px-4 py-2 outline-none"
                  />

                  <button className="rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-primary-dark">
                    اشتراک
                  </button>
                </div>
              </div>
            </div>

            {/* لوگوها */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <h3 className="mb-8 text-center text-lg font-bold text-primary">
                مورد اعتماد کلینیک‌های برتر
              </h3>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-10">
                {TRUST_LOGOS.map((name) => (
                  <div key={name} className="flex flex-col items-center">
                    <div className="mb-3 h-12 w-12 rounded-full border border-gray-200" />

                    <span className="text-center text-sm font-semibold text-gray-500">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
