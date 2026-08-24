"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarPlus,
  UserRound,
  Clock3,
  RefreshCcw,
  Video,
  Search,
  Stethoscope,
  Sparkles,
  StickyNote,
  X,
  Check,
} from "lucide-react";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import { ApiError } from "@/lib/api/client";
import { searchPatients, type PatientSearchResult } from "@/lib/api/patients";
import {
  getDoctors,
  getServicesForBooking,
  getAvailability,
  getAppointments,
  createAppointment,
  buildDateTime,
  addMinutesToIso,
  extractTimeLabel,
  filterBookedSlots,
  toLocalIsoDate,
  type AvailabilitySlot,
} from "@/lib/api/appointments";
import { queryKeys } from "@/lib/query/keys";

const APPOINTMENT_TYPES = [
  { key: "in_person" as const, icon: UserRound, tone: "text-primary-dark bg-primary-light/20", title: "حضوری", desc: "مراجعه به کلینیک" },
  { key: "online" as const, icon: Video, tone: "text-blue-600 bg-secondary-blue/40", title: "آنلاین", desc: "مشاوره و خدمات آنلاین" },
  { key: "followup" as const, icon: RefreshCcw, tone: "text-purple-600 bg-secondary-purple/40", title: "پیگیری", desc: "نوبت پیگیری و چکاپ" },
];

