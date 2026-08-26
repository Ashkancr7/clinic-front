"use client";

import { use, useState } from "react";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  ClipboardList,
  ChevronDown,
  X,
} from "lucide-react";
import Image from "next/image";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import { ApiError } from "@/lib/api/client";
import { getPatientDetail, getPatientDebt } from "@/lib/api/patients";
import {
  getAppointmentDetail,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  markNoShow,
  sendAppointmentReminder,
  formatDurationMinutes,
  toLocalIsoDate,
  buildDateTime,
  extractTimeLabel,
  getAvailability,
  type AvailabilitySlot,
} from "@/lib/api/appointments";
import { queryKeys } from "@/lib/query/keys";
import { LoadingLogo } from "@/components/LoadingLogo";

const STATUS_LEGEND = [
  { label: "در انتظار تایید", tone: "bg-amber-50 text-warning", dot: "bg-warning", desc: "نوبت در انتظار بررسی و تایید است" },
  { label: "تکمیل شده", tone: "bg-primary-light/20 text-primary-dark", dot: "bg-primary", desc: "ویزیت انجام و نوبت تکمیل شده است" },
  { label: "لغو شده", tone: "bg-red-50 text-danger", dot: "bg-danger", desc: "نوبت توسط کلینیک یا بیمار لغو شده است" },
  { label: "تغییر زمان", tone: "bg-secondary-purple/40 text-purple-600", dot: "bg-purple-500", desc: "زمان نوبت تغییر کرده است" },
  { label: "تایید شده", tone: "bg-primary-light/20 text-primary-dark", dot: "bg-primary", desc: "نوبت توسط کلینیک تایید و برنامه‌ریزی شده است" },
  { label: "عدم حضور", tone: "bg-secondary-pink/40 text-pink-600", dot: "bg-pink-500", desc: "بیمار در زمان مقرر حضور نداشته است" },
];

// این بخش‌ها هنوز منبع API مطمئنی ندارند — دست‌نخورده باقی می‌مانند
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

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-primary-light/20 text-primary-dark",
  pending: "bg-amber-50 text-warning",
  cancelled: "bg-red-50 text-danger",
  completed: "bg-primary-light/20 text-primary-dark",
  no_show: "bg-secondary-pink/40 text-pink-600",
  rescheduled: "bg-secondary-purple/40 text-purple-600",
};
const STATUS_TEXT: Record<string, string> = {
  confirmed: "تایید شده",
  pending: "در انتظار تایید",
  cancelled: "لغو شده",
  completed: "تکمیل شده",
  no_show: "عدم حضور",
  rescheduled: "تغییر زمان",
};
const SOURCE_LABEL: Record<string, string> = {
  admin: "پنل مدیریت",
  receptionist: "پذیرش",
  patient_portal: "پنل بیمار",
  website: "وب‌سایت",
};

