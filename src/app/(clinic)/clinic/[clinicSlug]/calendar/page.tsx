"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft, Plus, Clock3, Video, Filter, MoreHorizontal } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { getAppointments, getDoctors, completeAppointment, cancelAppointment, toLocalIsoDate } from "@/lib/api/appointments";
import { queryKeys } from "@/lib/query/keys";
import { LoadingLogo } from "@/components/LoadingLogo";

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-primary-light/20 text-primary-dark",
  pending: "bg-amber-50 text-warning",
  cancelled: "bg-red-50 text-danger",
  completed: "bg-primary-light/20 text-primary-dark",
  no_show: "bg-gray-100 text-gray-500",
  rescheduled: "bg-purple-50 text-purple-600",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "تایید‌شده",
  pending: "در انتظار",
  cancelled: "لغوشده",
  completed: "تکمیل‌شده",
  no_show: "عدم حضور",
  rescheduled: "تغییر زمان",
};

const TYPE_LABEL: Record<string, string> = {
  in_person: "حضوری",
  online: "آنلاین",
  followup: "پیگیری",
};

function getMinutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

export default function CalendarPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [doctorFilter, setDoctorFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<DateObject>(new DateObject({ calendar: persian, locale: persian_fa }));
  const queryClient = useQueryClient();

  const isoDate = toLocalIsoDate(selectedDate.toDate());

  const { data: doctors = [] } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.doctors(clinicSlug),
    queryFn: () => getDoctors(clinicSlug),
    enabled: !!clinicSlug,
  });

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: queryKeys.appointmentsCalendar.list(clinicSlug, isoDate, doctorFilter === "all" ? undefined : doctorFilter),
    queryFn: () =>
      getAppointments(clinicSlug, {
        from: isoDate,
        to: isoDate,
        doctorUserId: doctorFilter === "all" ? undefined : doctorFilter,
      }),
    enabled: !!clinicSlug,
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => completeAppointment(clinicSlug, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments-calendar", clinicSlug] }),
  });
  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelAppointment(clinicSlug, id, "لغو توسط کلینیک"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments-calendar", clinicSlug] }),
  });

  const goToPrevDay = () => setSelectedDate((prev) => new DateObject(prev).add(1, "day"));
  const goToNextDay = () => setSelectedDate((prev) => new DateObject(prev).subtract(1, "day"));
  const goToToday = () => setSelectedDate(new DateObject({ calendar: persian, locale: persian_fa }));

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  const sortedAppointments = [...appointments]
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .sort((a, b) => getMinutesOfDay(a.startTime) - getMinutesOfDay(b.startTime));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">نوبت‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت تقویم و نوبت‌دهی کلینیک</p>
        </div>
        <Link
          href={`/clinic/${clinicSlug}/calendar/new`}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> ثبت نوبت جدید
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goToNextDay} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>

          <DatePicker
            value={selectedDate}
            onChange={(val: DateObject | null) => {
              if (val !== null) {
                setSelectedDate(val);
              }
            }}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-center"
            render={(_value, openCalendar) => (
              <button
                onClick={openCalendar}
                className="rounded-lg px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {selectedDate.format("dddd، DD MMMM YYYY")}
              </button>
            )}
          />

          <button onClick={goToPrevDay} className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button onClick={goToToday} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            امروز
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
          >
            <option value="all">همه پزشکان</option>
            {doctors.map((d) => (
              <option key={d.userId} value={d.userId}>
                {d.fullName}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="confirmed">تایید‌شده</option>
            <option value="pending">در انتظار</option>
            <option value="completed">تکمیل‌شده</option>
            <option value="cancelled">لغوشده</option>
            <option value="no_show">عدم حضور</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-gray-800">برنامه‌ی روز</h2>

          {isLoading && <LoadingLogo />}
          {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت نوبت‌ها</div>}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* هدر ثابت */}
                <table className="w-full table-fixed text-right text-xs">
                  <colgroup>
                    <col className="w-[13%]" />
                    <col className="w-[20%]" />
                    <col className="w-[18%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                    <col className="w-[12%]" />
                    <col className="w-[7%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="py-2 font-medium">ساعت</th>
                      <th className="py-2 font-medium">مراجع</th>
                      <th className="py-2 font-medium">خدمت</th>
                      <th className="py-2 font-medium">پزشک</th>
                      <th className="py-2 font-medium">نوع</th>
                      <th className="py-2 font-medium">وضعیت</th>
                      <th className="py-2 font-medium">عملیات</th>
                    </tr>
                  </thead>
                </table>

                {/* بدنه‌ی اسکرول‌دار */}
                <div className="max-h-[420px] overflow-y-auto">
                  <table className="w-full table-fixed text-right text-xs">
                    <colgroup>
                      <col className="w-[13%]" />
                      <col className="w-[20%]" />
                      <col className="w-[18%]" />
                      <col className="w-[18%]" />
                      <col className="w-[12%]" />
                      <col className="w-[12%]" />
                      <col className="w-[7%]" />
                    </colgroup>
                    <tbody>
                      {sortedAppointments.map((a) => (
                        <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                          <td className="py-3 whitespace-nowrap font-medium text-gray-700" dir="ltr">
                            {formatTimeLabel(a.startTime)}
                            {a.endTime && <span className="text-gray-300"> – {formatTimeLabel(a.endTime)}</span>}
                          </td>
                          <td className="truncate py-3">
                            <Link href={`/clinic/${clinicSlug}/calendar/${a.id}`} className="font-medium text-gray-800 hover:text-primary-dark">
                              {a.patientName}
                            </Link>
                          </td>
                          <td className="truncate py-3 text-gray-500">{a.serviceName}</td>
                          <td className="truncate py-3 text-gray-500">{a.doctorName}</td>
                          <td className="py-3">
                            <span className="flex items-center gap-1 text-gray-500">
                              {a.appointmentType === "online" && <Video className="h-3 w-3 shrink-0 text-blue-500" />}
                              <span className="truncate">{TYPE_LABEL[a.appointmentType] ?? a.appointmentType}</span>
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_BADGE[a.status]}`}>
                              {STATUS_LABEL[a.status] ?? a.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/clinic/${clinicSlug}/calendar/${a.id}`}
                              className="rounded-lg  p-1.5 text-gray-400 hover:bg-gray-50"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {sortedAppointments.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-sm text-gray-300">
                            نوبتی برای این روز ثبت نشده.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">خلاصه‌ی روز</h3>
              <Filter className="h-4 w-4 text-gray-300" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">کل نوبت‌ها</span>
                <span className="font-medium text-gray-800">{appointments.length.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">تایید‌شده</span>
                <span className="font-medium text-primary-dark">{confirmed.length.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">در انتظار تایید</span>
                <span className="font-medium text-warning">{pending.length.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">لغوشده</span>
                <span className="font-medium text-danger">{cancelled.length.toLocaleString("fa-IR")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-gray-800">نوبت‌های در انتظار تایید</h3>
            <div className="space-y-3">
              {pending
                .sort((a, b) => getMinutesOfDay(a.startTime) - getMinutesOfDay(b.startTime))
                .map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-3.5 w-3.5 text-warning" />
                      <div>
                        <div className="font-medium text-gray-700">
                          {a.patientName} <span className="text-gray-400">· {formatTimeLabel(a.startTime)}</span>
                        </div>
                        <div className="text-[10px] text-gray-400">{a.serviceName}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => completeMutation.mutate(a.id)}
                        disabled={completeMutation.isPending}
                        className="rounded-lg bg-primary-light/15 px-2 py-1 text-[10px] text-primary-dark disabled:opacity-50"
                      >
                        تایید
                      </button>
                      <button
                        onClick={() => cancelMutation.mutate(a.id)}
                        disabled={cancelMutation.isPending}
                        className="rounded-lg bg-red-50 px-2 py-1 text-[10px] text-danger disabled:opacity-50"
                      >
                        رد
                      </button>
                    </div>
                  </div>
                ))}
              {pending.length === 0 && <p className="text-xs text-gray-300">موردی در انتظار تایید نیست.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}