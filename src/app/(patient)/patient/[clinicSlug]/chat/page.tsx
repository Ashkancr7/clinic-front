"use client";

import { use, useState } from "react";
import { Search, Send, Paperclip, Smile, MoreHorizontal, ArrowRight } from "lucide-react";
import { PatientHeader } from "@/components/layout/PatientHeader";
import Image from "next/image";

const CONVERSATIONS = [
  { id: 1, name: "دکتر سارا محمدی", role: "پزشک", lastMessage: "نتیجه جلسه امروز خیلی خوب بود، مراقبت‌های بعد از تزریق رو حتماً رعایت کنید.", time: "۱۰:۴۵", unread: 2 },
  { id: 2, name: "منشی کلینیک", role: "پذیرش", lastMessage: "نوبت شما برای چهارشنبه تایید شد.", time: "دیروز", unread: 0 },
  { id: 3, name: "دکتر آرش نیکنام", role: "پزشک", lastMessage: "لطفاً قبل از جلسه بعدی این فرم را تکمیل کنید.", time: "۲ روز پیش", unread: 0 },
];

const MESSAGES = [
  { fromMe: false, text: "سلام سارا جان، حالت بعد از جلسه دیروز چطوره؟", time: "۱۰:۳۰" },
  { fromMe: true, text: "سلام دکتر، ممنون. کمی قرمزی داشت ولی امروز بهتر شده.", time: "۱۰:۳۵" },
  { fromMe: false, text: "خوبه، طبیعیه. کرم ضدآفتاب رو فراموش نکنید و از تماس مستقیم با آفتاب پرهیز کنید.", time: "۱۰:۴۰" },
  { fromMe: false, text: "نتیجه جلسه امروز خیلی خوب بود، مراقبت‌های بعد از تزریق رو حتماً رعایت کنید.", time: "۱۰:۴۵" },
];

export default function ChatPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [activeConversation, setActiveConversation] = useState(1);
  const [message, setMessage] = useState("");
  // فقط برای موبایل: کدوم پنل نمایش داده بشه — لیست گفتگوها یا خود گفتگو
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const current = CONVERSATIONS.find((c) => c.id === activeConversation)!;

  const openConversation = (id: number) => {
    setActiveConversation(id);
    setMobileView("thread");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden px-0 py-0 md:px-8 md:py-6">
        <div className="flex w-full overflow-hidden md:rounded-2xl md:border md:border-gray-100 bg-white">
          {/* لیست گفتگوها */}
          <div
            className={`w-full shrink-0 border-l border-gray-100 md:flex md:w-72 md:flex-col ${mobileView === "list" ? "flex flex-col" : "hidden"
              }`}
          >
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <input
                  type="text"
                  placeholder="جستجو در گفتگوها..."
                  className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
                />
                <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openConversation(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-gray-50 p-4 text-right ${activeConversation === c.id ? "bg-primary-light/10" : "hover:bg-gray-50"
                    }`}
                >
                  <Image
                    src="/image/user.PNG"
                    alt="User"
                    width={50}
                    height={50}
                    unoptimized
                    className="rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800">{c.name}</span>
                      <span className="text-[10px] text-gray-300">{c.time}</span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-gray-400">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* پنجره گفتگو */}
          <div
            className={`flex-1 flex-col md:flex ${mobileView === "thread" ? "flex" : "hidden"}`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2.5">
                {/* دکمه بازگشت - فقط تو موبایل دیده میشه */}
                <button
                  onClick={() => setMobileView("list")}
                  className="text-gray-400 md:hidden"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="h-9 w-9 rounded-full bg-gray-100" />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{current.name}</div>
                  <div className="text-[11px] text-gray-400">{current.role}</div>
                </div>
              </div>
              <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {MESSAGES.map((m, i) => (
                <div key={i} className={`flex ${m.fromMe ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed sm:max-w-xs ${m.fromMe
                        ? "rounded-bl-sm bg-primary text-white"
                        : "rounded-br-sm bg-gray-100 text-gray-700"
                      }`}
                  >
                    {m.text}
                    <div className={`mt-1 text-[9px] ${m.fromMe ? "text-white/70" : "text-gray-400"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 p-3 sm:p-4">
              <button className="hidden text-gray-300 hover:text-gray-500 sm:block">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="hidden text-gray-300 hover:text-gray-500 sm:block">
                <Smile className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none placeholder:text-gray-300"
              />
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark">
                <Send className="h-4 w-4 -scale-x-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
