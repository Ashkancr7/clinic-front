
"use client";

import { use, useState } from "react";

import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";

import { PatientHeader } from "@/components/layout/PatientHeader";
import Image from "next/image";

const CONVERSATIONS = [
  {
    id: 1,
    name: "دکتر سارا محمدی",
    role: "پزشک",
    lastMessage:
      "نتیجه جلسه امروز خیلی خوب بود، مراقبت‌های بعد از تزریق رو حتماً رعایت کنید.",
    time: "۱۰:۴۵",
    unread: 2,
  },
  {
    id: 2,
    name: "منشی کلینیک",
    role: "پذیرش",
    lastMessage: "نوبت شما برای چهارشنبه تایید شد.",
    time: "دیروز",
    unread: 0,
  },
  {
    id: 3,
    name: "دکتر آرش نیکنام",
    role: "پزشک",
    lastMessage: "لطفاً قبل از جلسه بعدی این فرم را تکمیل کنید.",
    time: "۲ روز پیش",
    unread: 0,
  },
];

const MESSAGES = [
  {
    fromMe: false,
    text: "سلام سارا جان، حالت بعد از جلسه دیروز چطوره؟",
    time: "۱۰:۳۰",
  },
  {
    fromMe: true,
    text: "سلام دکتر، ممنون. کمی قرمزی داشت ولی امروز بهتر شده.",
    time: "۱۰:۳۵",
  },
  {
    fromMe: false,
    text: "خوبه، طبیعیه. کرم ضدآفتاب رو فراموش نکنید و از تماس مستقیم با آفتاب پرهیز کنید.",
    time: "۱۰:۴۰",
  },
  {
    fromMe: false,
    text: "نتیجه جلسه امروز خیلی خوب بود، مراقبت‌های بعد از تزریق رو حتماً رعایت کنید.",
    time: "۱۰:۴۵",
  },
];

export default function ChatPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  const [activeConversation, setActiveConversation] = useState(1);
  const [message, setMessage] = useState("");

  // موبایل: نمایش لیست گفتگو یا خود گفتگو
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const current = CONVERSATIONS.find(
    (conversation) => conversation.id === activeConversation
  )!;

  const openConversation = (id: number) => {
    setActiveConversation(id);
    setMobileView("thread");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-transparent">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden px-0 py-0 md:px-8 md:py-6">
        <div className="flex w-full overflow-hidden bg-white md:rounded-2xl md:border md:border-gray-100 dark:bg-white/[0.06] dark:md:border-white/10">
          {/* =========================
              لیست گفتگوها
          ========================= */}
          <div
            className={`w-full shrink-0 border-l border-gray-100 dark:border-white/10 md:flex md:w-80 md:flex-col ${
              mobileView === "list" ? "flex flex-col" : "hidden"
            }`}
          >
            {/* Search */}
            <div className="border-b border-gray-100 p-4 dark:border-white/10">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 transition focus-within:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]">
                <Search className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-500" />

                <input
                  type="text"
                  placeholder="جستجو در گفتگوها..."
                  className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300 dark:text-gray-200 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                  className={`flex w-full items-center gap-3 border-b border-gray-50 p-4 text-right transition-colors dark:border-white/[0.06] ${
                    activeConversation === conversation.id
                      ? "bg-primary-light/10 dark:bg-primary-light/10"
                      : "hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Image
                      src="/image/user.PNG"
                      alt="User"
                      width={44}
                      height={44}
                      unoptimized
                      className="h-11 w-11 rounded-full object-cover"
                    />

                    {conversation.id === 1 && (
                      <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary dark:border-gray-900" />
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {conversation.name}
                      </span>

                      <span className="shrink-0 text-[10px] text-gray-300 dark:text-gray-500">
                        {conversation.time}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread */}
                  {conversation.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-white">
                      {conversation.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* =========================
              پنجره گفتگو
          ========================= */}
          <div
            className={`flex-1 flex-col ${
              mobileView === "thread" ? "flex" : "hidden"
            } md:flex`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                {/* Back - Mobile */}
                <button
                  onClick={() => setMobileView("list")}
                  aria-label="بازگشت به گفتگوها"
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-200 md:hidden"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Avatar */}
                <Image
                  src="/image/user.PNG"
                  alt={current.name}
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-full object-cover"
                />

                <div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {current.name}
                  </div>

                  <div className="text-[11px] text-gray-400 dark:text-gray-500">
                    {current.role}
                  </div>
                </div>
              </div>

              <button
                aria-label="گزینه‌های بیشتر"
                className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-gray-500 dark:hover:border-primary-light dark:hover:text-primary-light"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/40 p-4 dark:bg-transparent">
              {MESSAGES.map((messageItem, index) => (
                <div
                  key={index}
                  className={`flex ${
                    messageItem.fromMe ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm sm:max-w-md ${
                      messageItem.fromMe
                        ? "rounded-bl-sm bg-primary text-white"
                        : "rounded-br-sm border border-gray-100 bg-white text-gray-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-gray-200"
                    }`}
                  >
                    {messageItem.text}

                    <div
                      className={`mt-1 text-[9px] ${
                        messageItem.fromMe
                          ? "text-white/70"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {messageItem.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03] sm:p-4">
              <button
                aria-label="پیوست فایل"
                className="hidden rounded-lg p-1 text-gray-300 transition hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 sm:block"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <button
                aria-label="افزودن شکلک"
                className="hidden rounded-lg p-1 text-gray-300 transition hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 sm:block"
              >
                <Smile className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-primary/40 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-200 dark:placeholder:text-gray-500"
              />

              <button
                aria-label="ارسال پیام"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-dark dark:hover:bg-primary-light"
              >
                <Send className="h-4 w-4 -scale-x-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
