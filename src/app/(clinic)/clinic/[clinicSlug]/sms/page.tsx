"use client";

import { useState } from "react";
import Image from "next/image";

import {
  MessageCircle,
  Filter,
  Search,
  Star,
  MoreVertical,
  Info,
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Phone,
  Mail,
  MapPin,
  CalendarClock,
  Sparkles,
  CalendarPlus,
  FolderOpen,
  Receipt,
  StickyNote,
  Tag,
  ArrowRight,
} from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "عزیزه محمدی", time: "۱۰:۳۰", preview: "سلام وقت بخیر، برای رزرو لیزر چه زمانی...", unread: 2, code: "۱۰۳۳۴" },
  { id: 2, name: "پریسا یوسفی", time: "۱۰:۱۵", preview: "ممنون از پیگیری 🙏", read: true },
  { id: 3, name: "سارا احمدی", time: "دیروز", preview: "تایید میکنم، روز شنبه مناسب هست." },
  { id: 4, name: "لیلا مرادی", time: "دیروز", preview: "لطفاً هزینه واریز را چک بفرمایید.", unread: 1 },
  { id: 5, name: "مینا رحیمی", time: "۱۴۰۳/۰۳/۲۰", preview: "عکس‌های قبل و بعد رو ارسال کردم" },
  { id: 6, name: "فاطمه کریمی", time: "۱۴۰۳/۰۳/۲۰", preview: "برای مشاوره پوست می‌خواستم وقت بگیرم.", unread: 2 },
  { id: 7, name: "نگار رضایی", time: "۱۴۰۳/۰۳/۱۹", preview: "ممنون، حتماً تا فردا ارسال می‌کنم." },
  { id: 8, name: "آیدا قربانی", time: "۱۴۰۳/۰۳/۱۹", preview: "باشه، پیام شما دریافت شد." },
];

const MESSAGES = [
  { fromMe: false, text: "سلام وقت شما هم بخیر 🌸 برای رزرو لیزر، قبل از هرچیز لطفاً ناحیه مورد نظر و سابقه لیزر قبلی‌تون رو بفرمایید تا راهنمایی دقیق‌تری ارائه بدم.", time: "۱۰:۲۲" },
  { fromMe: true, text: "سلام ممنونم. من لیزر زیر بغل می‌خوام و تا حالا لیزر انجام ندادم.", time: "۱۰:۲۵", seen: true },
  { fromMe: false, text: "ممنون از اطلاعات. پیشنهاد ما برای شما پکیج ۸ جلسه لیزر زیر بغل هست. می‌تونید روز و ساعت مورد نظرتون رو انتخاب کنید تا نوبت براتون ثبت کنم.", time: "۱۰:۲۷" },
  { fromMe: true, text: "روز شنبه بعد از ظهر برام مناسبه. ساعت چند وقت دارید؟", time: "۱۰:۲۸", seen: true },
  { fromMe: false, text: "ساعت ۱۶:۳۰ روز شنبه ۲۶ خرداد براتون آزاد است. مایلید نوبت براتون ثبت کنم؟", time: "۱۰:۳۰" },
];