export default function NewAppointmentPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [date, setDate] = useState<DateObject>(new DateObject({ calendar: persian, locale: persian_fa }));
  const [appointmentType, setAppointmentType] = useState<"in_person" | "online" | "followup">("in_person");
  const [smsReminder, setSmsReminder] = useState(true);
  const [notes, setNotes] = useState("");

  const [patientQuery, setPatientQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  const [showPatientResults, setShowPatientResults] = useState(false);

  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isoDate = toLocalIsoDate(date.toDate());

  const { data: patientResults = [] } = useQuery({
    queryKey: [...queryKeys.patients.lookup(patientQuery), clinicSlug],
    queryFn: () => searchPatients(clinicSlug, patientQuery),
    enabled: patientQuery.trim().length >= 2,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.doctors(clinicSlug),
    queryFn: () => getDoctors(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: services = [] } = useQuery({
    queryKey: queryKeys.services.list(clinicSlug),
    queryFn: () => getServicesForBooking(clinicSlug),
    enabled: !!clinicSlug,
  });

  const selectedService = services.find((s) => s.id === serviceId);

  const { data: rawSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.availability(clinicSlug, doctorId ?? 0, isoDate),
    queryFn: () => getAvailability(clinicSlug, { doctorUserId: doctorId!, date: isoDate, serviceId: serviceId ?? undefined }),
    enabled: !!clinicSlug && !!doctorId,
  });

  // نوبت‌های موجود همین پزشک در همین روز، برای فیلتر کردن اسلات‌های اشغال‌شده
  const { data: doctorAppointmentsForDay = [] } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.list(clinicSlug, isoDate, doctorId ?? undefined),
    queryFn: () => getAppointments(clinicSlug, { from: isoDate, to: isoDate, doctorUserId: doctorId! }),
    enabled: !!clinicSlug && !!doctorId,
  });

  const slots = useMemo(
    () => filterBookedSlots(rawSlots, doctorAppointmentsForDay),
    [rawSlots, doctorAppointmentsForDay]
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPatient) throw new Error("مراجع را انتخاب کنید");
      if (!doctorId) throw new Error("پزشک را انتخاب کنید");
      if (!selectedSlot) throw new Error("ساعت نوبت را انتخاب کنید");

      const startTime = buildDateTime(isoDate, selectedSlot.start);
      const endTime = selectedSlot.end
        ? buildDateTime(isoDate, selectedSlot.end)
        : addMinutesToIso(startTime, selectedService?.defaultDurationMinutes ?? 30);

      return createAppointment(clinicSlug, {
        patient_id: selectedPatient.id,
        doctor_user_id: doctorId,
        service_id: serviceId ?? undefined,
        appointment_type: appointmentType,
        start_time: startTime,
        end_time: endTime,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      setError(null);
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["appointments-calendar", clinicSlug] });
      setTimeout(() => {
        router.push(`/clinic/${clinicSlug}/calendar`);
      }, 1200);
    },
    onError: (e) => {
      setSuccess(false);
      if (e instanceof ApiError && e.status === 409) {
        setError("این بازه‌ی زمانی قبلاً برای این پزشک رزرو شده است. لطفاً ساعت دیگری انتخاب کنید.");
        setSelectedSlot(null);
        // لیست نوبت‌های همین پزشک/روز را دوباره می‌خواند تا اسلات اشغال‌شده از لیست حذف شود
        queryClient.invalidateQueries({ queryKey: ["appointments-calendar", clinicSlug] });
      } else {
        setError(e instanceof Error ? e.message : "ثبت نوبت ناموفق بود");
      }
    },
  });

  return (
    <div className="space-y-4">
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

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}
      {success && (
        <p className="flex items-center gap-1.5 rounded-lg bg-primary-light/15 px-3 py-2 text-xs font-medium text-primary-dark">
          <Check className="h-3.5 w-3.5" /> نوبت با موفقیت ثبت شد. در حال انتقال به لیست نوبت‌ها...
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="space-y-4 lg:order-2">
          <div className="rounded-2xl border border-gray-100 bg-white">
            <Calendar value={date}
              onChange={(v: DateObject | null) => {

                if (v !== null) {
                  setDate(v);
                }
              }} calendar={persian} locale={persian_fa} shadow={false} className="clinic-calendar" />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <UserRound className="h-4 w-4 text-primary-dark" /> اطلاعات مراجع
            </h3>

            <div className="relative">
              <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  value={patientQuery}
                  onChange={(e) => {
                    setPatientQuery(e.target.value);
                    setShowPatientResults(true);
                    setSelectedPatient(null);
                  }}
                  onFocus={() => setShowPatientResults(true)}
                  placeholder="جستجو با نام، موبایل یا کد ملی..."
                  className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-300"
                />
                <Search className="h-4 w-4 shrink-0 text-gray-300" />
              </div>

              {showPatientResults && patientResults.length > 0 && !selectedPatient && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                  {patientResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setPatientQuery(p.fullName);
                        setShowPatientResults(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-right text-xs hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-700">{p.fullName}</span>
                      <span className="text-gray-400" dir="ltr">{p.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-gray-50 p-2.5">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
                <div>
                  <div className="text-xs font-semibold text-gray-800">{selectedPatient.fullName}</div>
                  <div className="text-[10px] text-gray-400" dir="ltr">{selectedPatient.phone}</div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Clock3 className="h-4 w-4 text-primary-dark" /> ساعت‌های در دسترس
            </h3>

            {!doctorId && <p className="text-[11px] text-gray-300">ابتدا پزشک را انتخاب کنید.</p>}
            {doctorId && slotsLoading && <p className="text-[11px] text-gray-300">در حال دریافت ساعت‌های آزاد...</p>}
            {doctorId && !slotsLoading && slots.length === 0 && <p className="text-[11px] text-gray-300">ساعت آزادی برای این روز نیست.</p>}

            <div className="space-y-2">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full rounded-xl border py-2 text-xs ${selectedSlot?.start === slot.start
                      ? "border-primary bg-primary-light/10 font-medium text-primary-dark"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {extractTimeLabel(slot.start)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:order-1 lg:col-span-3">
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

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-gray-600">
                  پزشک / متخصص <span className="text-danger">*</span>
                </label>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
                  <select
                    value={doctorId ?? ""}
                    onChange={(e) => {
                      setDoctorId(e.target.value ? Number(e.target.value) : null);
                      setSelectedSlot(null);
                    }}
                    className="w-full bg-transparent text-xs text-gray-700 outline-none"
                  >
                    <option value="">انتخاب پزشک / متخصص</option>
                    {doctors.map((d) => (
                      <option key={d.userId} value={d.userId}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                  <Stethoscope className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-gray-600">
                  خدمت اصلی <span className="text-danger">*</span>
                </label>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5">
                  <select
                    value={serviceId ?? ""}
                    onChange={(e) => setServiceId(e.target.value || null)}
                    className="w-full bg-transparent text-xs text-gray-700 outline-none"
                  >
                    <option value="">انتخاب خدمت</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-gray-600">ساعت انتخاب‌شده</label>
                <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 text-xs">
                  {selectedSlot ? (
                    <span className="font-medium text-primary-dark">{extractTimeLabel(selectedSlot.start)}</span>
                  ) : (
                    <span className="text-gray-300">از ستون کناری انتخاب کنید</span>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-gray-600">تاریخ نوبت</label>
                <div className="flex items-center rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700">
                  {date.format("YYYY/MM/DD")}
                </div>
              </div>

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
            </div>

            <div className="mt-4">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-gray-600">
                <StickyNote className="h-3.5 w-3.5" /> یادداشت‌ها (اختیاری)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="توضیحات یا نکات مرتبط با این نوبت..."
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-700 outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || success}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> {createMutation.isPending ? "در حال ثبت..." : "ثبت نوبت"}
            </button>

            <Link
              href={`/clinic/${clinicSlug}/calendar`}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm text-gray-600 hover:bg-gray-50"
            >
              <X className="h-4 w-4" /> انصراف
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}