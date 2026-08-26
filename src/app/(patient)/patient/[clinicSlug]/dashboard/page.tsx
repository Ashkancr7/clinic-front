"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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

import {
  getPatientDashboardSummary,
  getPatientAppointments,
  getPatientImages,
  getPatientConsents,
} from "@/lib/api/patient-portal";
import { queryKeys } from "@/lib/query/keys";

const TABS = [
  { key: "appointments", label: "نوبت‌های من", icon: CalendarCheck },
  { key: "records", label: "پرونده پزشکی", icon: FolderHeart },
  { key: "consents", label: "رضایت‌نامه‌ها", icon: ShieldCheck },
  { key: "gallery", label: "تصاویر من", icon: Images },
  { key: "files", label: "فایل‌ها", icon: FileText },
];

// این بخش‌ها هنوز منبع API مطمئنی ندارند (نه endpoint فایل عمومی برای بیمار، نه
// مفهوم مشخصی برای «پرونده‌های پزشکی» جدا از سوابق بالینی) — mock می‌مانند
const FILES = [
  { name: "گزارش آخرین جلسه مزوتراپی", type: "PDF", size: "۱.۲ مگابایت", date: "۱۴۰۳/۰۳/۲۸" },
  { name: "عکس راهنمای مراقبت بعد از تزریق", type: "JPG", size: "۸۰۰ کیلوبایت", date: "۱۴۰۳/۰۳/۲۸" },
  { name: "فاکتور خدمات", type: "PDF", size: "۲ مگابایت", date: "۱۴۰۳/۰۳/۲۵" },
  { name: "برنامه درمانی", type: "PDF", size: "۱.۱ مگابایت", date: "۱۴۰۳/۰۳/۲۰" },
];

const GALLERY_TONES = [
  "from-pink-200 to-pink-100",
  "from-primary-light/60 to-primary-light/20",
  "from-secondary-purple/60 to-secondary-purple/20",
  "from-secondary-blue/60 to-secondary-blue/20",
];

const QUICK_ACTIONS = [
  { icon: MessageSquare, tone: "bg-secondary-blue/40 text-blue-600", title: "پیام به پزشک", desc: "سوالات خود را بپرسید", href: "chat" },
  { icon: CalendarPlus, tone: "bg-primary-light/25 text-primary-dark", title: "درخواست نوبت", desc: "رزرو سریع و آسان", href: "appointments" },
  { icon: Headset, tone: "bg-secondary-purple/40 text-purple-600", title: "پشتیبانی", desc: "ما همیشه همراه شما هستیم", href: null },
  { icon: Gift, tone: "bg-secondary-pink/40 text-pink-600", title: "پیشنهاد ویژه", desc: "مشاهده تخفیف‌های فعال", href: null },
];

function formatJalaliDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "—";
  }
}
function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function PatientDashboardPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [activeTab, setActiveTab] = useState("gallery");

  const { data: summary } = useQuery({
    queryKey: queryKeys.patientPortal.dashboard(clinicSlug),
    queryFn: () => getPatientDashboardSummary(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: queryKeys.patientPortal.appointments(clinicSlug),
    queryFn: () => getPatientAppointments(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: images = [], isLoading: imagesLoading } = useQuery({
    queryKey: queryKeys.patientPortal.images(clinicSlug),
    queryFn: () => getPatientImages(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: consents = [], isLoading: consentsLoading } = useQuery({
    queryKey: queryKeys.patientPortal.consents(clinicSlug),
    queryFn: () => getPatientConsents(clinicSlug),
    enabled: !!clinicSlug,
  });

  const now = new Date();
  const upcoming = useMemo(
    () =>
      appointments
        .filter((a) => new Date(a.startTime) > now && a.status !== "cancelled")
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [appointments]
  );
  const completed = useMemo(() => appointments.filter((a) => a.status === "completed"), [appointments]);
  const nextAppointment = upcoming[0] ?? null;

  const STATS = [
    { icon: FileText, label: "فایل‌ها و تصاویر", value: images.length.toLocaleString("fa-IR"), iconClass: "bg-violet-50 text-violet-600" },
    { icon: CalendarCheck, label: "نوبت‌های آینده", value: upcoming.length.toLocaleString("fa-IR"), iconClass: "bg-blue-50 text-blue-600" },
    { icon: Heart, label: "خدمات انجام‌شده", value: completed.length.toLocaleString("fa-IR"), iconClass: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader clinicSlug={clinicSlug} />

      <div className="mx-auto max-w-9xl space-y-6 px-4 py-6 md:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-5 lg:grid-cols-[280px_1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <Image src="/image/user.PNG" alt="User" width={70} height={70} unoptimized className="rounded-full object-cover" />
            <div className="text-right">
              <h1 className="text-base font-bold text-gray-900">سلام {summary?.fullName ?? ""} عزیز</h1>
              <p className="mt-1 max-w-[250px] text-[12px] text-gray-400">
                از اعتماد شما سپاسگزاریم. ما همیشه در تلاشیم بهترین تجربه‌ی زیبایی را برای شما بسازیم.
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/patient/${clinicSlug}/appointments`}
                  className="flex items-center gap-1 rounded-[3px] bg-primary px-2 py-1.5 text-[11px] font-medium text-white hover:bg-primary-dark lg:px-2 lg:py-1"
                >
                  <CalendarPlus className="h-3 w-3 lg:h-2.5 lg:w-2" />
                  درخواست نوبت
                </Link>
                <Link
                  href={`/patient/${clinicSlug}/chat`}
                  className="flex items-center gap-1 rounded-[3px] border border-primary px-2 py-1.5 text-[11px] font-medium text-primary-dark lg:px-2 lg:py-1"
                >
                  <MessageSquare className="h-3 w-3 lg:h-2.5 lg:w-2" />
                  پیام به پزشک
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center rounded-2xl border border-gray-100 p-3 text-center">
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${s.iconClass}`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="text-base font-bold text-gray-900">{s.value}</div>
                <div className="text-[10px] text-gray-400">{s.label}</div>
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
            {appointmentsLoading && <div className="text-xs text-gray-300">در حال بارگذاری...</div>}
            {!appointmentsLoading && nextAppointment && (
              <>
                <div className="text-sm font-bold text-gray-800">{formatJalaliDate(nextAppointment.startTime)}</div>
                <div className="text-xs text-gray-400">{formatTime(nextAppointment.startTime)}</div>
                <div className="mt-3 border-t border-gray-50 pt-2 text-xs">
                  <div className="font-medium text-gray-700">{nextAppointment.serviceName}</div>
                  <div className="text-gray-400">{nextAppointment.doctorName}</div>
                </div>
              </>
            )}
            {!appointmentsLoading && !nextAppointment && <div className="text-xs text-gray-300">نوبت آینده‌ای ثبت نشده.</div>}
            <Link
              href={`/patient/${clinicSlug}/appointments`}
              className="mt-3 block w-full rounded-lg bg-primary-light/15 py-2 text-center text-[11px] font-medium text-primary-dark"
            >
              مشاهده جزئیات نوبت
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            {/* خلاصه اطلاعات من — منبع مطمئن ندارد، فعلاً دست‌نخورده mock */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary-dark" />
                <h3 className="text-sm font-bold text-primary">خلاصه اطلاعات من</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">نام و نام‌خانوادگی</span>
                  <span className="text-gray-700">{summary?.fullName ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">وضعیت پرونده</span>
                  <span className="rounded-full bg-primary-light/20 px-2.5 py-0.5 text-[11px] text-primary-dark">فعال</span>
                </div>
              </div>
            </div>

            {/* تاریخچه خدمات من — از نوبت‌های تکمیل‌شده */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary">تاریخچه خدمات من</h3>
              </div>
              <div className="space-y-4">
                {completed.slice(0, 4).map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <Image src="/image/user.PNG" alt="User" width={30} height={30} unoptimized className="rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-700">{s.serviceName}</div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span>{s.doctorName}</span>
                        <span>{formatJalaliDate(s.startTime)}</span>
                      </div>
                    </div>
                    <span className="mb-1 inline-block rounded-full bg-primary-light/20 px-2 py-0.5 text-[9px] text-primary-dark">
                      انجام‌شده
                    </span>
                  </div>
                ))}
                {!appointmentsLoading && completed.length === 0 && (
                  <div className="text-center text-xs text-gray-300">خدمتی ثبت نشده.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4">
              <div className="flex min-w-max items-center gap-6 text-sm">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 transition-colors ${
                        activeTab === tab.key ? "border-primary font-medium text-primary-dark" : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "gallery" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-primary">گالری تصاویر (قبل و بعد)</h2>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-500">
                    همه خدمات <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                {imagesLoading && <div className="py-6 text-center text-xs text-gray-400">در حال بارگذاری...</div>}

                {!imagesLoading && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {images.map((g, i) => (
                      <div key={g.id}>
                        <div className={`relative h-28 overflow-hidden rounded-xl bg-gradient-to-br ${GALLERY_TONES[i % GALLERY_TONES.length]}`}>
                          <span className="absolute right-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] text-gray-600">قبل</span>
                          <span className="absolute left-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] text-gray-600">بعد</span>
                          <Images className="absolute bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 text-white/70" />
                        </div>
                        <div className="mt-1.5 text-xs font-medium text-gray-700">{g.title}</div>
                        <div className="text-[10px] text-gray-400">{formatJalaliDate(g.createdAt)}</div>
                      </div>
                    ))}
                    {images.length === 0 && <div className="col-span-full py-6 text-center text-xs text-gray-300">تصویری ثبت نشده.</div>}
                  </div>
                )}
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h2 className="mb-4 text-sm font-bold text-primary">نوبت‌های من</h2>
                <div className="space-y-3">
                  {appointments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-50 p-3 text-xs">
                      <div>
                        <div className="font-medium text-gray-700">{a.serviceName}</div>
                        <div className="text-[10px] text-gray-400">
                          {formatJalaliDate(a.startTime)} · {formatTime(a.startTime)} · {a.doctorName}
                        </div>
                      </div>
                      <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-[10px] text-primary-dark">{a.status}</span>
                    </div>
                  ))}
                  {appointments.length === 0 && <div className="py-6 text-center text-xs text-gray-300">نوبتی ثبت نشده.</div>}
                </div>
              </div>
            )}

            {activeTab === "consents" && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h2 className="mb-4 text-sm font-bold text-primary">رضایت‌نامه‌ها</h2>
                <div className="space-y-3">
                  {consents.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-xs">
                      <span className="font-medium text-gray-700">{c.title}</span>
                      <span className="text-[10px] text-gray-400">{formatJalaliDate(c.signedAt)}</span>
                    </div>
                  ))}
                  {consents.length === 0 && <div className="py-6 text-center text-xs text-gray-300">رضایت‌نامه‌ای امضا نشده.</div>}
                </div>
              </div>
            )}

            {(activeTab === "records" || activeTab === "files") && (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
                محتوای «{TABS.find((t) => t.key === activeTab)?.label}» به‌زودی اینجا نمایش داده می‌شود.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">رضایت‌نامه‌ها</h3>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
                    جدیدترین <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {consentsLoading && <div className="text-center text-xs text-gray-300">در حال بارگذاری...</div>}
                  {!consentsLoading &&
                    consents.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3">
                        <span className="text-xs font-medium text-gray-700">{c.title}</span>
                        <button className="rounded-lg p-2 text-primary transition hover:bg-primary/10">
                          <FilePlus2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  {!consentsLoading && consents.length === 0 && (
                    <div className="text-center text-xs text-gray-300">رضایت‌نامه‌ای ثبت نشده.</div>
                  )}
                </div>
              </div>

              {/* فایل‌ها و پیوست‌ها — mock، هیچ endpoint فایل عمومی برای بیمار وجود ندارد */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-primary">فایل‌ها و پیوست‌ها</h3>
                  <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-500">
                    جدیدترین <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {FILES.map((f) => (
                    <div key={f.name} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                      <div>
                        <div className="text-xs font-medium text-gray-700">{f.name}</div>
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
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) =>
            a.href ? (
              <Link
                key={a.title}
                href={`/patient/${clinicSlug}/${a.href}`}
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-right hover:shadow-sm"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.tone}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{a.title}</div>
                  <div className="text-[10px] text-gray-400">{a.desc}</div>
                </div>
              </Link>
            ) : (
              <button
                key={a.title}
                disabled
                className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-right opacity-50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.tone}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">{a.title}</div>
                  <div className="text-[10px] text-gray-400">{a.desc}</div>
                </div>
              </button>
            )
          )}
        </div>

        <p className="flex items-center justify-center gap-1.5 pb-4 text-center text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5" />
          تمامی اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
        </p>
      </div>
    </div>
  );
} 