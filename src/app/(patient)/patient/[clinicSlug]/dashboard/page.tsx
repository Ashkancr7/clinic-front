"use client";

import { use, useState } from "react";
import {
  Clock3,
  Heart,
  CalendarCheck,
  FolderHeart,
  FileText,
  MessageSquare,
  CalendarPlus,
  UserRound,
  ChevronDown,
  Images,
  Download,
  FilePlus2,
  ShieldCheck,
  Headset,
  Gift,
  Lock,

} from "lucide-react";
import { PatientHeader } from "@/components/layout/PatientHeader";
import Image from "next/image";


const STATS = [
  {
    icon: FileText,
    label: "فایل‌ها و تصاویر",
    value: "۳۴",
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    icon: FolderHeart,
    label: "پرونده‌های پزشکی",
    value: "۶",
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CalendarCheck,
    label: "نوبت‌های آینده",
    value: "۲",
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    icon: Heart,
    label: "خدمات انجام‌شده",
    value: "۲۸",
    iconClass: "bg-red-50 text-red-600",
  },
];

const TABS = [
  {
    key: "appointments",
    label: "نوبت‌های من",
    icon: CalendarCheck,
  },
  {
    key: "records",
    label: "پرونده پزشکی",
    icon: FolderHeart,
  },
  {
    key: "consents",
    label: "رضایت‌نامه‌ها",
    icon: ShieldCheck,
  },
 
  {
    key: "gallery",
    label: "تصاویر من",
    icon: Images,
  },
   {
    key: "files",
    label: "فایل‌ها",
    icon: FileText,
  },
];

const GALLERY_ITEMS = [
  { title: "تزریق ژل لب", date: "۱۴۰۳/۰۳/۲۸", tone: "from-pink-200 to-pink-100" },
  { title: "بوتاکس", date: "۱۴۰۳/۰۲/۱۵", tone: "from-primary-light/60 to-primary-light/20" },
  { title: "مزوتراپی مو", date: "۱۴۰۳/۰۱/۳۱", tone: "from-secondary-purple/60 to-secondary-purple/20" },
  { title: "لیزر موهای زائد", date: "۱۴۰۳/۱۲/۱۰", tone: "from-secondary-blue/60 to-secondary-blue/20" },
];

const FILES = [
  { name: "گزارش آخرین جلسه مزوتراپی", type: "PDF", size: "۱.۲ مگابایت", date: "۱۴۰۳/۰۳/۲۸" },
  { name: "عکس راهنمای مراقبت بعد از تزریق", type: "JPG", size: "۸۰۰ کیلوبایت", date: "۱۴۰۳/۰۳/۲۸" },
  { name: "فاکتور خدمات", type: "PDF", size: "۲ مگابایت", date: "۱۴۰۳/۰۳/۲۵" },
  { name: "برنامه درمانی", type: "PDF", size: "۱.۱ مگابایت", date: "۱۴۰۳/۰۳/۲۰" },
];

const CONSENTS = [
  { name: "رضایت‌نامه تزریق ژل و فیلر" },
  { name: "رضایت‌نامه بوتاکس" },
  { name: "رضایت‌نامه لیزر موهای زائد" },
  { name: "رضایت‌نامه مزوتراپی مو" },
];

const PROFILE_FIELDS = [
  { label: "نام و نام‌خانوادگی", value: "سارا محمدی" },
  { label: "تاریخ تولد", value: "۱۳۷۵/۰۶/۱۵" },
  { label: "شماره تماس", value: "0912 123 4567", dir: "ltr" as const },
  { label: "ایمیل", value: "sara.mohammadi@gmail.com", dir: "ltr" as const },
  { label: "نوع پوست", value: "مختلط" },
];

