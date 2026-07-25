"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  CalendarPlus,
  UserRound,
  Clock3,
  RefreshCcw,
  Video,
  UserPlus,
  Search,
  MapPin,
  Stethoscope,
  Layers,
  Sparkles,
  CalendarDays,
  DoorOpen,
  StickyNote,
  Wallet,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from "react-multi-date-picker";


const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const CALENDAR_GRID = [
  [27, 28, 29, 30, 31, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
];
const CURRENT_MONTH_RANGE = [3, 30]; // روزهای متعلق به خرداد در این گرید

const AVAILABLE_SLOTS = ["۰۹:۰۰", "۰۹:۳۰", "۱۰:۰۰", "۱۰:۳۰", "۱۱:۰۰", "۱۱:۳۰"];

const APPOINTMENT_TYPES = [
  { key: "in-person", icon: UserRound, tone: "text-primary-dark bg-primary-light/20", title: "حضوری", desc: "مراجعه به کلینیک" },
  { key: "online", icon: Video, tone: "text-blue-600 bg-secondary-blue/40", title: "آنلاین", desc: "مشاوره و خدمات آنلاین" },
  { key: "followup", icon: RefreshCcw, tone: "text-purple-600 bg-secondary-purple/40", title: "پیگیری", desc: "نوبت پیگیری و چکاپ" },
];

export default function NewAppointmentPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [selectedDay, setSelectedDay] = useState(23);
  const [selectedSlot, setSelectedSlot] = useState("۰۹:۳۰");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [smsReminder, setSmsReminder] = useState(true);
  const [date, setDate] = useState<any>(new Date());

  return (
    <div className="space-y-4">
      {/* breadcrumb */}
      <div className="text-xs text-gray-400">
        <Link href={`/clinic/${clinicSlug}/calendar`} className="hover:text-primary-dark">نوبت‌ها</Link>
        <span className="mx-1">‹</span>
        <span className="text-gray-600">ثبت نوبت جدید</span>
      </div>

      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          ثبت نوبت جدید <CalendarPlus className="h-5 w-5 text-primary-dark" />
        </h1>
        <p className="mt-1 text-sm text-gray-400">لطفاً اطلاعات نوبت را تکمیل کنید.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* ستون کناری */}
        <div className="space-y-4 lg:order-2">
          {/* تقویم کوچک */}
          <div className="rounded-2xl border border-gray-100 bg-white ">
            <Calendar
              value={date}
              onChange={setDate}
              calendar={persian}
              locale={persian_fa}
              shadow={false}
              className="clinic-calendar "
            />
          </div>


          {/* اطلاعات مراجع */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <UserRound className="h-4 w-4 text-primary-dark" /> اطلاعات مراجع
            </h3>
            <div className="flex items-center gap-2.5">
              <Image
                src="/image/user.PNG"
                alt="User"
                width={30}
                height={30}
                unoptimized
                className="rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-semibold text-gray-800">مریم احمدی‌فر</div>
                <div className="text-[10px] text-gray-400" dir="ltr">0912 345 6789</div>
                <div className="text-[10px] text-gray-400">کد مراجع: ۳۴۵۶</div>
              </div>
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark">
              <ChevronRight className="h-3 w-3" /> مشاهده پروفایل کامل
            </button>
          </div>

          {/* ساعات در دسترس */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Clock3 className="h-4 w-4 text-primary-dark" /> ساعت‌های در دسترس
            </h3>
            <div className="space-y-2">
              {AVAILABLE_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full rounded-xl border py-2 text-xs ${selectedSlot === slot
                    ? "border-primary bg-primary-light/10 font-medium text-primary-dark"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button className="mt-2 flex w-full items-center justify-center gap-1 text-[11px] text-gray-400">
              نمایش ادامه <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* فرم اصلی */}
        <div className="space-y-4 lg:order-1 lg:col-span-3">
          {/* نوع نوبت */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-gray-800">نوع نوبت</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {APPOINTMENT_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setAppointmentType(t.key)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${appointmentType === t.key ? "border-primary bg-primary-light/5" : "border-gray-100"
                    }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${t.tone}`}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{t.title}</div>
                  <div className="text-[11px] text-gray-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* فرم */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs text-gray-600">
                  مراجع <span className="text-danger">*</span>
                </label>
                <button className="flex items-center gap-1 text-[11px] font-medium text-primary-dark">
                  <UserPlus className="h-3.5 w-3.5" /> بیمار جدید
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  placeholder="جستجو با نام، موبایل یا کد ملی..."
                  className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300"
                />
                <Search className="h-4 w-4 shrink-0 text-gray-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField label="پزشک / متخصص" required placeholder="انتخاب پزشک / متخصص" icon={Stethoscope} />
              <SelectField label="شعبه کلینیک" required placeholder="انتخاب شعبه" icon={MapPin} />
              <SelectField label="خدمت اصلی" required placeholder="انتخاب خدمت" icon={Sparkles} />
              <SelectField label="خدمت فرعی (اختیاری)" placeholder="انتخاب خدمت فرعی" icon={Layers} />
              <SelectField label="ساعت نوبت" required placeholder="انتخاب ساعت" icon={Clock3} />
              <TextField
                label="تاریخ نوبت"
                required
                defaultValue="۱۴۰۵/۰۳/۲۳"
                icon={CalendarDays}
                type="date"
              />
              <SelectField label="مدت زمان" required placeholder="انتخاب مدت زمان" />

              <div>
                <label className="mb-1.5 block text-xs text-gray-600">یادآوری پیامکی</label>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
                  <span className="text-[11px] text-gray-400">ارسال یادآوری خودکار برای مراجع</span>
                  <button
                    onClick={() => setSmsReminder((v) => !v)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${smsReminder ? "bg-primary" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${smsReminder ? "right-0.5" : "right-4"}`} />
                  </button>
                </div>
              </div>

              <SelectField label="وضعیت نوبت" required placeholder="تایید شده" icon={Check} defaultSelected />
              <SelectField label="اتاق / منبع (اختیاری)" placeholder="انتخاب اتاق یا منبع" />
            </div>

            <div className="mt-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-gray-600">
                <StickyNote className="h-3.5 w-3.5" /> یادداشت‌ها (اختیاری)
              </label>
              <textarea
                rows={3}
                placeholder="توضیحات یا نکات مرتبط با این نوبت..."
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none placeholder:text-gray-300"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <TextField label="قیمت تخمینی (تومان)" defaultValue="۲,۸۵۰,۰۰۰" icon={Wallet} />
              <TextField label="مبلغ پیش‌پرداخت (تومان)" defaultValue="۵۰۰,۰۰۰" icon={CalendarDays} />
              <SelectField label="وضعیت پرداخت" placeholder="پرداخت نشده" icon={Wallet} defaultSelected />
            </div>
          </div>

          {/* اکشن‌ها */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-dark">
              <Check className="h-4 w-4" /> ثبت نوبت
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:bg-gray-50">
              <X className="h-4 w-4" /> انصراف
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  placeholder,
  icon: Icon,
  defaultSelected,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  icon?: typeof Clock3;
  defaultSelected?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
        <span className={`text-xs ${defaultSelected ? "font-medium text-primary-dark" : "text-gray-300"}`}>
          {placeholder}
        </span>
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-gray-300" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-300" />}
      </div>
    </div>
  );
}

function TextField({
  label,
  required,
  defaultValue,
  icon: Icon,
  type = "text",
}: {
  label: string;
  required?: boolean;
  defaultValue?: string;
  icon?: typeof Clock3;
  type?: "text" | "date";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-gray-600">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5">
        {type === "date" ? (
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={defaultValue}
            inputClass="w-full bg-transparent text-xs text-gray-700 outline-none"
            containerClassName="w-full"
          />
        ) : (
          <input
            type="text"
            defaultValue={defaultValue}
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        )}

        {Icon && (
          <Icon className="h-3.5 w-3.5 shrink-0 text-gray-300" />
        )}
      </div>
    </div>
  );
}