function formatJalaliDate(iso: string) {
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
    return "—";
  }
}

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ clinicSlug: string; appointmentId: string }>;
}) {
  const { clinicSlug, appointmentId } = use(params);
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const { data: appt, isLoading, error } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.detail(clinicSlug, appointmentId),
    queryFn: () => getAppointmentDetail(clinicSlug, appointmentId),
    enabled: !!clinicSlug && !!appointmentId,
  });

  const { data: patientDetail } = useQuery({
    queryKey: queryKeys.patients.detail(clinicSlug, appt?.patientId ?? ""),
    queryFn: () => getPatientDetail(clinicSlug, appt!.patientId!),
    enabled: !!clinicSlug && !!appt?.patientId,
  });

  const { data: debt } = useQuery({
    queryKey: [...queryKeys.patients.detail(clinicSlug, appt?.patientId ?? ""), "debt"],
    queryFn: () => getPatientDebt(clinicSlug, appt!.patientId!),
    enabled: !!clinicSlug && !!appt?.patientId,
  });

  function invalidateAppointment() {
    queryClient.invalidateQueries({ queryKey: queryKeys.appointmentsCalendar.detail(clinicSlug, appointmentId) });
    queryClient.invalidateQueries({ queryKey: ["appointments-calendar", clinicSlug] });
  }

  const completeMutation = useMutation({
    mutationFn: () => completeAppointment(clinicSlug, appointmentId),
    onSuccess: () => {
      setActionError(null);
      setActionMessage("نوبت با موفقیت تکمیل شد.");
      invalidateAppointment();
    },
    onError: (e) => setActionError(e instanceof Error ? e.message : "عملیات ناموفق بود"),
  });

  const noShowMutation = useMutation({
    mutationFn: () => markNoShow(clinicSlug, appointmentId),
    onSuccess: () => {
      setActionError(null);
      setActionMessage("عدم حضور بیمار ثبت شد.");
      invalidateAppointment();
    },
    onError: (e) => setActionError(e instanceof Error ? e.message : "عملیات ناموفق بود"),
  });

  const cancelMutation = useMutation({
    mutationFn: () => {
      const reason = prompt("دلیل لغو نوبت را وارد کنید:");
      if (!reason) throw new Error("لغو انصراف داده شد");
      return cancelAppointment(clinicSlug, appointmentId, reason);
    },
    onSuccess: () => {
      setActionError(null);
      setActionMessage("نوبت لغو شد.");
      invalidateAppointment();
    },
    onError: (e) => {
      if (e instanceof Error && e.message === "لغو انصراف داده شد") return;
      setActionError(e instanceof Error ? e.message : "عملیات ناموفق بود");
    },
  });

  const reminderMutation = useMutation({
    mutationFn: () => sendAppointmentReminder(clinicSlug, appointmentId),
    onSuccess: () => {
      setActionError(null);
      setActionMessage("درخواست یادآوری ثبت شد.");
    },
    onError: (e) => setActionError(e instanceof Error ? e.message : "ارسال یادآوری ناموفق بود"),
  });

  const rescheduleMutation = useMutation({
    mutationFn: (payload: { date: string; time: string }) => {
      if (!appt) throw new Error("نوبت یافت نشد");
      const durationMin = formatDurationMinutes(appt.startTime, appt.endTime) ?? 30;
      const newStart = buildDateTime(payload.date, payload.time);
      const newEnd = new Date(new Date(newStart).getTime() + durationMin * 60000).toISOString();
      return rescheduleAppointment(clinicSlug, appointmentId, { start_time: newStart, end_time: newEnd });
    },
    onSuccess: () => {
      setActionError(null);
      setActionMessage("زمان نوبت تغییر کرد.");
      setShowRescheduleModal(false);
      invalidateAppointment();
    },
    onError: (e) => {
      if (e instanceof ApiError && e.status === 409) {
        setActionError("این بازه‌ی زمانی برای این پزشک قبلاً رزرو شده است.");
      } else {
        setActionError(e instanceof Error ? e.message : "تغییر زمان ناموفق بود");
      }
    },
  });

  // حالت loading — باید قبل از چک error/!appt برگردانده شود، وگرنه
  // چون appt هنوز undefined است، شرط پایین به‌اشتباه «نوبت یافت نشد» را نشان می‌دهد
  if (isLoading) {
    return <LoadingLogo />;
  }

  if (error || !appt) {
    return <div className="py-20 text-center text-sm text-danger">نوبت یافت نشد.</div>;
  }

  const durationMin = formatDurationMinutes(appt.startTime, appt.endTime);

  const ACTIONS = [
    { icon: CalendarCog, label: "تغییر زمان", onClick: () => setShowRescheduleModal(true), disabled: false },
    { icon: XCircle, label: "لغو نوبت", onClick: () => cancelMutation.mutate(), disabled: cancelMutation.isPending, danger: true },
    { icon: CheckCircle2, label: "علامت تکمیل شده", onClick: () => completeMutation.mutate(), disabled: completeMutation.isPending },
    { icon: UserX, label: "علامت عدم حضور", onClick: () => noShowMutation.mutate(), disabled: noShowMutation.isPending, danger: true },
    { icon: BellRing, label: "ارسال یادآوری", onClick: () => reminderMutation.mutate(), disabled: reminderMutation.isPending },
    // «شروع ویزیت آنلاین» هنوز وصل نشده — نیاز به صفحه‌ی جلسه‌ی ویدئویی دارد که هنوز ساخته نشده
    { icon: Video, label: "شروع ویزیت آنلاین", onClick: () => {}, disabled: true },
  ];

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

      {actionError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{actionError}</p>}
      {actionMessage && (
        <p className="rounded-lg bg-primary-light/15 px-3 py-2 text-xs font-medium text-primary-dark">{actionMessage}</p>
      )}

      {/* کارت خلاصه نوبت — از API واقعی */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <SummaryItem label="مراجع (بیمار)" value={appt.patientName} sub={appt.patientPhone || "—"} avatar action="مشاهده پروفایل" />
          <SummaryItem icon={Stethoscope} label="پزشک / اپراتور" value={appt.doctorName} avatar />
          <SummaryItem icon={Sparkles} label="خدمت" value={appt.serviceName} />
          <SummaryItem icon={CalendarDays} label="تاریخ" value={formatJalaliDate(appt.startTime)} />
          <SummaryItem icon={Clock3} label="ساعت" value={`${formatTime(appt.startTime)}${durationMin ? ` - ${durationMin.toLocaleString("fa-IR")} دقیقه` : ""}`} />
          <SummaryItem
            custom={
              <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_BADGE[appt.status]}`}>
                {STATUS_TEXT[appt.status] ?? appt.status}
              </span>
            }
            label="وضعیت نوبت"
          />
          {/* وضعیت پرداخت هیچ منبع مستقیمی در بک‌اند ندارد (فاکتور به appointment متصل نیست) — mock باقی می‌ماند */}
          <SummaryItem custom={<span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] text-danger">پرداخت نشده</span>} label="وضعیت پرداخت" />
          <SummaryItem icon={Globe} label="کانال نوبت" value={appt.source ? (SOURCE_LABEL[appt.source] ?? appt.source) : "—"} />
        </div>
      </div>

      {/* دکمه‌های اکشن — از API واقعی */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            disabled={a.disabled}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[11px] whitespace-nowrap transition disabled:opacity-40
          ${a.danger ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            <a.icon className={`h-3.5 w-3.5 shrink-0 ${a.danger ? "text-red-500" : "text-primary-dark"}`} />
            <span>{a.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          {/* پروفایل بیمار — از API واقعی (کدملی، سن، تلفن، موجودی حساب) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <UserRound className="h-4 w-4 text-primary-dark" /> پروفایل بیمار
            </h3>
            <div className="flex items-center gap-3">
              <Image src="/image/user.PNG" alt="User" width={30} height={30} unoptimized className="rounded-full object-cover" />
              <div>
                <div className="text-sm font-bold text-gray-900">{appt.patientName}</div>
                <div className="text-[10px] text-gray-400">کد ملی: {patientDetail?.patient.nationalId ?? "—"}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3 text-gray-300" />
                تاریخ تولد:{" "}
                {patientDetail?.patient.birthDate
                  ? `${new Date(patientDetail.patient.birthDate).toLocaleDateString("fa-IR")}${
                      patientDetail.patient.age != null ? ` (${patientDetail.patient.age.toLocaleString("fa-IR")} سال)` : ""
                    }`
                  : "—"}
              </div>
              <div className="flex items-center gap-1.5" dir="ltr">
                <Phone className="h-3 w-3 text-gray-300" /> {appt.patientPhone || "—"}
              </div>
              {/* ایمیل حذف شد — Patient در بک‌اند اصلاً فیلد ایمیل ندارد */}
            </div>
            <button className="mt-3 flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-[11px] text-gray-600">
              موجودی حساب: {debt != null ? `${debt.toLocaleString("fa-IR")} تومان` : "—"}
              <Pencil className="h-3 w-3 text-gray-300" />
            </button>
            {/* سطح وفاداری و شمارش نوبت‌ها هیچ منبع API ندارند — دست‌نخورده mock */}
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

          {/* نتیجه و خروجی ویزیت — mock (فیلد مربوطه در Appointment نیست، جزو Visit است) */}
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

        {/* ستون وسط — کاملاً mock */}
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
              {appt.notes || "بیمار سابقه حساسیت به رتینول دارد. در جلسه قبل واکنش خاصی مشاهده نشد."}
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-300">
              <span>آخرین ویرایش: دکتر سارا محمدی - ۲۲ خرداد ۱۴۰۳ - ۱۱:۲۰</span>
              <button className="flex items-center gap-1 text-primary-dark">
                <Plus className="h-3 w-3" /> افزودن یادداشت
              </button>
            </div>
          </div>
        </div>

        {/* ستون چپ — کاملاً mock */}
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
            <button
              onClick={() => reminderMutation.mutate()}
              disabled={reminderMutation.isPending}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-primary-light/15 py-2 text-[11px] font-medium text-primary-dark disabled:opacity-50"
            >
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

      {showRescheduleModal && appt.doctorId && (
        <RescheduleModal
          clinicSlug={clinicSlug}
          doctorId={appt.doctorId}
          currentStartTime={appt.startTime}
          currentEndTime={appt.endTime}
          onClose={() => setShowRescheduleModal(false)}
          onSubmit={(date, time) => rescheduleMutation.mutate({ date, time })}
          isSubmitting={rescheduleMutation.isPending}
        />
      )}
    </div>
  );
}

function RescheduleModal({
  clinicSlug,
  doctorId,
  currentStartTime,
  currentEndTime,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  clinicSlug: string;
  doctorId: number;
  currentStartTime: string;
  currentEndTime: string;
  onClose: () => void;
  onSubmit: (date: string, time: string) => void;
  isSubmitting: boolean;
}) {
  const [date, setDate] = useState<DateObject>(
    new DateObject({ date: new Date(currentStartTime), calendar: persian, locale: persian_fa })
  );
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const isoDate = toLocalIsoDate(date.toDate());
  const currentTimeLabel = extractTimeLabel(
    new Date(currentStartTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const isSameDayAsCurrent = isoDate === toLocalIsoDate(new Date(currentStartTime));

  const { data: rawSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.availability(clinicSlug, doctorId, isoDate),
    queryFn: () => getAvailability(clinicSlug, { doctorUserId: doctorId, date: isoDate }),
    enabled: !!clinicSlug && !!doctorId,
  });

  // ساعت فعلی خودِ همین نوبت را هم به لیست اضافه می‌کند (چون آن ساعت طبیعتاً
  // در لیست availability به‌عنوان اشغال‌شده حساب می‌شود و نباید مخفی بماند)
  const slots = useMemoSlots(rawSlots, isSameDayAsCurrent, currentTimeLabel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">تغییر زمان نوبت</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100">
          <Calendar
            value={date}
            onChange={(v) => {
              if (v) {
                setDate(v as DateObject);
                setSelectedSlot(null);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            shadow={false}
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-gray-600">ساعت جدید</label>

          {slotsLoading && <p className="text-[11px] text-gray-300">در حال دریافت ساعت‌های آزاد...</p>}
          {!slotsLoading && slots.length === 0 && <p className="text-[11px] text-gray-300">ساعت آزادی برای این روز نیست.</p>}

          <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto">
            {slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-xl border py-2 text-xs ${
                  selectedSlot?.start === slot.start
                    ? "border-primary bg-primary-light/10 font-medium text-primary-dark"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {extractTimeLabel(slot.start)}
                {extractTimeLabel(slot.start) === currentTimeLabel && isSameDayAsCurrent && (
                  <span className="mr-1 text-[9px] text-gray-400">(فعلی)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            انصراف
          </button>
          <button
            disabled={!selectedSlot || isSubmitting}
            onClick={() => selectedSlot && onSubmit(isoDate, extractTimeLabel(selectedSlot.start))}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت تغییر"}
          </button>
        </div>
      </div>
    </div>
  );
}

function useMemoSlots(rawSlots: AvailabilitySlot[], isSameDayAsCurrent: boolean, currentTimeLabel: string): AvailabilitySlot[] {
  const hasCurrent = rawSlots.some((s) => extractTimeLabel(s.start) === currentTimeLabel);
  if (isSameDayAsCurrent && !hasCurrent) {
    return [{ start: currentTimeLabel, end: "" }, ...rawSlots];
  }
  return rawSlots;
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
          {avatar && <Image src="/image/user.PNG" alt="User" width={30} height={30} unoptimized className="rounded-full object-cover" />}
          {Icon && !avatar && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-300" />}
          <div>
            <div className="text-xs font-medium text-gray-700">{value}</div>
            {sub && <div className="text-[9px] text-gray-400">{sub}</div>}
          </div>
        </div>
      )}
      {action && <button className="mt-1.5 rounded-lg bg-primary-light/15 px-2 py-1 text-[9px] text-primary-dark">{action}</button>}
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