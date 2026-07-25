"use client";

import { use } from "react";
import Link from "next/link";
import {
  MoreVertical,
  ArrowRight,
  CalendarClock,
  Globe,
  Clock3,
  CalendarDays,
  Sparkles,
  Stethoscope,
  Video,
  BellRing,
  UserX,
  CheckCircle2,
  XCircle,
  CalendarCog,
  Bell,
  MessageCircle,
  Mail,
  Plus,
  Wallet,
  Receipt,
  StickyNote,
  Pencil,
  UserRound,
  Phone,
  AtSign,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";




const STATUS_LEGEND = [
  { label: "در انتظار تایید", tone: "bg-amber-50 text-warning", dot: "bg-warning", desc: "نوبت در انتظار بررسی و تایید است" },
  { label: "تکمیل شده", tone: "bg-primary-light/20 text-primary-dark", dot: "bg-primary", desc: "ویزیت انجام و نوبت تکمیل شده است" },
  { label: "لغو شده", tone: "bg-red-50 text-danger", dot: "bg-danger", desc: "نوبت توسط کلینیک یا بیمار لغو شده است" },
  { label: "تغییر زمان", tone: "bg-secondary-purple/40 text-purple-600", dot: "bg-purple-500", desc: "زمان نوبت تغییر کرده است" },
  { label: "تایید شده", tone: "bg-primary-light/20 text-primary-dark", dot: "bg-primary", desc: "نوبت توسط کلینیک تایید و برنامه‌ریزی شده است" },
  { label: "عدم حضور", tone: "bg-secondary-pink/40 text-pink-600", dot: "bg-pink-500", desc: "بیمار در زمان مقرر حضور نداشته است" },
];

const STATUS_HISTORY = [
  { title: "تایید شده", tone: "text-primary-dark", dot: "bg-primary", by: "توسط دکتر سارا محمدی", time: null },
  { title: "تغییر زمان", tone: "text-purple-600", dot: "bg-purple-500", by: "توسط اپراتور پریسا احمدی", time: "از ۱۰:۰۰ به ۱۱:۳۰" },
  { title: "در انتظار تایید", tone: "text-warning", dot: "bg-warning", by: "توسط اپراتور پریسا احمدی", time: null },
  { title: "درخواست ثبت شده", tone: "text-gray-500", dot: "bg-gray-300", by: "از طریق وب‌سایت", time: null },
];

const REMINDERS = [
  { icon: BellRing, tone: "text-primary-dark bg-primary-light/20", title: "یادآوری پیامکی", status: "ارسال شد", statusTone: "text-primary-dark", time: "۱۰:۰۰ - ۲۳ خرداد ۱۴۰۳" },
  { icon: MessageCircle, tone: "text-primary-dark bg-primary-light/20", title: "یادآوری واتسابی", status: "ارسال شد", statusTone: "text-primary-dark", time: "۰۸:۰۰ - ۲۳ خرداد ۱۴۰۳" },
  { icon: Mail, tone: "text-danger bg-red-50", title: "یادآوری ایمیلی", status: "برنامه‌ریزی نشده", statusTone: "text-danger", time: "۱۲:۰۰ - ۲۴ خرداد ۱۴۰۳" },
];

const ACTIONS = [
  { icon: CalendarCog, label: "تغییر زمان" },
  { icon: XCircle, label: "لغو نوبت" },
  { icon: CheckCircle2, label: "علامت تکمیل شده" },
  { icon: UserX, label: "علامت عدم حضور" },
  { icon: BellRing, label: "ارسال یادآوری" },
  { icon: Video, label: "شروع ویزیت آنلاین" },
];

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ clinicSlug: string; appointmentId: string }>;
}) {
  const { clinicSlug, appointmentId } = use(params);

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-400">
        <Link href={`/clinic/${clinicSlug}/calendar`} className="hover:text-primary-dark">نوبت‌ها</Link>
        <span className="mx-1">‹</span>
        <span className="text-gray-600">جزئیات نوبت</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <CalendarClock className="h-5 w-5 text-primary-dark" /> جزئیات نوبت
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/clinic/${clinicSlug}/calendar`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
          >
            <ArrowRight className="h-3.5 w-3.5" /> بازگشت
          </Link>
          <button className="rounded-xl border border-gray-200 p-2 text-gray-400">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* کارت خلاصه نوبت */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <SummaryItem label="مراجع (بیمار)" value="نسترن موسوی" sub="0912 123 4567" avatar action="مشاهده پروفایل" />
          <SummaryItem icon={Stethoscope} label="پزشک / اپراتور" value="دکتر سارا محمدی" sub="پوست، مو و زیبایی" avatar />
          <SummaryItem icon={Sparkles} label="خدمت" value="پاکسازی هیدرادرم" sub="پوست و جوانسازی" />
          <SummaryItem icon={CalendarDays} label="تاریخ" value="۱۴۰۳/۰۳/۲۳ - چهارشنبه" />
          <SummaryItem icon={Clock3} label="ساعت" value="۱۱:۳۰ - ۶۰ دقیقه" />
          <SummaryItem custom={<span className="rounded-full bg-primary-light/20 px-2.5 py-1 text-[11px] text-primary-dark">تایید شده</span>} label="وضعیت نوبت" />
          <SummaryItem custom={<span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] text-danger">پرداخت نشده</span>} label="وضعیت پرداخت" />
          <SummaryItem icon={Globe} label="کانال نوبت" value="وب‌سایت" />

        </div>
      </div>

      {/* دکمه‌های اکشن */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ACTIONS.map((a) => {
          const isDanger =
            a.label === "لغو نوبت" || a.label === "علامت عدم حضور";

          return (
            <button
              key={a.label}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[11px] whitespace-nowrap transition
          ${isDanger
                  ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              <a.icon
                className={`h-3.5 w-3.5 shrink-0 ${isDanger ? "text-red-500" : "text-primary-dark"
                  }`}
              />
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ستون راست */}

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <UserRound className="h-4 w-4 text-primary-dark" /> پروفایل بیمار
            </h3>
            <div className="flex items-center gap-3">
              <Image
                src="/image/user.PNG"
                alt="User"
                width={30}
                height={30}
                unoptimized
                className="rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-bold text-gray-900">نسترن موسوی</div>
                <div className="text-[10px] text-gray-400">کد ملی: ۰۰۶۴۷۸۹۱۲۳</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3 text-gray-300" /> تاریخ تولد: ۱۳۷۶/۰۶/۱۵ (۲۸ سال)</div>
              <div className="flex items-center gap-1.5" dir="ltr"><Phone className="h-3 w-3 text-gray-300" /> 0912 123 4567</div>
              <div className="flex items-center gap-1.5" dir="ltr"><AtSign className="h-3 w-3 text-gray-300" /> nestornn@gmail.com</div>
            </div>
            <button className="mt-3 flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-[11px] text-gray-600">
              موجودی حساب: ۵۸۰,۰۰۰ تومان
              <Pencil className="h-3 w-3 text-gray-300" />
            </button>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-gray-50 p-2">
                <div className="text-xs font-bold text-gray-800">طلایی</div>
                <div className="text-[9px] text-gray-400">سطح وفاداری</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <div className="text-xs font-bold text-gray-800">۲</div>
                <div className="text-[9px] text-gray-400">نوبت‌های آینده</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <div className="text-xs font-bold text-gray-800">۲۸</div>
                <div className="text-[9px] text-gray-400">تعداد نوبت‌ها</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <ClipboardList className="h-4 w-4 text-primary-dark" /> نتیجه و خروجی ویزیت
            </h3>
            <div className="space-y-3">
              <SelectField label="وضعیت ویزیت" />
              <SelectField label="نتیجه درمان" />
              <SelectField label="محصولات تجویز شده" />
            </div>
            <button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-xs font-medium text-white hover:bg-primary-dark">
              ثبت نتیجه و تکمیل نوبت
            </button>
          </div>
        </div>


        {/* ستون وسط */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-4 text-xs font-bold text-gray-800">تاریخچه وضعیت نوبت</h3>
            <div className="relative space-y-4 border-r-2 border-gray-100 pr-4">
              {STATUS_HISTORY.map((h, i) => (
                <div key={i} className="relative">
                  <span className={`absolute -right-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${h.dot}`} />
                  <div className={`text-xs font-semibold ${h.tone}`}>{h.title}</div>
                  <div className="text-[10px] text-gray-400">{h.by}</div>
                  {h.time && <div className="text-[10px] text-gray-400">{h.time}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <StickyNote className="h-4 w-4 text-primary-dark" /> یادداشت‌ها
            </h3>
            <p className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
              بیمار سابقه حساسیت به رتینول دارد. در جلسه قبل واکنش خاصی مشاهده نشد.
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-300">
              <span>آخرین ویرایش: دکتر سارا محمدی - ۲۲ خرداد ۱۴۰۳ - ۱۱:۲۰</span>
              <button className="flex items-center gap-1 text-primary-dark">
                <Plus className="h-3 w-3" /> افزودن یادداشت
              </button>
            </div>
          </div>
        </div>

        {/* ستون چپ */}

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Bell className="h-4 w-4 text-primary-dark" /> یادآوری‌ها
            </h3>
            <div className="space-y-3">
              {REMINDERS.map((r) => (
                <div key={r.title} className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${r.tone}`}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium text-gray-700">{r.title}</div>
                    <div className="text-[10px] text-gray-400">{r.time}</div>
                  </div>
                  <span className={`text-[10px] font-medium ${r.statusTone}`}>{r.status}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark">
              <Plus className="h-3.5 w-3.5" /> ارسال یادآوری جدید
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Wallet className="h-4 w-4 text-primary-dark" /> پرداخت و صورت‌حساب
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">وضعیت پرداخت</span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-danger">پرداخت نشده</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">مبلغ خدمات</span>
                <span className="text-gray-700">۱,۴۸۰,۰۰۰ تومان</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">تخفیف</span>
                <span className="text-gray-700">۰ تومان</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                <span className="font-medium text-gray-600">مبلغ قابل پرداخت</span>
                <span className="font-bold text-gray-800">۱,۴۸۰,۰۰۰ تومان</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 rounded-lg bg-primary py-2 text-[11px] font-medium text-white hover:bg-primary-dark">دریافت پرداخت</button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-[11px] text-gray-600">
                <Receipt className="h-3.5 w-3.5" /> صدور فاکتور
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* راهنمای وضعیت */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-800">راهنمای وضعیت نوبت</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATUS_LEGEND.map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-50 p-3">
              <span className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${s.tone}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
              </span>
              <p className="text-[10px] leading-relaxed text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  sub,
  custom,
  avatar,
  action,
}: {
  icon?: typeof Globe;
  label: string;
  value?: string;
  sub?: string;
  custom?: React.ReactNode;
  avatar?: boolean;
  action?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] text-gray-400">{label}</div>
      {custom ?? (
        <div className="flex items-center gap-1.5">
          {avatar && <Image
            src="/image/user.PNG"
            alt="User"
            width={30}
            height={30}
            unoptimized
            className="rounded-full object-cover"
          />}
          {Icon && !avatar && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-300" />}
          <div>
            <div className="text-xs font-medium text-gray-700">{value}</div>
            {sub && <div className="text-[9px] text-gray-400">{sub}</div>}
          </div>
        </div>
      )}
      {action && (
        <button className="mt-1.5 rounded-lg bg-primary-light/15 px-2 py-1 text-[9px] text-primary-dark">{action}</button>
      )}
    </div>
  );
}

function SelectField({ label }: { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] text-gray-500">{label}</label>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
        <span className="text-xs text-gray-300">انتخاب کنید</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-300" />
      </div>
    </div>
  );
}
