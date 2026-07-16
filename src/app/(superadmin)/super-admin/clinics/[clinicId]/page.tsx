"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Pencil,
  Ban,
  Users,
  UserRound,
  CalendarClock,
  Wallet,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Video,
  MessageCircle,
  Images,
  FolderHeart,
  ScanLine,
} from "lucide-react";

const MOCK_CLINIC = {
  name: "کلینیک زیبایی آرامش",
  phone: "021-88880000",
  email: "info@aramesh-clinic.ir",
  address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۴",
  manager: "سارا موسوی",
  joined: "۱۴۰۲/۰۲/۱۰",
  plan: "پلن حرفه‌ای",
  planTone: "bg-primary-light/20 text-primary-dark",
  renewal: "۱۴۰۳/۰۷/۱۵",
  status: "فعال",
};

const KPIS = [
  { icon: Users, tone: "text-primary-dark bg-primary-light/20", label: "کاربران فعال", value: "۱۲۶" },
  { icon: UserRound, tone: "text-purple-600 bg-secondary-purple/40", label: "مراجعین ثبت‌شده", value: "۹۸۴" },
  { icon: CalendarClock, tone: "text-blue-600 bg-secondary-blue/40", label: "نوبت‌های این ماه", value: "۳۴۰" },
  { icon: Wallet, tone: "text-pink-600 bg-secondary-pink/40", label: "درآمد کل", value: "۹۸,۰۰۰,۰۰۰ ت" },
];

const STAFF = [
  { name: "سارا موسوی", role: "مدیر کلینیک" },
  { name: "دکتر آرش نیکنام", role: "پزشک" },
  { name: "نگار حسینی", role: "منشی و پذیرش" },
  { name: "دکتر رضا کاویانی", role: "پزشک" },
];

const CLINIC_MODULES = [
  { icon: CalendarClock, name: "نوبت‌دهی هوشمند", enabled: true },
  { icon: UserRound, name: "پنل بیمار", enabled: true },
  { icon: FolderHeart, name: "پرونده مرکزی بیمار", enabled: true },
  { icon: Images, name: "عکس‌های قبل و بعد", enabled: true },
  { icon: MessageCircle, name: "چت و پیام‌ها", enabled: true },
  { icon: ScanLine, name: "پذیرش دیجیتال", enabled: true },
  { icon: Video, name: "تماس تصویری", enabled: false },
];

const RECENT_TRANSACTIONS = [
  { id: "TRX-10248", type: "تمدید اشتراک", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۴/۱۵", status: "موفق" },
  { id: "TRX-10190", type: "تمدید اشتراک", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۳/۱۵", status: "موفق" },
  { id: "TRX-10132", type: "تمدید اشتراک", amount: "۹,۸۰۰,۰۰۰", date: "۱۴۰۳/۰۲/۱۵", status: "موفق" },
];

export default function ClinicDetailPage({
  params,
}: {
  params: Promise<{ clinicId: string }>;
}) {
  const { clinicId } = use(params);
  const [moduleStates, setModuleStates] = useState(
    Object.fromEntries(CLINIC_MODULES.map((m) => [m.name, m.enabled]))
  );
  const [suspended, setSuspended] = useState(false);

  const toggleModule = (name: string) => {
    setModuleStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      {/* بازگشت */}
      <Link href="/super-admin/clinics" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-primary-dark">
        <ArrowRight className="h-4 w-4" /> بازگشت به لیست کلینیک‌ها
      </Link>

      {/* هدر کلینیک */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 rounded-full bg-gray-100" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{MOCK_CLINIC.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${MOCK_CLINIC.planTone}`}>
                {MOCK_CLINIC.plan}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400" dir="ltr">
              <span dir="rtl">شناسه:</span> {clinicId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <Pencil className="h-3.5 w-3.5" /> ویرایش اطلاعات
          </button>
          <button
            onClick={() => setSuspended((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium ${
              suspended
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-red-50 text-danger hover:bg-red-100"
            }`}
          >
            <Ban className="h-3.5 w-3.5" /> {suspended ? "فعال‌سازی مجدد" : "تعلیق کلینیک"}
          </button>
        </div>
      </div>

      {/* KPI ها */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${k.tone}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{k.value}</div>
              <div className="text-xs text-gray-400">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* اطلاعات کلی + کارکنان */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-800">اطلاعات کلی</h2>
            <div className="space-y-3 text-xs">
              <InfoRow icon={UserRound} label="مدیر کلینیک" value={MOCK_CLINIC.manager} />
              <InfoRow icon={Phone} label="تلفن" value={MOCK_CLINIC.phone} dir="ltr" />
              <InfoRow icon={Mail} label="ایمیل" value={MOCK_CLINIC.email} dir="ltr" />
              <InfoRow icon={MapPin} label="آدرس" value={MOCK_CLINIC.address} />
              <InfoRow icon={CalendarClock} label="تاریخ عضویت" value={MOCK_CLINIC.joined} />
              <InfoRow icon={CreditCard} label="تمدید بعدی اشتراک" value={MOCK_CLINIC.renewal} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-800">کارکنان کلینیک</h2>
            <div className="space-y-3">
              {STAFF.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5 text-xs">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />
                  <div>
                    <div className="font-medium text-gray-700">{s.name}</div>
                    <div className="text-[11px] text-gray-400">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ماژول‌ها + تراکنش‌ها */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-800">ماژول‌های فعال این کلینیک</h2>
            <div className="space-y-3">
              {CLINIC_MODULES.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-gray-700">
                    <m.icon className="h-4 w-4 text-primary-dark" /> {m.name}
                  </span>
                  <button
                    onClick={() => toggleModule(m.name)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      moduleStates[m.name] ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        moduleStates[m.name] ? "right-0.5" : "right-4"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-800">تراکنش‌های اخیر</h2>
            <div className="space-y-3">
              {RECENT_TRANSACTIONS.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-gray-700">{t.type}</div>
                    <div className="text-[10px] text-gray-400" dir="ltr">
                      {t.id} · {t.date}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-700">{t.amount} تومان</div>
                    <div className="text-[10px] text-primary-dark">{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-gray-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="text-left text-gray-700" dir={dir}>
        {value}
      </span>
    </div>
  );
}
