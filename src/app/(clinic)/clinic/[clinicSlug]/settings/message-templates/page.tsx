"use client";

import { useState } from "react";

import {
Plus,
Zap,
Info,
Send,
CheckCircle2,
Smile,
Bold,
Italic,
Underline,
Link2,
List,
AlignRight,
ChevronDown,
} from "lucide-react";

const CATEGORIES = [
{ label: "همه قالب‌ها", count: 62 },
{ label: "یادآوری نوبت", count: 15 },
{ label: "خوش‌آمدگویی", count: 8 },
{ label: "تبریک تولد", count: 6 },
{ label: "لغو نوبت", count: 7 },
{ label: "پیگیری پس از خدمت", count: 13 },
{ label: "تبلیغاتی و اطلاع‌رسانی", count: 13 },
];

const TEMPLATES = [
{
name: "یادآوری نوبت - ۲۴ ساعت قبل",
tag: "یادآوری نوبت",
preview: "سلام [نام بیمار] عزیز، نوبت شما نزد [نام پزشک]...",
active: true,
},
{
name: "پیام خوش‌آمدگویی",
tag: "خوش‌آمدگویی",
preview: "سلام [نام بیمار] عزیز، به کلینیک زیبایی ما خوش آمدید.",
},
{
name: "تبریک تولد",
tag: "تبریک تولد",
preview: "تولدت مبارک [نام بیمار] عزیز 🎉 از طرف تیم...",
},
{
name: "لغو نوبت توسط کلینیک",
tag: "لغو نوبت",
preview: "سلام [نام بیمار]، نوبت شما در تاریخ [تاریخ نوبت]...",
},
{
name: "پیگیری بعد از خدمت",
tag: "پیگیری بعد از خدمت",
preview: "سلام [نام بیمار]، امیدواریم از خدمات ما راضی بوده...",
},
{
name: "پیشنهاد ویژه فصل",
tag: "تبلیغاتی",
preview: "فرصت ویژه برای شما [نام بیمار]! خزی از...",
},
];

const VARIABLES = [
"نام بیمار",
"نام پزشک",
"تاریخ نوبت",
"ساعت نوبت",
"نام کلینیک",
"شماره تماس",
"شماره‌ی پرداخت",
"کد تخفیف",
];

const HISTORY = [
{
recipient: "سارا محمدی",
cost: "۱۵۰ تومان",
status: "تحویل شده",
statusTone:
"bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light",
time: "۱۴۰۳/۰۳/۲۴ - ۱۰:۰۰",
},
{
recipient: "نگین محمدی",
cost: "۱۵۰ تومان",
status: "تحویل شده",
statusTone:
"bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary-light",
time: "۱۴۰۳/۰۳/۲۴ - ۱۰:۰۰",
},
{
recipient: "الناز قربانی",
cost: "۰ تومان",
status: "ناموفق",
statusTone: "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-400",
time: "۱۴۰۳/۰۳/۲۴ - ۱۰:۰۱",
},
];

const STATS = [
{
icon: Send,
tone: "text-primary-dark dark:text-primary-light",
value: "۱,۲۴۸",
label: "ارسال شده",
},
{
icon: CheckCircle2,
tone: "text-primary-dark dark:text-primary-light",
value: "۴,۱۸۰",
label: "تحویل موفق",
},
{
icon: Zap,
tone: "text-purple-600 dark:text-purple-400",
value: "۹۴.۸٪",
label: "نرخ تحویل",
},
{
icon: Send,
tone: "text-blue-600 dark:text-blue-400",
value: "۸۶",
label: "پاسخ دریافت شده",
},
{
icon: Smile,
tone: "text-pink-600 dark:text-pink-400",
value: "۷.۲٪",
label: "نرخ پاسخ‌گویی",
},
];

