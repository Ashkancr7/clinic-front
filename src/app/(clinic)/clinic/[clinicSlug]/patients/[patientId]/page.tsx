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
  FilePlus2,
  Images,
  StickyNote,
  Heart,
  CalendarDays,
  Paperclip,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  Loader2,
} from "lucide-react";

import Image from "next/image";

import {
  getPatientDetail,
  getPatientDebt,
  getPatientNextAppointment,
} from "@/lib/api/patients";

import { getPatientVisits, type ClinicVisit } from "@/lib/api/visits";

import {
  getPatientSignedConsents,
  getConsentTemplates,
  signPatientConsent,
  type ConsentTemplate,
} from "@/lib/api/consents";

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
  {
    name: "رضایت‌نامه مزوتراپی مو",
    type: "PDF",
    date: "۱۴۰۳/۰۳/۲۱",
  },
  {
    name: "برنامه مراقبتی بعد از جلسه",
    type: "PDF",
    date: "۱۴۰۳/۰۳/۲۱",
  },
  {
    name: "عکس آنالیز پوست",
    type: "JPG",
    date: "۱۴۰۳/۰۲/۱۵",
  },
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
    return new Date(iso).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PatientProfilePage({
  params,
}: {
  params: Promise<{ clinicSlug: string; patientId: string }>;
}) {
  const { clinicSlug, patientId } = use(params);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("info");
  const [showSignConsent, setShowSignConsent] = useState(false);
  const [consentsError, setConsentsError] = useState<string | null>(null);

  const [note, setNote] = useState(
    "مزوتراپی مو با کوکتل رشد مو انجام شد. پوست سر قبل از تزریق با لیدوکائین موضعی بی‌حس شد. بیمار رضایت قبل از دارد. توصیه شد مصرف مکمل بیوتین ادامه یابد و شستشوی ملایم انجام شود."
  );

  const noteRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState<
    Record<string, boolean>
  >({});

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
    queryKey: [
      ...queryKeys.patients.detail(clinicSlug, patientId),
      "next-appointment",
    ],
    queryFn: () => getPatientNextAppointment(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: queryKeys.visits.listByPatient(clinicSlug, patientId),
    queryFn: () => getPatientVisits(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: signedConsents = [], isLoading: consentsLoading } = useQuery({
    queryKey: queryKeys.consents.byPatient(clinicSlug, patientId),
    queryFn: () => getPatientSignedConsents(clinicSlug, patientId),
    enabled: !!clinicSlug && !!patientId,
  });

  const { data: consentTemplates = [] } = useQuery({
    queryKey: queryKeys.consents.templates(clinicSlug),
    queryFn: () => getConsentTemplates(clinicSlug),
    enabled: !!clinicSlug && activeTab === "consents",
  });

  const signConsentMutation = useMutation({
    mutationFn: (payload: { consentVersionId: string; serviceId?: string; accepted: boolean }) =>
      signPatientConsent(clinicSlug, patientId, {
        consent_version_id: payload.consentVersionId,
        service_id: payload.serviceId,
        accepted: payload.accepted,
      }),
    onSuccess: () => {
      setConsentsError(null);
      setShowSignConsent(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.consents.byPatient(clinicSlug, patientId) });
    },
    onError: (e) => setConsentsError(e instanceof Error ? e.message : "ثبت رضایت‌نامه ناموفق بود"),
  });

  const sortedVisits = [...(visits ?? [])].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  // برای ویجت خلاصه‌ی "خدمات آخیر" در تب اطلاعات پایه: هر خدمتِ هر جلسه، یک ردیف
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

    if (noteRef.current) {
      setNote(noteRef.current.innerHTML);
    }
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
      <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="py-20 text-center text-sm text-danger dark:text-red-400">
        بیمار یافت نشد.
      </div>
    );
  }

  const { patient, medicalAlerts } = detail;

  const alerts = [
    medicalAlerts.hasAllergy && {
      text: medicalAlerts.allergyDescription || "سابقه‌ی حساسیت",
      tone: "bg-danger",
    },
    medicalAlerts.hasSpecialDisease && {
      text:
        medicalAlerts.specialDiseaseDescription || "بیماری خاص ثبت‌شده",
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

          <InfoStat
            label="کدملی"
            value={patient.nationalId ?? "—"}
          />

          <InfoStat
            label="تاریخ تولد / سن"
            value={`${formatJalaliDate(patient.birthDate)}${
              patient.age != null
                ? ` - ${patient.age.toLocaleString("fa-IR")} سال`
                : ""
            }`}
          />

          <InfoStat
            label="شماره تماس"
            value={patient.phone || "—"}
          />

          <InfoStat
            label="آخرین مراجعه"
            value={formatJalaliDate(patient.lastVisitAt)}
          />

          <InfoStat
            label="وضعیت"
            custom={
              patient.status ? (
                <span className="rounded-full bg-primary-light/20 px-2.5 py-0.5 text-[11px] text-primary-dark dark:bg-primary/15 dark:text-primary">
                  {STATUS_LABELS[patient.status] ?? patient.status}
                </span>
              ) : (
                <span className="text-gray-300 dark:text-gray-600">
                  —
                </span>
              )
            }
          />

          <InfoStat
            label="بدهی جاری"
            value={
              debt != null
                ? `${debt.toLocaleString("fa-IR")} تومان`
                : "—"
            }
            valueTone={
              debt && debt > 0
                ? "text-danger dark:text-red-400"
                : undefined
            }
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
                    <div
                      key={i}
                      className="flex items-start gap-2"
                    >
                      <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800" />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-200">
                            {m.name}
                          </span>

                          <span className="text-[9px] text-gray-300 dark:text-gray-600">
                            {m.time}
                          </span>
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
                    <div
                      key={f.name}
                      className="flex items-center gap-2.5"
                    >
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

                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    یادداشت آخرین جلسه
                  </h3>
                </div>

                <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const url = prompt("لینک را وارد کنید:");

                      if (url) {
                        applyFormat("createLink", url);
                      }
                    }}
                    className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </button>

                  {toolbarBtn(
                    <AlignRight className="h-3.5 w-3.5" />,
                    "justifyRight"
                  )}

                  {toolbarBtn(
                    <AlignLeft className="h-3.5 w-3.5" />,
                    "justifyLeft"
                  )}

                  {toolbarBtn(
                    <List className="h-3.5 w-3.5" />,
                    "insertUnorderedList"
                  )}

                  {toolbarBtn(
                    <Bold className="h-3.5 w-3.5" />,
                    "bold"
                  )}

                  {toolbarBtn(
                    <Italic className="h-3.5 w-3.5" />,
                    "italic"
                  )}

                  {toolbarBtn(
                    <Underline className="h-3.5 w-3.5" />,
                    "underline"
                  )}
                </div>

                <div
                  ref={noteRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) =>
                    setNote(e.currentTarget.innerHTML)
                  }
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
                <h3 className="mb-3 text-xs font-bold text-gray-800 dark:text-gray-100">
                  خدمات آخیر
                </h3>

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
                          <tr
                            key={`${s.visitId}-${i}`}
                            className="border-b border-gray-50 dark:border-gray-800"
                          >
                            <td className="py-2 text-gray-700 dark:text-gray-200">
                              {s.name}
                            </td>

                            <td className="py-2 text-gray-500 dark:text-gray-400">
                              {s.date}
                            </td>

                            <td className="py-2 text-gray-500 dark:text-gray-400">
                              {s.doctor}
                            </td>

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
                      <div
                        className={`relative h-16 overflow-hidden rounded-lg bg-gradient-to-br ${g.tone}`}
                      >
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

                      <div className="text-[9px] text-gray-400 dark:text-gray-500">
                        {g.date}
                      </div>
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

                  <h3 className="mr-2 text-xs font-bold text-gray-800 dark:text-gray-100">
                    نوبت بعدی
                  </h3>
                </div>

                {nextAppointment ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />

                      {formatJalaliDate(nextAppointment.startTime)}{" "}
                      ساعت{" "}
                      {formatJalaliTime(nextAppointment.startTime)}
                    </div>

                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {nextAppointment.serviceName}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    نوبت آینده‌ای ثبت نشده.
                  </div>
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

                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    هشدارها و اطلاعات مهم
                  </h3>
                </div>

                <div className="space-y-2">
                  {alerts.length > 0 ? (
                    alerts.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${a.tone}`}
                        />

                        {a.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      هشداری ثبت نشده.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Note */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-2 flex items-center gap-1.5">
                  <PencilLine className="h-4 w-4 text-primary-dark dark:text-primary" />

                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    یادداشت سریع
                  </h3>
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

          {/* Security Notice */}
          <p className="flex items-center justify-center gap-1.5 pb-2 pt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            اطلاعات شما نزد ما امن است و به هیچ عنوان در اختیار شخص ثالث قرار نمی‌گیرد.
          </p>
        </>
      ) : activeTab === "services" ? (
        <VisitHistoryList visits={sortedVisits} isLoading={visitsLoading} />
      ) : activeTab === "consents" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">رضایت‌نامه‌های امضاشده</h3>
            <button
              type="button"
              onClick={() => setShowSignConsent(true)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-dark"
            >
              <Plus className="h-3.5 w-3.5" /> ثبت رضایت‌نامه جدید
            </button>
          </div>

          {consentsError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-500/10 dark:text-red-300">
              {consentsError}
            </p>
          )}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            {consentsLoading ? (
              <p className="py-10 text-center text-xs text-gray-400 dark:text-gray-500">در حال بارگذاری...</p>
            ) : signedConsents.length === 0 ? (
              <p className="py-10 text-center text-xs text-gray-400 dark:text-gray-500">
                هنوز رضایت‌نامه‌ای برای این بیمار ثبت نشده است.
              </p>
            ) : (
              <div className="space-y-2">
                {signedConsents.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          c.accepted
                            ? "bg-primary-light/20 text-primary-dark dark:bg-primary/15 dark:text-primary"
                            : "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-300"
                        }`}
                      >
                        {c.accepted ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          {c.templateTitle ?? "رضایت‌نامه"}
                          {c.versionNumber != null && (
                            <span className="mr-1 text-[10px] text-gray-400 dark:text-gray-500">
                              (نسخه {c.versionNumber.toLocaleString("fa-IR")})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {c.signedAt ? new Date(c.signedAt).toLocaleDateString("fa-IR") : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
          محتوای «
          {TABS.find((t) => t.key === activeTab)?.label}
          » به‌زودی اینجا نمایش داده می‌شود.
        </div>
      )}

      {showSignConsent && (
        <SignConsentModal
          templates={consentTemplates}
          onClose={() => setShowSignConsent(false)}
          onSign={(payload) => signConsentMutation.mutate(payload)}
          isSubmitting={signConsentMutation.isPending}
        />
      )}
    </div>
  );
}

function VisitHistoryList({
  visits,
  isLoading,
}: {
  visits: ClinicVisit[];
  isLoading: boolean;
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
        <div
          key={visit.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                {formatJalaliDate(visit.visitDate)}
              </span>

              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {formatJalaliTime(visit.visitDate)}
              </span>
            </div>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${VISIT_STATUS_TONE[visit.status]}`}
            >
              {VISIT_STATUS_LABEL[visit.status]}
            </span>
          </div>

          {visit.doctorName && (
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              پزشک: {visit.doctorName}
            </p>
          )}

          {visit.services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {visit.services.map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-primary-light/20 px-2.5 py-1 text-[11px] text-primary-dark dark:bg-primary/15 dark:text-primary"
                >
                  {s.serviceName ?? "خدمت"}
                </span>
              ))}
            </div>
          )}

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

          {visit.nextVisitRecommendedAt && (
            <p className="mt-2 text-[11px] text-primary-dark dark:text-primary-light">
              نوبت پیگیری پیشنهادی: {formatJalaliDate(visit.nextVisitRecommendedAt)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SignConsentModal({
  templates,
  onClose,
  onSign,
  isSubmitting,
}: {
  templates: ConsentTemplate[];
  onClose: () => void;
  onSign: (payload: { consentVersionId: string; serviceId?: string; accepted: boolean }) => void;
  isSubmitting: boolean;
}) {
  const eligible = templates
    .filter((t) => t.status === "active")
    .map((t) => ({ template: t, activeVersion: t.versions.find((v) => v.status === "active") }))
    .filter((t): t is { template: ConsentTemplate; activeVersion: NonNullable<typeof t.activeVersion> } =>
      Boolean(t.activeVersion)
    );

  const [selectedId, setSelectedId] = useState(eligible[0]?.template.id ?? "");
  const [accepted, setAccepted] = useState(true);

  const selected = eligible.find((t) => t.template.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[1px] dark:bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#18201e]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">ثبت رضایت‌نامه</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {eligible.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            هیچ قالب رضایت‌نامه‌ی فعالی وجود ندارد. ابتدا از «تنظیمات ‹ فرم‌ساز پذیرش و رضایت‌نامه‌ها» یک قالب فعال
            بسازید.
          </p>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] text-gray-500 dark:text-gray-400">رضایت‌نامه</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200"
              >
                {eligible.map(({ template }) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <p className="max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-2.5 text-[11px] leading-relaxed text-gray-500 dark:bg-white/[0.04] dark:text-gray-400">
                {selected.activeVersion.content}
              </p>
            )}

            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              بیمار این رضایت‌نامه را پذیرفته است
            </label>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={!selected || isSubmitting}
            onClick={() =>
              selected &&
              onSign({
                consentVersionId: selected.activeVersion.id,
                serviceId: selected.template.serviceId ?? undefined,
                accepted,
              })
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "در حال ثبت..." : "ثبت رضایت‌نامه"}
          </button>
        </div>
      </div>
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
      <div className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
        {label}
      </div>

      {custom ?? (
        <div
          className={`mt-2 text-sm ${
            valueTone ?? "text-gray-800 dark:text-gray-200"
          }`}
        >
          {value}
        </div>
      )}
    </div>
  );
}