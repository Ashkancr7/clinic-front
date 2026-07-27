"use client";

import { use, useState, useRef } from "react";
import {
  MoreVertical,
  Pencil,
  MessageSquare,
  Star,
  Phone,
  CalendarClock,
  AlertTriangle,
  PencilLine,
  Link2,
  Smartphone,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  AlignRight,
  AlignLeft,
  UserRound,
  ShieldCheck,
  FilePlus2,
  Images,
  StickyNote,
  Heart,
  CalendarDays,
  Paperclip,
} from "lucide-react";

import Image from "next/image";


const TABS = [
  { key: "info", label: "اطلاعات پایه", icon: UserRound },
  { key: "medical", label: "سوابق پزشکی", icon: Heart },
  { key: "services", label: "خدمات انجام‌شده", icon: FilePlus2 },
  { key: "gallery", label: "تصاویر قبل و بعد", icon: Images },
  { key: "notes", label: "یادداشت‌های جلسه", icon: StickyNote },
  { key: "appointments", label: "نوبت‌ها", icon: CalendarDays },
  { key: "chat", label: "پیام‌ها", icon: MessageSquare },
  { key: "files", label: "فایل‌ها", icon: Paperclip },
  { key: "consents", label: "رضایت‌نامه‌ها", icon: ShieldCheck },
];