export default function MessageTemplatesPage() {
const [enabled, setEnabled] = useState(true);

const [rules, setRules] = useState({
disableHolidays: true,
limitRepeat: false,
shortLink: true,
});

const [timing, setTiming] = useState<"instant" | "scheduled">("instant");

const [sendOn, setSendOn] = useState({
confirm: false,
reminder24: true,
reminder2: false,
reschedule: false,
cancel: false,
});

return ( <div className="space-y-4 text-gray-900 dark:text-gray-100">
{/* Header */} <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> <div> <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
قالب‌های پیامک و اتوماسیون </h1>

      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        مدیریت قالب‌های پیامکی، قوانین ارسال خودکار و گردش‌های ارتباطی
      </p>
    </div>

    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
        <Zap className="h-3.5 w-3.5" />
        اتوماسیون جدید
      </button>

      <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-medium text-white transition hover:bg-primary-dark">
        <Plus className="h-3.5 w-3.5" />
        قالب جدید
      </button>
    </div>
  </div>

  {/* Main editor */}
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
    {/* SMS Preview */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
        <Info className="h-3.5 w-3.5 text-gray-300 dark:text-gray-500" />
        پیش‌نمایش پیامک
      </h3>

      <div className="mx-auto w-full max-w-[220px] rounded-[1.5rem] border-4 border-gray-900 bg-white p-3 dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-2 flex items-center justify-between text-[9px] text-gray-400 dark:text-gray-500">
          <span>11:30</span>
          <span dir="ltr">3000012345678</span>
        </div>

        <div className="rounded-xl rounded-tr-sm bg-gray-100 p-2.5 text-[9px] leading-relaxed text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          سلام سارا محمدی عزیز 🌸
          <br />
          یادآوری می‌کنیم که نوبت شما نزد دکتر پزشک نزد
          <br />
          در تاریخ ۱۴۰۳/۰۳/۲۶ ساعت ۱۰:۰۰ می‌باشد.
          <br />
          لطفاً در صورت عدم امکان حضور، با ما تماس بگیرید.
          <br />
          <br />
          منتظر دیدار شما هستیم 💚
          <br />
          کلینیک زیبایی نازنین
          <br />
          021-12345678
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="مثال: 0912 345 6709"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-600"
        />

        <button className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-primary-dark">
          ارسال تست
        </button>
      </div>

      <div className="mt-1 text-center text-[9px] text-gray-300 dark:text-gray-600">
        ارسال تست به شماره
      </div>
    </div>

    {/* Template Editor */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
          ویرایش قالب پیامک
        </h3>

        <button
          onClick={() => setEnabled((v) => !v)}
          className="flex items-center gap-2"
        >
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            فعال
          </span>

          <span
            className={`relative h-5 w-9 rounded-full transition-colors ${
              enabled
                ? "bg-primary"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                enabled ? "right-0.5" : "right-4"
              }`}
            />
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] text-gray-500 dark:text-gray-400">
            نام قالب
          </label>

          <input
            defaultValue="یادآوری نوبت - ۲۴ ساعت قبل"
            className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] text-gray-700 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] text-gray-500 dark:text-gray-400">
            دسته‌بندی
          </label>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            یادآوری نوبت
            <ChevronDown className="h-3 w-3 text-gray-300 dark:text-gray-500" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-[10px] text-gray-500 dark:text-gray-400">
          متن پیامک
        </label>

        <div className="mb-1.5 flex items-center gap-2 border-b border-gray-100 pb-1.5 text-gray-300 dark:border-gray-800 dark:text-gray-500">
          <Link2 className="h-3.5 w-3.5" />
          <AlignRight className="h-3.5 w-3.5" />
          <List className="h-3.5 w-3.5" />
          <Bold className="h-3.5 w-3.5" />
          <Italic className="h-3.5 w-3.5" />
          <Underline className="h-3.5 w-3.5" />

          <button className="mr-auto flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[9px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
            افزودن متغیر
            <ChevronDown className="h-2.5 w-2.5" />
          </button>
        </div>

        <textarea
          rows={7}
          defaultValue={`سلام [نام بیمار] عزیز 🌸


یادآوری می‌کنیم که نوبت شما نزد [نام پزشک]
در تاریخ [تاریخ نوبت] ساعت [ساعت نوبت] می‌باشد.
لطفاً در صورت عدم امکان حضور، با ما تماس بگیرید.

منتظر دیدار شما هستیم 💚
[نام کلینیک]
[شماره تماس]`}
className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[11px] leading-relaxed text-gray-700 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
/>

        <div className="mt-1 text-[9px] text-gray-400 dark:text-gray-500">
          تعداد کاراکتر: ۲۶۵ | تعداد پیامک: ۲
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-[10px] font-medium text-gray-600 dark:text-gray-300">
          متغیرهای قابل استفاده
        </label>

        <div className="flex flex-wrap gap-1.5">
          {VARIABLES.map((v) => (
            <span
              key={v}
              className="rounded-full bg-gray-50 px-2.5 py-1 text-[9px] text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-50 pt-3 dark:border-gray-800 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
            ارسال در صورت
          </div>

          <div className="space-y-1 text-[10px] text-gray-600 dark:text-gray-400">
            {Object.entries({
              confirm: "تایید نوبت",
              reminder24: "یادآوری (۲۴ ساعت قبل)",
              reminder2: "یادآوری (۲ ساعت قبل)",
              reschedule: "جابه‌جایی نوبت",
              cancel: "لغو نوبت",
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-1.5"
              >
                <input
                  type="checkbox"
                  checked={sendOn[key as keyof typeof sendOn]}
                  onChange={() =>
                    setSendOn((p) => ({
                      ...p,
                      [key]:
                        !p[key as keyof typeof sendOn],
                    }))
                  }
                  className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                />

                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
            زمان ارسال
          </div>

          <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={timing === "instant"}
                onChange={() => setTiming("instant")}
                className="h-3 w-3 text-primary dark:bg-gray-800"
              />
              ارسال آنی
            </label>

            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={timing === "scheduled"}
                onChange={() => setTiming("scheduled")}
                className="h-3 w-3 text-primary dark:bg-gray-800"
              />
              ارسال در زمان مشخص
            </label>

            {timing === "scheduled" && (
              <div className="mr-4 flex gap-1.5">
                <input
                  type="time"
                  defaultValue="10:00"
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />

                <input
                  type="text"
                  defaultValue="۱۴۰۳/۰۳/۲۵"
                  className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Categories */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
        دسته‌بندی قالب‌ها
      </h3>

      <div className="space-y-1">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.label}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[11px] transition ${
              i === 0
                ? "bg-primary-light/15 font-medium text-primary-dark dark:bg-primary/15 dark:text-primary-light"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {c.label}
            <span className="text-gray-400 dark:text-gray-500">
              {c.count.toLocaleString("fa-IR")}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 px-2.5 py-2 dark:border-gray-700">
        <input
          type="text"
          placeholder="جستجوی قالب‌ها..."
          className="w-full bg-transparent text-[11px] text-gray-700 outline-none placeholder:text-gray-300 dark:text-gray-200 dark:placeholder:text-gray-600"
        />
      </div>

      <div className="mt-3 space-y-2">
        {TEMPLATES.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl border p-2.5 transition ${
              t.active
                ? "border-primary bg-primary-light/5 dark:border-primary dark:bg-primary/10"
                : "border-gray-100 dark:border-gray-800"
            }`}
          >
            <span className="mb-1 inline-block rounded bg-gray-50 px-1.5 py-0.5 text-[9px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {t.tag}
            </span>

            <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
              {t.name}
            </div>

            <p className="truncate text-[9px] text-gray-400 dark:text-gray-500">
              {t.preview}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-3 w-full rounded-xl border border-gray-200 py-2 text-[11px] text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
        مشاهده همه قالب‌ها
      </button>
    </div>
  </div>

  {/* Bottom sections */}
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    {/* Sending settings */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
        تنظیمات ارسال و قوانین
      </h3>

      <div className="space-y-3 text-[11px]">
        <ToggleRow
          label="فعال بودن قالب"
          checked={rules.disableHolidays}
          onChange={(v) =>
            setRules((p) => ({
              ...p,
              disableHolidays: v,
            }))
          }
        />

        <ToggleRow
          label="عدم ارسال در روزهای تعطیل"
          checked={rules.limitRepeat}
          onChange={(v) =>
            setRules((p) => ({
              ...p,
              limitRepeat: v,
            }))
          }
        />

        <ToggleRow
          label="محدودیت ارسال تکراری"
          checked={rules.shortLink}
          onChange={(v) =>
            setRules((p) => ({
              ...p,
              shortLink: v,
            }))
          }
        />

        <ToggleRow
          label="استفاده از لینک کوتاه"
          checked={enabled}
          onChange={setEnabled}
        />
      </div>
    </div>

    {/* Stats */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200">
          آمار و عملکرد قالب
        </h3>

        <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[9px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
          ۳۰ گذشته
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
          >
            <s.icon
              className={`mx-auto mb-1 h-3.5 w-3.5 ${s.tone}`}
            />

            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {s.value}
            </div>

            <div className="text-[8px] text-gray-400 dark:text-gray-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* History */}
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">
        تاریخچه ارسال‌های اخیر
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-[10px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800">
              <th className="pb-1.5 font-medium">هزینه</th>
              <th className="pb-1.5 font-medium">وضعیت</th>
              <th className="pb-1.5 font-medium">گیرنده</th>
              <th className="pb-1.5 font-medium">
                تاریخ و زمان
              </th>
            </tr>
          </thead>

          <tbody>
            {HISTORY.map((h, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 dark:border-gray-800"
              >
                <td className="py-1.5 text-gray-500 dark:text-gray-400">
                  {h.cost}
                </td>

                <td className="py-1.5">
                  <span
                    className={`rounded-full px-1.5 py-0.5 ${h.statusTone}`}
                  >
                    {h.status}
                  </span>
                </td>

                <td className="py-1.5 text-gray-700 dark:text-gray-300">
                  {h.recipient}
                </td>

                <td className="py-1.5 text-gray-400 dark:text-gray-500">
                  {h.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-2 text-[10px] text-primary-dark dark:text-primary-light">
        مشاهده همه تاریخچه‌ها
      </button>
    </div>
  </div>
</div>


);
}

function ToggleRow({
label,
checked,
onChange,
}: {
label: string;
checked: boolean;
onChange: (v: boolean) => void;
}) {
return ( <div className="flex items-center justify-between"> <span className="text-gray-600 dark:text-gray-400">{label}</span>


  <button
    onClick={() => onChange(!checked)}
    className={`relative h-5 w-9 rounded-full transition-colors ${
      checked
        ? "bg-primary"
        : "bg-gray-200 dark:bg-gray-700"
    }`}
  >
    <span
      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
        checked ? "right-0.5" : "right-4"
      }`}
    />
  </button>
</div>


);
}