const QUICK_ACTIONS = [
  { icon: CalendarPlus, label: "ثبت نوبت جدید" },
  { icon: FolderOpen, label: "مشاهده پرونده" },
  { icon: Receipt, label: "ارسال صورت‌حساب" },
  { icon: StickyNote, label: "یادداشت جدید" },
  { icon: Tag, label: "تغییر وضعیت گفتگو" },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "starred">("all");
  const [activeConversation, setActiveConversation] = useState(1);
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const current = CONVERSATIONS.find((c) => c.id === activeConversation)!;

  return (
    <div className="flex h-[calc(100vh-90px)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <MessageCircle className="h-5 w-5 text-primary-dark" /> مرکز پیام‌ها / چت
          </h1>
          <p className="mt-1 text-sm text-gray-400">گفتگوها، پیام‌ها و ارتباطات با مراجعین</p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[280px_1fr_280px]">
        {/* لیست گفتگوها */}
        <div className={`flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white ${mobileView === "list" ? "flex" : "hidden lg:flex"}`}>
          <div className="border-b border-gray-100 p-3">
            <div className="mb-2 flex items-center gap-2">

              <div className="flex flex-1 items-center gap-1.5 rounded-xl border border-gray-200 px-2.5 py-2">
                <input type="text" placeholder="جستجو در پیام‌ها..." className="w-full bg-transparent text-xs outline-none placeholder:text-gray-300" />
                <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              </div>

              <button className="rounded-lg border border-gray-200 p-2 text-gray-400">
                <Filter className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex gap-1 text-[11px]">
              {[
                { key: "all", label: "همه" },
                { key: "unread", label: "خوانده نشده" },
                { key: "starred", label: "علاقه‌مندی‌ها" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as typeof activeTab)}
                  className={`flex-1 rounded-lg py-1.5 ${activeTab === t.key ? "bg-primary-light/15 font-medium text-primary-dark" : "text-gray-400"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConversation(c.id);
                  setMobileView("thread");
                }}
                className={`flex w-full items-start gap-2.5 border-b border-gray-50 p-3 text-right ${activeConversation === c.id ? "bg-primary-light/10" : "hover:bg-gray-50"
                  }`}
              >
                <Image
                  src="/image/user.PNG"
                  alt="User"
                  width={30}
                  height={30}
                  unoptimized
                  className="rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{c.name}</span>
                    <span className="text-[10px] text-gray-300">{c.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-gray-400">{c.preview}</p>
                </div>
                {c.unread ? (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                    {c.unread.toLocaleString("fa-IR")}
                  </span>
                ) : c.read ? (
                  <CheckCheck className="h-3.5 w-3.5 shrink-0 text-primary-dark" />
                ) : null}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 p-3">
            <button className="w-full rounded-xl border border-gray-200 py-2 text-xs text-gray-600 hover:bg-gray-50">
              مشاهده آرشیو پیام‌ها
            </button>
          </div>
        </div>

        {/* پنجره گفتگو */}
        <div className={`flex-col overflow-hidden rounded-2xl border border-gray-100  bg-white ${mobileView === "thread" ? "flex" : "hidden lg:flex"}`}>
          <div className="flex items-center justify-between border-b border-gray-100 p-3">

            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/image/user.PNG"
                  alt="Avatar"
                  fill
                  className="object-cover"
                />

                {current.unread && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                    {current.unread.toLocaleString("fa-IR")}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{current.name}</div>
                <div className="text-[10px] text-gray-400">مراجع</div>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setMobileView("list")} className="text-gray-400 lg:hidden">
                <ArrowRight className="h-4 w-4" />
              </button>
              <Info className="h-4 w-4 text-gray-300" />
              <MoreVertical className="h-4 w-4 text-gray-300" />
              <Star className="h-4 w-4 text-gray-300" />
            </div>

          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-hide">
            <div className="text-center text-[10px] text-gray-300">امروز</div>
            {MESSAGES.map((m, i) => (
              <div key={i} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed sm:max-w-sm ${m.fromMe ? "rounded-bl-sm bg-primary-light/15 text-gray-700" : "rounded-br-sm bg-gray-50 text-gray-700"
                    }`}
                >
                  {m.text}
                  <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                    {m.time}
                    {m.fromMe && (m.seen ? <CheckCheck className="h-3 w-3 text-primary-dark" /> : <Check className="h-3 w-3" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-gray-100 p-3">
            <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark">
              <Send className="h-4 w-4 -scale-x-100" />
            </button>
            <input
              type="text"
              placeholder="پیام خود را بنویسید..."
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none placeholder:text-gray-300"
            />
            <button className="hidden text-gray-300 hover:text-gray-500 sm:block"><ImageIcon className="h-4 w-4" /></button>
            <button className="hidden text-gray-300 hover:text-gray-500 sm:block"><Paperclip className="h-4 w-4" /></button>
            <button className="hidden text-gray-300 hover:text-gray-500 sm:block"><Smile className="h-4 w-4" /></button>
          </div>
        </div>

        {/* پنل اطلاعات مراجع */}
        <div className="hidden flex-col gap-4 overflow-y-auto scrollbar-hide lg:flex">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
            <Image
              src="/image/user.PNG"
              alt="User"
              width={70}
              height={70}
              unoptimized
              className="mx-auto rounded-full object-cover"
            />
            <div className="text-sm font-bold text-gray-900">{current.name}</div>
            <div className="text-[11px] text-gray-400">#{current.code ?? "----"}</div>
            {current.unread && (
              <span className="mt-2 inline-block rounded-full bg-secondary-pink/40 px-2.5 py-0.5 text-[10px] text-pink-600">
                {current.unread.toLocaleString("fa-IR")} پیام خوانده نشده
              </span>
            )}
            <div className="mt-4 space-y-2 text-right text-[11px] text-gray-500">
              <div className="flex items-center gap-2" dir="ltr"><Phone className="h-3.5 w-3.5 text-gray-300" /> 0912 345 6789</div>
              <div className="flex items-center gap-2" dir="ltr"><Mail className="h-3.5 w-3.5 text-gray-300" /> azizeh.mohammadi@email.com</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gray-300" /> تهران، سعادت‌آباد</div>
            </div>
            <button className="mt-4 w-full rounded-xl border border-gray-200 py-2 text-[11px] text-gray-600 hover:bg-gray-50">
              مشاهده پروفایل کامل
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light/20">
                <CalendarClock className="h-4 w-4 text-primary-dark" />
              </div>
              <div>
                <div className="text-[11px] text-gray-400">آخرین خدمت</div>
                <div className="text-xs font-medium text-gray-700">تزریق بوتاکس</div>
                <div className="text-[10px] text-gray-400">۱۴۰۳/۰۲/۲۸</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-purple/40">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-[11px] text-gray-400">نوبت بعدی</div>
                <div className="text-xs font-medium text-gray-700">لیزر زیر بغل - جلسه ۱</div>
                <div className="text-[10px] text-gray-400">شنبه ۲۶ خرداد ۱۴۰۳ - ۱۶:۳۰</div>
                <span className="mt-1 inline-block rounded-full bg-primary-light/20 px-2 py-0.5 text-[9px] text-primary-dark">تایید شده</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 text-xs font-bold text-gray-800">عملیات سریع</h3>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <button key={a.label} className="flex w-full items-center gap-2 rounded-xl border border-gray-100 px-3 py-2 text-[11px] text-gray-600 hover:bg-gray-50">
                  <a.icon className="h-3.5 w-3.5 text-gray-400" /> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