const SERVICE_HISTORY = [
  { name: "مزوتراپی صورت", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۳/۲۸", tone: "from-primary-light/60 to-primary-light/20" },
  { name: "تزریق ژل لب", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۲/۱۵", tone: "from-pink-200 to-pink-100" },
  { name: "بوتاکس", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۲/۱۵", tone: "from-secondary-purple/60 to-secondary-purple/20" },
  { name: "مزوتراپی مو", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۱/۳۱", tone: "from-secondary-blue/60 to-secondary-blue/20" },
];

const QUICK_ACTIONS = [
  { icon: MessageSquare, tone: "bg-secondary-blue/40 text-blue-600", title: "پیام به پزشک", desc: "سوالات خود را بپرسید" },
  { icon: CalendarPlus, tone: "bg-primary-light/25 text-primary-dark", title: "درخواست نوبت", desc: "رزرو سریع و آسان" },
  { icon: Headset, tone: "bg-secondary-purple/40 text-purple-600", title: "پشتیبانی", desc: "ما همیشه همراه شما هستیم" },
  { icon: Gift, tone: "bg-secondary-pink/40 text-pink-600", title: "پیشنهاد ویژه", desc: "مشاهده تخفیف‌های فعال" },
];

export default function PatientDashboardPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-9xl space-y-6 px-4 py-6 md:px-8">
        {/* کارت خوش‌آمدگویی + نوبت بعدی + آمار */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 lg:grid-cols-[280px_1fr_auto] lg:items-center">
          {/* نوبت بعدی */}
          {/* خوش‌آمدگویی */}
          <div className="flex items-center gap-4">
            <Image
              src="/image/user.PNG"
              alt="User"
              width={70}
              height={70}
              unoptimized
              className="rounded-full object-cover"
            />

            <div className="text-right">
              <h1 className="text-base font-bold text-gray-900">سلام سارا عزیز</h1>
              <p className="mt-1 max-w-[250px] text-[12px] text-gray-400">
                از اعتماد شما سپاسگزاریم. ما همیشه در تلاشیم بهترین تجربه‌ی زیبایی را برای شما بسازیم.
              </p>
              <div className="mt-3 flex gap-2">

                <button className="flex items-center gap-1 rounded-[3px] bg-primary px-2 py-1.5 text-[11px] font-medium text-white hover:bg-primary-dark lg:px-2 lg:py-1">
                  <CalendarPlus className="h-3 w-3 lg:h-2.5 lg:w-2" />
                  درخواست نوبت
                </button>

                <button className="flex items-center gap-1 rounded-[3px] border border-primary px-2 py-1.5 text-[11px] font-medium text-primary-dark lg:px-2 lg:py-1">
                  <MessageSquare className="h-3 w-3 lg:h-2.5 lg:w-2" />
                  پیام به پزشک
                </button>

              </div>
            </div>
          </div>

          {/* آمار */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-2xl border border-gray-100 p-3 text-center"
              >
                <div
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${s.iconClass}`}
                >
                  <s.icon className="h-4 w-4" />
                </div>

                <div className="text-base font-bold text-gray-900">
                  {s.value}
                </div>

                <div className="text-[10px] text-gray-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">نوبت بعدی شما</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light/20">
                <Clock3 className="h-4 w-4 text-primary-dark" />
              </div>
            </div>
            <div className="text-sm font-bold text-gray-800">چهارشنبه ۳۱ اردیبهشت ۱۴۰۳</div>
            <div className="text-xs text-gray-400">۱۰:۳۰</div>
            <div className="mt-3 border-t border-gray-50 pt-2 text-xs">
              <div className="font-medium text-gray-700">مزوتراپی صورت</div>
              <div className="text-gray-400">دکتر سارا محمدی</div>
            </div>
            <button className="mt-3 w-full rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark">
              مشاهده جزئیات نوبت
            </button>
          </div>


        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ستون کناری */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary-dark" />
                <h3 className="text-sm font-bold text-primary">خلاصه اطلاعات من</h3>
              </div>
              <div className="space-y-3 text-xs">
                {PROFILE_FIELDS.map((f) => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-gray-400">{f.label}</span>
                    <span className="text-gray-700" dir={f.dir}>
                      {f.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">وضعیت پرونده</span>
                  <span className="rounded-full bg-primary-light/20 px-2.5 py-0.5 text-[11px] text-primary-dark">
                    فعال
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">تاریخچه خدمات من</h3>
              </div>
              <div className="space-y-4">
                {SERVICE_HISTORY.map((s) => (
                  <div key={s.name + s.date} className="flex items-center gap-3">
                    <Image
                      src="/image/user.PNG"
                      alt="User"
                      width={30}
                      height={30}
                      unoptimized
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">

                      <div className="text-xs font-medium text-gray-700">{s.name}</div>
                      <div className="flex items-center  text-[10px] text-gray-400">
                        <span className="ml-24">{s.doctor}</span>
                        <span>{s.date}</span>
                      </div>
                    </div>
                    <span className="mb-1 inline-block rounded-full bg-primary-light/20 px-2 py-0.5 text-[9px] text-primary-dark">
                      انجام‌شده
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 mx-auto flex items-center gap-1 text-xs text-primary-dark">
                مشاهده همه خدمات
              </button>
            </div>
          </div>
          {/* ستون اصلی */}
          <div className="space-y-4 lg:col-span-2">
            {/* تب‌ها */}
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4">
              <div className="flex min-w-max items-center gap-6 text-sm">
                {TABS.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 transition-colors ${activeTab === tab.key
                        ? "border-primary font-medium text-primary-dark"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* محتوای تب */}
            {activeTab === "gallery" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-primary">گالری تصاویر (قبل و بعد)</h2>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-500">
                    همه خدمات <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {GALLERY_ITEMS.map((g) => (
                    <div key={g.title}>
                      <div className={`relative h-28 overflow-hidden rounded-xl bg-gradient-to-br ${g.tone}`}>
                        <span className="absolute right-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] text-gray-600">
                          قبل
                        </span>
                        <span className="absolute left-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] text-gray-600">
                          بعد
                        </span>
                        <Images className="absolute bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 text-white/70" />
                      </div>
                      <div className="mt-1.5 text-xs font-medium text-gray-700">{g.title}</div>
                      <div className="text-[10px] text-gray-400">{g.date}</div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 flex mx-auto items-center gap-1 text-xs text-primary-dark">
                  مشاهده گالری کامل
                </button>
              </div>
            )}

            {activeTab !== "gallery" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
                محتوای «{TABS.find((t) => t.key === activeTab)?.label}» به‌زودی اینجا نمایش داده می‌شود.
              </div>
            )}

            {/* فایل‌ها و رضایت‌نامه‌ها */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">رضایت‌نامه‌ها</h3>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
                    جدیدترین <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {CONSENTS.map((c) => (
                    <div
                      key={c.name}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3"
                    >
                      <span className="text-xs font-medium text-gray-700">
                        {c.name}
                      </span>

                      <button className="rounded-lg p-2 text-primary transition hover:bg-primary/10">
                        <FilePlus2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 mx-auto flex items-center gap-1 text-xs text-primary-dark">
                  مشاهده همه رضایت‌نامه‌ها
                </button>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">فایل‌ها و پیوست‌ها</h3>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
                    جدیدترین <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {FILES.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
                    >
                      <div>
                        <div className="text-xs font-medium text-gray-700">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {f.type} · {f.size} · {f.date}
                        </div>
                      </div>

                      <button className="rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-primary hover:text-primary">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 flex mx-auto items-center gap-1 text-xs text-primary-dark">
                  مشاهده همه فایل‌ها
                </button>
              </div>
            </div>
          </div>


        </div>

        {/* دسترسی سریع */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.title}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-right hover:shadow-sm"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.tone}`}>
                <a.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">{a.title}</div>
                <div className="text-[10px] text-gray-400">{a.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          تمامی اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
        </p>
      </div>
    </div>
  );
}