const RECENT_SERVICES = [
  { name: "مزوتراپی مو", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۳/۲۱", amount: "۱,۸۰۰,۰۰۰", status: "انجام‌شده" },
  { name: "بوتاکس", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۲/۱۵", amount: "۲,۴۰۰,۰۰۰", status: "انجام‌شده" },
  { name: "فیلر لب", doctor: "دکتر سارا محمدی", date: "۱۴۰۳/۰۱/۲۸", amount: "۳,۲۰۰,۰۰۰", status: "انجام‌شده" },
];

const GALLERY = [
  { title: "فیلر لب", date: "۱۴۰۳/۰۱/۲۸", tone: "from-pink-200 to-pink-100" },
  { title: "بوتاکس", date: "۱۴۰۳/۰۲/۱۵", tone: "from-primary-light/60 to-primary-light/20" },
  { title: "مزوتراپی مو", date: "۱۴۰۳/۰۳/۲۱", tone: "from-secondary-purple/60 to-secondary-purple/20" },
];

const CHAT_MESSAGES = [
  { name: "نسترن موسوی", time: "۱۰:۱۲", text: "سلام دکتر وقت بخیر، ممنون از راهنمایی‌های شما 🙏", fromMe: false },
  { name: "دکتر سارا محمدی", time: "۱۰:۲۸", text: "سلام عزیزم، خوشحالم که راضی هستید. لطفاً بعد رو فراموش نکنید.", fromMe: true },
  { name: "نسترن موسوی", time: "۱۰:۳۲", text: "حتماً، روز دوشنبه ساعت چند هست؟", fromMe: false },
  { name: "دکتر سارا محمدی", time: "۱۰:۳۴", text: "ساعت ۱۰:۳۰ ثبت شده. ممنون", fromMe: true },
];

const RELATED_FILES = [
  { name: "رضایت‌نامه مزوتراپی مو", type: "PDF", date: "۱۴۰۳/۰۳/۲۱" },
  { name: "برنامه مراقبتی بعد از جلسه", type: "PDF", date: "۱۴۰۳/۰۳/۲۱" },
  { name: "عکس آنالیز پوست", type: "JPG", date: "۱۴۰۳/۰۲/۱۵" },
];

const IMPORTANT_ALERTS = [
  { text: "آلرژی به لیدوکائین", tone: "bg-danger" },
  { text: "سابقه تزریق لب", tone: "bg-warning" },
  { text: "پوست حساس و خشک", tone: "bg-warning" },
];

export default function PatientProfilePage({
  params,
}: {
  params: Promise<{ clinicSlug: string; patientId: string }>;
}) {
  const { patientId } = use(params);
  const [activeTab, setActiveTab] = useState("info");
  const [note, setNote] = useState(
    "مزوتراپی مو با کوکتل رشد مو انجام شد. پوست سر قبل از تزریق با لیدوکائین موضعی بی‌حس شد. بیمار رضایت قبل از دارد. توصیه شد مصرف مکمل بیوتین ادامه یابد و شستشوی ملایم انجام شود."
  );

  const noteRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const applyFormat = (command: string, value?: string) => {
    noteRef.current?.focus();
    document.execCommand(command, false, value);
    updateActiveFormats();
    if (noteRef.current) setNote(noteRef.current.innerHTML);
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyLeft: document.queryCommandState("justifyLeft"),
    });
  };

  const toolbarBtn = (
    icon: React.ReactNode,
    command: string,
    value?: string
  ) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // جلوگیری از از دست رفتن فوکوس/انتخاب متن
      onClick={() => applyFormat(command, value)}
      className={`rounded p-1 transition-colors ${activeFormats[command]
          ? "bg-primary-light/30 text-primary-dark"
          : "text-gray-400 hover:text-gray-600"
        }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* اکشن‌های بالا */}
      <div className="flex items-center justify-end gap-2  ">


        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">
          <MessageSquare className="h-3.5 w-3.5" /> ارسال پیام
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-dark">
          <Pencil className="h-3.5 w-3.5" /> ویرایش اطلاعات
        </button>
        <button className="rounded-lg border border-gray-200 p-2 text-gray-400">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* کارت اطلاعات هدر */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex flex-wrap items-center gap-8">
          {/* اطلاعات بیمار */}
          <div className="flex items-center gap-3">
            <Image
              src="/image/user.PNG"
              alt="User"
              width={50}
              height={50}
              unoptimized
              className="rounded-full object-cover"
            />

            <div>
              <div className="flex items-center gap-1.5">

                <span className="text-base font-bold text-gray-900">
                  نسترن موسوی
                </span>
                <Star className="h-4 w-4 text-warning" />
              </div>

              <span className="mt-1 inline-block rounded-full bg-secondary-pink/40 px-2.5 py-0.5 text-[10px] text-pink-600">
                مراجعه‌کننده
              </span>
            </div>
          </div>


          {/* آمار */}
          <InfoStat label="کدملی" value="1234567890" />

          <InfoStat
            label="تاریخ تولد / سن"
            value="۱۳۷۵/۰۶/۱۵ - ۲۸ سال"
          />

          <InfoStat label="شماره تماس" value="09123456789" />

          <InfoStat label="آخرین مراجعه" value="۱۴۰۳/۰۳/۲۱" />

          <InfoStat
            label="وضعیت"
            custom={
              <span className="rounded-full bg-primary-light/20 px-2.5 py-0.5 text-[11px] text-primary-dark">
                فعال
              </span>
            }
          />

          <InfoStat label="بدهی جاری" value="۵۸۰,۰۰۰ تومان" valueTone="text-danger" />
        </div>
      </div>

      {/* تب‌ها */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4">
        <div className="flex min-w-max items-center gap-5 text-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 transition-colors ${activeTab === tab.key
                  ? "border-primary font-medium text-primary-dark"
                  : "border-transparent text-gray-500 hover:text-primary"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "info" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* ستون راست */}

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <MessageSquare className="h-4 w-4 text-primary-dark" /> چت و پیام‌ها
              </h3>
              <div className="space-y-3">
                {CHAT_MESSAGES.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-gray-700">{m.name}</span>
                        <span className="text-[9px] text-gray-300">{m.time}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-gray-500">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark">
                مشاهده همه پیام‌ها
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Paperclip className="h-4 w-4 text-primary-dark" /> فایل‌های مرتبط
              </h3>
              <div className="space-y-3">
                {RELATED_FILES.map((f) => (
                  <div key={f.name} className="flex items-center gap-2.5">
                    <FilePlus2 className="h-4 w-4 shrink-0 text-gray-300" />
                    <div>
                      <div className="text-[11px] font-medium text-gray-700">{f.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {f.type} · {f.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-[11px] text-primary-dark">مشاهده همه فایل‌ها</button>
            </div>
          </div>


          {/* ستون وسط */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary-dark" />
                <h3 className="text-xs font-bold text-gray-800">یادداشت آخرین جلسه</h3>
              </div>

              <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    const url = prompt("لینک را وارد کنید:");
                    if (url) applyFormat("createLink", url);
                  }}
                  className="rounded p-1 text-gray-400 hover:text-gray-600"
                >
                  <Link2 className="h-3.5 w-3.5" />
                </button>
                {toolbarBtn(<AlignRight className="h-3.5 w-3.5" />, "justifyRight")}
                {toolbarBtn(<AlignLeft className="h-3.5 w-3.5" />, "justifyLeft")}
                {toolbarBtn(<List className="h-3.5 w-3.5" />, "insertUnorderedList")}
                {toolbarBtn(<Bold className="h-3.5 w-3.5" />, "bold")}
                {toolbarBtn(<Italic className="h-3.5 w-3.5" />, "italic")}
                {toolbarBtn(<Underline className="h-3.5 w-3.5" />, "underline")}
              </div>

              <div
                ref={noteRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setNote(e.currentTarget.innerHTML)}
                onKeyUp={updateActiveFormats}
                onMouseUp={updateActiveFormats}
                dangerouslySetInnerHTML={{ __html: note }}
                dir="rtl"
                className="min-h-[100px] w-full resize-none text-xs leading-relaxed text-gray-600 outline-none"
              />

              <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2">
                <span className="text-[10px] text-gray-300">
                  ثبت توسط: دکتر سارا محمدی - ۱۴۰۳/۰۳/۲۱ - ۱۱:۳۰
                </span>
                <button className="rounded-lg bg-primary px-4 py-1.5 text-[11px] font-medium text-white hover:bg-primary-dark">
                  ذخیره یادداشت
                </button>
              </div>
         
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 text-xs font-bold text-gray-800">خدمات آخیر</h3>
            <table className="w-full text-right text-[11px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="pb-2 font-medium">خدمت</th>
                  <th className="pb-2 font-medium">تاریخ انجام</th>
                  <th className="pb-2 font-medium">متخصص</th>
                  <th className="pb-2 font-medium">وضعیت</th>
                  <th className="pb-2 font-medium">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_SERVICES.map((s) => (
                  <tr key={s.name} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">{s.name}</td>
                    <td className="py-2 text-gray-500">{s.date}</td>
                    <td className="py-2 text-gray-500">{s.doctor}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-primary-dark">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-700">{s.amount} تومان</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-3 text-[11px] text-primary-dark">مشاهده همه خدمات</button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Images className="h-4 w-4 text-primary-dark" /> تصاویر قبل و بعد
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {GALLERY.map((g) => (
                <div key={g.title}>
                  <div className={`relative h-16 overflow-hidden rounded-lg bg-gradient-to-br ${g.tone}`}>
                    <span className="absolute right-1 top-1 rounded bg-white/90 px-1 text-[8px] text-gray-600">قبل</span>
                    <span className="absolute left-1 top-1 rounded bg-white/90 px-1 text-[8px] text-gray-600">بعد</span>
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-gray-600">{g.title}</div>
                  <div className="text-[9px] text-gray-400">{g.date}</div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-[11px] text-primary-dark">مشاهده همه تصاویر</button>
          </div>
        </div>

          {/* ستون چپ */}

      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center ">
            <CalendarClock className="h-4 w-4 text-primary-dark" />

            <h3 className="text-xs font-bold text-gray-800 mr-2">نوبت بعدی</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <CalendarDays className="h-3.5 w-3.5 text-gray-300" /> ۱۴۰۳/۰۳/۲۷ ساعت ۱۰:۳۰
          </div>
          <div className="mt-1 text-xs text-gray-400">مزوتراپی مو</div>
          <button className="mt-3 w-full rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark">
            رزرو / ویرایش نوبت
          </button>
          <button className="mt-2 w-full text-[11px] text-gray-400">مشاهده تمام نوبت‌ها</button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary-dark" />
            <h3 className="text-xs font-bold text-gray-800">هشدارها و اطلاعات مهم</h3>
          </div>
          <div className="space-y-2">
            {IMPORTANT_ALERTS.map((a) => (
              <div key={a.text} className="flex items-center gap-2 text-xs text-gray-600">
                <span className={`h-2 w-2 shrink-0 rounded-full ${a.tone}`} />
                {a.text}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <PencilLine className="h-4 w-4 text-primary-dark" />
            <h3 className="text-xs font-bold text-gray-800">یادداشت سریع</h3>
          </div>
          <textarea
            placeholder="یادداشت سریع خود را بنویسید..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none placeholder:text-gray-300"
          />
          <button className="mt-2 w-full rounded-lg border border-gray-200 py-2 text-[11px] text-gray-600">
            ثبت یادداشت
          </button>
        </div>
      </div>

    </div>
  ) : (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
      محتوای «{TABS.find((t) => t.key === activeTab)?.label}» به‌زودی اینجا نمایش داده می‌شود.
    </div>
  )
}

<p className="flex items-center justify-center gap-1.5 pb-2 pt-4 text-center text-xs text-gray-400">
  <ShieldCheck className="h-3.5 w-3.5" />
  اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
</p>
    </div >
  );
}

function InfoStat({
  label,
  value,
  custom,
  valueTone,
  className = "",
}: {
  label: string;
  value?: string;
  custom?: React.ReactNode;
  valueTone?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md ${className}`}
    >
      <div className="text-[11px] font-medium text-gray-400">
        {label}
      </div>

      {custom ?? (
        <div className={`mt-2 text-sm  ${valueTone ?? "text-gray-800"}`}>
          {value}
        </div>
      )}
    </div>
  );
}
