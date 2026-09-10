"use client";

import { use, useState, useRef } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MoreVertical,
  Pencil,
  MessageSquare,
  Star,
  CalendarClock,
  PencilLine,
  Link2,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  AlignRight,
  AlignLeft,
  UserRound,
  ShieldCheck,
  ShieldAlert,
  FilePlus2,
  Images,
  StickyNote,
  Heart,
  CalendarDays,
  Paperclip,
  Lock,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
} from "lucide-react";

import Image from "next/image";

import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import {
  getPatientDetail,
  getPatientDebt,
  getPatientNextAppointment,
} from "@/lib/api/patients";

import {
  getPatientVisits,
  getVisitDetail,
  updateVisit,
  lockVisit,
  addVisitRecommendation,
  setVisitFollowUp,
  checkVisitConsents,
  getVisitServiceBodyPoints,
  addVisitServiceBodyPoint,
  type ClinicVisit,
} from "@/lib/api/visits";

import { queryKeys } from "@/lib/query/keys";

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

const VISIT_STATUS_LABEL: Record<ClinicVisit["status"], string> = {
  draft: "پیش‌نویس",
  in_progress: "در حال انجام",
  completed: "انجام‌شده",
  locked: "قفل‌شده",
  cancelled: "لغوشده",
};

const VISIT_STATUS_TONE: Record<ClinicVisit["status"], string> = {
  draft: "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400",
  in_progress: "bg-amber-50 text-warning dark:bg-amber-500/10 dark:text-amber-300",
  completed: "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary",
  locked: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300",
  cancelled: "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-300",
};

const BODY_REGIONS = [
  "پیشانی",
  "اطراف چشم",
  "گونه",
  "لب",
  "چانه",
  "خط فک",
  "گردن",
  "پوست سر",
  "سایر",
];

const GALLERY = [
  {
    title: "فیلر لب",
    date: "۱۴۰۳/۰۱/۲۸",
    tone: "from-pink-200 to-pink-100 dark:from-pink-900/40 dark:to-pink-950/20",
  },
  {
    title: "بوتاکس",
    date: "۱۴۰۳/۰۲/۱۵",
    tone: "from-primary-light/60 to-primary-light/20 dark:from-primary/30 dark:to-primary/10",
  },
  {
    title: "مزوتراپی مو",
    date: "۱۴۰۳/۰۳/۲۱",
    tone: "from-secondary-purple/60 to-secondary-purple/20 dark:from-purple-900/40 dark:to-purple-950/20",
  },
];

const CHAT_MESSAGES = [
  {
    name: "نسترن موسوی",
    time: "۱۰:۱۲",
    text: "سلام دکتر وقت بخیر، ممنون از راهنمایی‌های شما 🙏",
    fromMe: false,
  },
  {
    name: "دکتر سارا محمدی",
    time: "۱۰:۲۸",
    text: "سلام عزیزم، خوشحالم که راضی هستید. لطفاً بعد رو فراموش نکنید.",
    fromMe: true,
  },
  {
    name: "نسترن موسوی",
    time: "۱۰:۳۲",
    text: "حتماً، روز دوشنبه ساعت چند هست؟",
    fromMe: false,
  },
  {
    name: "دکتر سارا محمدی",
    time: "۱۰:۳۴",
    text: "ساعت ۱۰:۳۰ ثبت شده. ممنون",
    fromMe: true,
  },
];

const RELATED_FILES = [
  { name: "رضایت‌نامه مزوتراپی مو", type: "PDF", date: "۱۴۰۳/۰۳/۲۱" },
  { name: "برنامه مراقبتی بعد از جلسه", type: "PDF", date: "۱۴۰۳/۰۳/۲۱" },
  { name: "عکس آنالیز پوست", type: "JPG", date: "۱۴۰۳/۰۲/۱۵" },
];

const STATUS_LABELS: Record<string, string> = {
  active: "فعال",
  inactive: "غیرفعال",
  archived: "آرشیو",
};

function formatJalaliDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

function formatJalaliTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function toDateInputValue(iso: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

// شکل واقعی خروجی /visits/{id}/consents/check:
// { all_signed: boolean, missing: (string | { name?: string; title?: string; consent_name?: string })[] }
function missingConsentLabel(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    return (
      (o.name as string) ??
      (o.title as string) ??
      (o.consent_name as string) ??
      (o.label as string) ??
      "رضایت‌نامه‌ی نامشخص"
    );
  }
  return "رضایت‌نامه‌ی نامشخص";
}

function summarizeConsentResult(result: Record<string, unknown> | null | undefined) {
  if (!result) return null;

  const allSigned = result.all_signed as boolean | undefined;
  const missing = (result.missing as unknown[] | undefined) ?? [];

  if (allSigned === true || missing.length === 0) {
    return { ok: true, message: "همه‌ی رضایت‌نامه‌های لازم ثبت شده است.", missing: [] as string[] };
  }

  return {
    ok: false,
    message: `${missing.length} رضایت‌نامه‌ی ثبت‌نشده وجود دارد.`,
    missing: missing.map(missingConsentLabel),
  };
}

export default function PatientProfilePage({
  params,
}: {
  params: Promise<{ clinicSlug: string; patientId: string }>;
}) {
  const { clinicSlug, patientId } = use(params);

  const [activeTab, setActiveTab] = useState("info");

  const [note, setNote] = useState(
    "مزوتراپی مو با کوکتل رشد مو انجام شد. پوست سر قبل از تزریق با لیدوکائین موضعی بی‌حس شد. بیمار رضایت قبل از دارد. توصیه شد مصرف مکمل بیوتین ادامه یابد و شستشوی ملایم انجام شود."
  );

  const noteRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  const { data: detail, isLoading, error } = useQuery({
    queryKey: queryKeys.patients.detail(clinicSlug, patientId),
    queryFn: () => getPatientDetail(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: debt } = useQuery({
    queryKey: [...queryKeys.patients.detail(clinicSlug, patientId), "debt"],
    queryFn: () => getPatientDebt(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: nextAppointment } = useQuery({
    queryKey: [...queryKeys.patients.detail(clinicSlug, patientId), "next-appointment"],
    queryFn: () => getPatientNextAppointment(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: queryKeys.visits.listByPatient(clinicSlug, patientId),
    queryFn: () => getPatientVisits(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const sortedVisits = [...(visits ?? [])].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  const recentVisitServices = sortedVisits
    .flatMap((v) =>
      v.services.map((s) => ({
        visitId: v.id,
        name: s.serviceName ?? "خدمت",
        doctor: v.doctorName ?? "—",
        date: formatJalaliDate(v.visitDate),
        status: VISIT_STATUS_LABEL[v.status],
      }))
    )
    .slice(0, 5);

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

  const toolbarBtn = (icon: React.ReactNode, command: string, value?: string) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => applyFormat(command, value)}
      className={`rounded p-1 transition-colors ${
        activeFormats[command]
          ? "bg-primary-light/30 text-primary-dark dark:bg-primary/20 dark:text-primary"
          : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
      }`}
    >
      {icon}
    </button>
  );

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">در حال بارگذاری...</div>
    );
  }

  if (error || !detail) {
    return (
      <div className="py-20 text-center text-sm text-danger dark:text-red-400">بیمار یافت نشد.</div>
    );
  }

  const { patient, medicalAlerts } = detail;

  const alerts = [
    medicalAlerts.hasAllergy && {
      text: medicalAlerts.allergyDescription || "سابقه‌ی حساسیت",
      tone: "bg-danger",
    },
    medicalAlerts.hasSpecialDisease && {
      text: medicalAlerts.specialDiseaseDescription || "بیماری خاص ثبت‌شده",
      tone: "bg-warning",
    },
    medicalAlerts.usesMedicine && {
      text: medicalAlerts.medicineDescription || "مصرف دارو",
      tone: "bg-warning",
    },
  ].filter(Boolean) as { text: string; tone: string }[];

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
          <MessageSquare className="h-3.5 w-3.5" />
          ارسال پیام
        </button>

        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-dark">
          <Pencil className="h-3.5 w-3.5" />
          ویرایش اطلاعات
        </button>

        <button className="rounded-lg border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Patient Header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-8">
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
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {patient.firstName} {patient.lastName}
                </span>
                <Star className="h-4 w-4 text-warning" />
              </div>

              <span className="mt-1 inline-block rounded-full bg-secondary-pink/40 px-2.5 py-0.5 text-[10px] text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                {patient.patientCode ?? "مراجعه‌کننده"}
              </span>
            </div>
          </div>

          <InfoStat label="کدملی" value={patient.nationalId ?? "—"} />

          <InfoStat
            label="تاریخ تولد / سن"
            value={`${formatJalaliDate(patient.birthDate)}${
              patient.age != null ? ` - ${patient.age.toLocaleString("fa-IR")} سال` : ""
            }`}
          />

          <InfoStat label="شماره تماس" value={patient.phone || "—"} />

          <InfoStat label="آخرین مراجعه" value={formatJalaliDate(patient.lastVisitAt)} />

          <InfoStat
            label="وضعیت"
            custom={
              patient.status ? (
                <span className="rounded-full bg-primary-light/20 px-2.5 py-0.5 text-[11px] text-primary-dark dark:bg-primary/15 dark:text-primary">
                  {STATUS_LABELS[patient.status] ?? patient.status}
                </span>
              ) : (
                <span className="text-gray-300 dark:text-gray-600">—</span>
              )
            }
          />

          <InfoStat
            label="بدهی جاری"
            value={debt != null ? `${debt.toLocaleString("fa-IR")} تومان` : "—"}
            valueTone={debt && debt > 0 ? "text-danger dark:text-red-400" : undefined}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex min-w-max items-center gap-5 text-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary font-medium text-primary-dark dark:text-primary"
                    : "border-transparent text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
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
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Chat */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-100">
                  <MessageSquare className="h-4 w-4 text-primary-dark dark:text-primary" />
                  چت و پیام‌ها
                </h3>

                <div className="space-y-3">
                  {CHAT_MESSAGES.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                            {m.name}
                          </span>
                          <span className="text-[9px] text-gray-300 dark:text-gray-600">{m.time}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-3 w-full rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark transition-colors hover:bg-primary-light/25 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20">
                  مشاهده همه پیام‌ها
                </button>
              </div>

              {/* Files */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-100">
                  <Paperclip className="h-4 w-4 text-primary-dark dark:text-primary" />
                  فایل‌های مرتبط
                </h3>

                <div className="space-y-3">
                  {RELATED_FILES.map((f) => (
                    <div key={f.name} className="flex items-center gap-2.5">
                      <FilePlus2 className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                      <div>
                        <div className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {f.type} · {f.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-3 text-[11px] text-primary-dark dark:text-primary">
                  مشاهده همه فایل‌ها
                </button>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              {/* Last Note */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary-dark dark:text-primary" />
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">یادداشت آخرین جلسه</h3>
                </div>

                <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const url = prompt("لینک را وارد کنید:");
                      if (url) applyFormat("createLink", url);
                    }}
                    className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
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
                  className="min-h-[100px] w-full resize-none text-xs leading-relaxed text-gray-600 outline-none dark:text-gray-300"
                />

                <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2 dark:border-gray-800">
                  <span className="text-[10px] text-gray-300 dark:text-gray-600">
                    ثبت توسط: دکتر سارا محمدی - ۱۴۰۳/۰۳/۲۱ - ۱۱:۳۰
                  </span>
                  <button className="rounded-lg bg-primary px-4 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-primary-dark">
                    ذخیره یادداشت
                  </button>
                </div>
              </div>

              {/* Services */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-100">خدمات آخیر</h3>

                {visitsLoading ? (
                  <p className="py-4 text-center text-[11px] text-gray-400 dark:text-gray-500">
                    در حال بارگذاری...
                  </p>
                ) : recentVisitServices.length === 0 ? (
                  <p className="py-4 text-center text-[11px] text-gray-400 dark:text-gray-500">
                    هنوز جلسه‌ی درمانی برای این بیمار ثبت نشده است.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-right text-[11px]">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-500">
                          <th className="pb-2 font-medium">خدمت</th>
                          <th className="pb-2 font-medium">تاریخ انجام</th>
                          <th className="pb-2 font-medium">متخصص</th>
                          <th className="pb-2 font-medium">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentVisitServices.map((s, i) => (
                          <tr key={`${s.visitId}-${i}`} className="border-b border-gray-50 dark:border-gray-800">
                            <td className="py-2 text-gray-700 dark:text-gray-200">{s.name}</td>
                            <td className="py-2 text-gray-500 dark:text-gray-400">{s.date}</td>
                            <td className="py-2 text-gray-500 dark:text-gray-400">{s.doctor}</td>
                            <td className="py-2">
                              <span className="rounded-full bg-primary-light/20 px-2 py-0.5 text-primary-dark dark:bg-primary/15 dark:text-primary">
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab("services")}
                  className="mt-3 text-[11px] text-primary-dark dark:text-primary"
                >
                  مشاهده همه خدمات
                </button>
              </div>

              {/* Gallery */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-100">
                  <Images className="h-4 w-4 text-primary-dark dark:text-primary" />
                  تصاویر قبل و بعد
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {GALLERY.map((g) => (
                    <div key={g.title}>
                      <div className={`relative h-16 overflow-hidden rounded-lg bg-gradient-to-br ${g.tone}`}>
                        <span className="absolute right-1 top-1 rounded bg-white/90 px-1 text-[8px] text-gray-600 dark:bg-gray-900/80 dark:text-gray-300">
                          قبل
                        </span>
                        <span className="absolute left-1 top-1 rounded bg-white/90 px-1 text-[8px] text-gray-600 dark:bg-gray-900/80 dark:text-gray-300">
                          بعد
                        </span>
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                        {g.title}
                      </div>
                      <div className="text-[9px] text-gray-400 dark:text-gray-500">{g.date}</div>
                    </div>
                  ))}
                </div>

                <button className="mt-3 text-[11px] text-primary-dark dark:text-primary">
                  مشاهده همه تصاویر
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Next Appointment */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center">
                  <CalendarClock className="h-4 w-4 text-primary-dark dark:text-primary" />
                  <h3 className="mr-2 text-xs font-bold text-gray-800 dark:text-gray-100">نوبت بعدی</h3>
                </div>

                {nextAppointment ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                      {formatJalaliDate(nextAppointment.startTime)} ساعت{" "}
                      {formatJalaliTime(nextAppointment.startTime)}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {nextAppointment.serviceName}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 dark:text-gray-500">نوبت آینده‌ای ثبت نشده.</div>
                )}

                <button className="mt-3 w-full rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark transition-colors hover:bg-primary-light/25 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20">
                  رزرو / ویرایش نوبت
                </button>

                <button className="mt-2 w-full text-[11px] text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  مشاهده تمام نوبت‌ها
                </button>
              </div>

              {/* Alerts */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary-dark dark:text-primary" />
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">هشدارها و اطلاعات مهم</h3>
                </div>

                <div className="space-y-2">
                  {alerts.length > 0 ? (
                    alerts.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${a.tone}`} />
                        {a.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500">هشداری ثبت نشده.</div>
                  )}
                </div>
              </div>

              {/* Quick Note */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-2 flex items-center gap-1.5">
                  <PencilLine className="h-4 w-4 text-primary-dark dark:text-primary" />
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">یادداشت سریع</h3>
                </div>

                <textarea
                  placeholder="یادداشت سریع خود را بنویسید..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:placeholder:text-gray-600"
                />

                <button className="mt-2 w-full rounded-lg border border-gray-200 py-2 text-[11px] text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  ثبت یادداشت
                </button>
              </div>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 pb-2 pt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
          </p>
        </>
      ) : activeTab === "services" || activeTab === "consents" ? (
        <VisitHistoryList
          clinicSlug={clinicSlug}
          patientId={patientId}
          visits={sortedVisits}
          isLoading={visitsLoading}
          focusConsents={activeTab === "consents"}
        />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
          محتوای «{TABS.find((t) => t.key === activeTab)?.label}» به‌زودی اینجا نمایش داده می‌شود.
        </div>
      )}
    </div>
  );
}

function VisitHistoryList({
  clinicSlug,
  patientId,
  visits,
  isLoading,
  focusConsents,
}: {
  clinicSlug: string;
  patientId: string;
  visits: ClinicVisit[];
  isLoading: boolean;
  focusConsents?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
        در حال بارگذاری تاریخچه‌ی جلسات...
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
        هنوز هیچ جلسه‌ی درمانی برای این بیمار ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <VisitCard
          key={visit.id}
          clinicSlug={clinicSlug}
          patientId={patientId}
          visit={visit}
          defaultOpenConsents={focusConsents}
        />
      ))}
    </div>
  );
}

function VisitCard({
  clinicSlug,
  patientId,
  visit,
  defaultOpenConsents,
}: {
  clinicSlug: string;
  patientId: string;
  visit: ClinicVisit;
  defaultOpenConsents?: boolean;
}) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(visit.clinicalSummary ?? "");
  const [recommendation, setRecommendation] = useState(visit.patientRecommendation ?? "");

  const [followUpDate, setFollowUpDate] = useState(toDateInputValue(visit.nextVisitRecommendedAt));

  const [consentOpen, setConsentOpen] = useState(!!defaultOpenConsents);
  const [consentResult, setConsentResult] = useState<Record<string, unknown> | null>(null);

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const isLocked = visit.status === "locked" || !!visit.lockedAt;
  const isCancelled = visit.status === "cancelled";
  const canEdit = !isLocked && !isCancelled;

  function invalidateVisits() {
    queryClient.invalidateQueries({ queryKey: queryKeys.visits.listByPatient(clinicSlug, patientId) });
    queryClient.invalidateQueries({ queryKey: ["visit-detail", clinicSlug, visit.id] });
  }

  // برای گرفتن جزئیات کامل و به‌روز جلسه هنگام باز کردن حالت ویرایش
  const { refetch: refetchVisitDetail, isFetching: detailLoading } = useQuery({
    queryKey: ["visit-detail", clinicSlug, visit.id],
    queryFn: () => getVisitDetail(clinicSlug, visit.id),
    enabled: false,
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const fresh = await refetchVisitDetail();
      return updateVisit(clinicSlug, visit.id, {
        clinical_summary: summary || undefined,
        patient_recommendation: recommendation || undefined,
      });
    },
    onSuccess: () => {
      setError(null);
      setMessage("جلسه با موفقیت ویرایش شد.");
      setIsEditing(false);
      invalidateVisits();
    },
    onError: (e) => setError(e instanceof Error ? e.message : "ویرایش جلسه ناموفق بود"),
  });

  const recommendationMutation = useMutation({
    mutationFn: () => addVisitRecommendation(clinicSlug, visit.id, recommendation),
    onSuccess: () => {
      setError(null);
      setMessage("توصیه برای بیمار ثبت شد.");
      invalidateVisits();
    },
    onError: (e) => setError(e instanceof Error ? e.message : "ثبت توصیه ناموفق بود"),
  });

  const followUpMutation = useMutation({
    mutationFn: () => setVisitFollowUp(clinicSlug, visit.id, followUpDate),
    onSuccess: () => {
      setError(null);
      setMessage("نوبت پیگیری پیشنهادی ثبت شد.");
      invalidateVisits();
    },
    onError: (e) => setError(e instanceof Error ? e.message : "ثبت نوبت پیگیری ناموفق بود"),
  });

  const lockMutation = useMutation({
    mutationFn: () => lockVisit(clinicSlug, visit.id),
    onSuccess: () => {
      setError(null);
      setMessage("جلسه قفل شد و دیگر قابل ویرایش نیست.");
      invalidateVisits();
    },
    onError: (e) => setError(e instanceof Error ? e.message : "قفل‌کردن جلسه ناموفق بود"),
  });

  const consentMutation = useMutation({
    mutationFn: () => checkVisitConsents(clinicSlug, visit.id),
    onSuccess: (result) => {
      setError(null);
      setConsentResult(result);
      setConsentOpen(true);
    },
    onError: (e) => setError(e instanceof Error ? e.message : "بررسی رضایت‌نامه ناموفق بود"),
  });

  const consentSummary = summarizeConsentResult(consentResult);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
            {formatJalaliDate(visit.visitDate)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {formatJalaliTime(visit.visitDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${VISIT_STATUS_TONE[visit.status]}`}>
            {VISIT_STATUS_LABEL[visit.status]}
          </span>

          {canEdit && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Pencil className="h-3 w-3" />
              ویرایش
            </button>
          )}

          {visit.status === "completed" && !isLocked && (
            <button
              type="button"
              onClick={() => {
                if (confirm("پس از قفل‌کردن، این جلسه دیگر قابل ویرایش نخواهد بود. ادامه می‌دهید؟")) {
                  lockMutation.mutate();
                }
              }}
              disabled={lockMutation.isPending}
              className="flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-gray-900 disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/20"
            >
              <Lock className="h-3 w-3" />
              {lockMutation.isPending ? "..." : "قفل جلسه"}
            </button>
          )}
        </div>
      </div>

      {visit.doctorName && (
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">پزشک: {visit.doctorName}</p>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] text-red-500 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      {message && !error && (
        <p className="mt-2 rounded-lg bg-primary-light/10 px-2.5 py-1.5 text-[11px] text-primary-dark dark:bg-primary/10 dark:text-primary">
          {message}
        </p>
      )}

      {visit.services.length > 0 && (
        <div className="mt-3 space-y-2">
          {visit.services.map((s) => (
            <div key={s.id}>
              <button
                type="button"
                onClick={() => setExpandedServiceId(expandedServiceId === s.id ? null : s.id)}
                className="flex items-center gap-1.5 rounded-full bg-primary-light/20 px-2.5 py-1 text-[11px] text-primary-dark transition hover:bg-primary-light/30 dark:bg-primary/15 dark:text-primary dark:hover:bg-primary/25"
              >
                <MapPin className="h-3 w-3" />
                {s.serviceName ?? "خدمت"}
                {expandedServiceId === s.id ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>

              {expandedServiceId === s.id && (
                <BodyPointsPanel
                  clinicSlug={clinicSlug}
                  visitServiceId={s.id}
                  canEdit={canEdit}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">خلاصه‌ی بالینی</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">توصیه به بیمار</label>
            <textarea
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending || detailLoading}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-[11px] font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSummary(visit.clinicalSummary ?? "");
                setRecommendation(visit.patientRecommendation ?? "");
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-[11px] text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <X className="h-3.5 w-3.5" />
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <>
          {visit.clinicalSummary && (
            <p className="mt-3 rounded-lg bg-gray-50 p-2.5 text-[11px] leading-relaxed text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
              {visit.clinicalSummary}
            </p>
          )}

          {visit.patientRecommendation && (
            <p className="mt-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              توصیه به بیمار: {visit.patientRecommendation}
            </p>
          )}
        </>
      )}

      {canEdit && !isEditing && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <JalaliDateField value={followUpDate} onChange={setFollowUpDate} />
          <button
            type="button"
            onClick={() => followUpMutation.mutate()}
            disabled={!followUpDate || followUpMutation.isPending}
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {followUpMutation.isPending ? "..." : "ثبت نوبت پیگیری"}
          </button>

          {recommendation && recommendation !== visit.patientRecommendation && (
            <button
              type="button"
              onClick={() => recommendationMutation.mutate()}
              disabled={recommendationMutation.isPending}
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {recommendationMutation.isPending ? "..." : "ثبت توصیه"}
            </button>
          )}
        </div>
      )}

      {visit.nextVisitRecommendedAt && (
        <p className="mt-2 text-[11px] text-primary-dark dark:text-primary-light">
          نوبت پیگیری پیشنهادی: {formatJalaliDate(visit.nextVisitRecommendedAt)}
        </p>
      )}

      {/* Consents */}
      <div className="mt-3 border-t border-gray-50 pt-3 dark:border-gray-800">
        <button
          type="button"
          onClick={() => (consentResult ? setConsentOpen((o) => !o) : consentMutation.mutate())}
          disabled={consentMutation.isPending}
          className="flex items-center gap-1.5 text-[11px] text-gray-500 transition hover:text-primary-dark disabled:opacity-50 dark:text-gray-400 dark:hover:text-primary"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {consentMutation.isPending ? "در حال بررسی رضایت‌نامه‌ها..." : "بررسی رضایت‌نامه‌های این جلسه"}
        </button>

        {consentOpen && consentSummary && (
          <div
            className={`mt-2 rounded-lg px-2.5 py-1.5 text-[11px] ${
              consentSummary.ok
                ? "bg-primary-light/10 text-primary-dark dark:bg-primary/10 dark:text-primary"
                : "bg-amber-50 text-warning dark:bg-amber-500/10 dark:text-amber-300"
            }`}
          >
            <p className="flex items-center gap-1.5">
              {consentSummary.ok ? (
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              )}
              {consentSummary.message}
            </p>

            {consentSummary.missing.length > 0 && (
              <ul className="mt-1 list-inside list-disc space-y-0.5 pr-5">
                {consentSummary.missing.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BodyPointsPanel({
  clinicSlug,
  visitServiceId,
  canEdit,
}: {
  clinicSlug: string;
  visitServiceId: string;
  canEdit: boolean;
}) {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [region, setRegion] = useState(BODY_REGIONS[0]);
  const [pointNote, setPointNote] = useState("");

  const queryKey = ["visit-service-body-points", clinicSlug, visitServiceId];

  const { data: points, isLoading } = useQuery({
    queryKey,
    queryFn: () => getVisitServiceBodyPoints(clinicSlug, visitServiceId),
    enabled: !!clinicSlug && !!visitServiceId,
  });

  const addPointMutation = useMutation({
    mutationFn: () =>
      addVisitServiceBodyPoint(clinicSlug, visitServiceId, {
        body_region: region,
        note: pointNote || undefined,
      }),
    onSuccess: () => {
      setPointNote("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
          نقاط ثبت‌شده روی نقشه‌ی بدن
        </span>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-primary-dark transition hover:text-primary dark:text-primary-light"
          >
            <Plus className="h-3 w-3" />
            افزودن نقطه
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-[10px] text-gray-400 dark:text-gray-500">در حال بارگذاری...</p>
      ) : points && points.length > 0 ? (
        <ul className="space-y-1.5">
          {points.map((p) => (
            <li key={p.id} className="flex items-start gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary-dark dark:text-primary-light" />
              <span>
                {p.bodyRegion ?? "ناحیه‌ی نامشخص"}
                {p.shotType ? ` · ${p.shotType}` : ""}
                {p.note ? ` — ${p.note}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-gray-400 dark:text-gray-500">هنوز نقطه‌ای ثبت نشده است.</p>
      )}

      {showForm && (
        <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
          >
            {BODY_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={pointNote}
            onChange={(e) => setPointNote(e.target.value)}
            placeholder="یادداشت (مثلاً میزان دوز، نوع تزریق و...)"
            className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] outline-none focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
          />

          <button
            type="button"
            onClick={() => addPointMutation.mutate()}
            disabled={addPointMutation.isPending}
            className="w-full rounded-lg bg-primary py-1.5 text-[11px] font-medium text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            {addPointMutation.isPending ? "در حال ثبت..." : "ثبت نقطه"}
          </button>
        </div>
      )}
    </div>
  );
}

// انتخابگر تاریخ شمسی سبک؛ خروجی را به‌صورت رشته‌ی ISO تاریخ (YYYY-MM-DD) برمی‌گرداند
function JalaliDateField({
  value,
  onChange,
}: {
  value: string;
  onChange: (isoDate: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const dateObj = value
    ? new DateObject({ date: new Date(value), calendar: persian, locale: persian_fa })
    : null;

  const label = dateObj ? dateObj.format("D MMMM YYYY") : "انتخاب تاریخ پیگیری";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-600 outline-none transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <CalendarDays className="h-3 w-3 text-gray-300 dark:text-gray-600" />
        {label}
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-[260px] rounded-2xl border border-gray-100 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-[#18201e]">
          <Calendar
            value={dateObj ?? undefined}
            onChange={(v) => {
              if (v) {
                const d = v as DateObject;
                onChange(d.toDate().toISOString());
                setOpen(false);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            shadow={false}
          />
        </div>
      )}
    </div>
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
      className={`rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-950 dark:hover:border-primary/40 ${className}`}
    >
      <div className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{label}</div>

      {custom ?? (
        <div className={`mt-2 text-sm ${valueTone ?? "text-gray-800 dark:text-gray-200"}`}>{value}</div>
      )}
    </div>
  );
}