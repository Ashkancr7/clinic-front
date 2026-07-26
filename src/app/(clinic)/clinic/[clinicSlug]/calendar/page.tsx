"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Clock3,
  Video,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const DOCTORS = [
  { id: "all", name: "همه پزشکان" },
  { id: "sara", name: "دکتر سارا محمدی" },
  { id: "arash", name: "دکتر آرش نیکنام" },
  { id: "reza", name: "دکتر رضا کاویانی" },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const APPOINTMENTS = [
  { id: "apt-1", time: "09:00", endTime: "09:45", patient: "سارا محمدی", service: "مزوتراپی صورت", doctor: "دکتر سارا محمدی", type: "حضوری", status: "تایید‌شده" },
  { id: "apt-2", time: "10:30", endTime: "11:00", patient: "نگین رضوی", service: "بوتاکس", doctor: "دکتر سارا محمدی", type: "حضوری", status: "تایید‌شده" },
  { id: "apt-3", time: "11:15", endTime: "11:45", patient: "مریم اکبری", service: "مشاوره پوست", doctor: "دکتر رضا کاویانی", type: "آنلاین", status: "در انتظار" },
  { id: "apt-4", time: "13:00", endTime: "13:30", patient: "الناز حیدری", service: "لیزر موهای زائد", doctor: "دکتر آرش نیکنام", type: "حضوری", status: "تایید‌شده" },
  { id: "apt-5", time: "15:30", endTime: "16:00", patient: "پریسا کاظمی", service: "تزریق ژل لب", doctor: "دکتر سارا محمدی", type: "حضوری", status: "لغوشده" },
];

const STATUS_TONE: Record<string, string> = {
  "تایید‌شده": "border-primary bg-primary-light/10",
  "در انتظار": "border-warning bg-amber-50",
  "لغوشده": "border-danger bg-red-50",
};

const STATUS_BADGE: Record<string, string> = {
  "تایید‌شده": "bg-primary-light/20 text-primary-dark",
  "در انتظار": "bg-amber-50 text-warning",
  "لغوشده": "bg-red-50 text-danger",
};

export default function CalendarPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState<DateObject>(
    new DateObject({ calendar: persian, locale: persian_fa })
  );

  const filtered = APPOINTMENTS.filter(
    (a) => doctorFilter === "all" || a.doctor === DOCTORS.find((d) => d.id === doctorFilter)?.name
  );

  const goToPrevDay = () => {
    setSelectedDate((prev) => new DateObject(prev).add(1, "day"));

  };

  const goToNextDay = () => {
    setSelectedDate((prev) => new DateObject(prev).subtract(1, "day"));

  };

  const goToToday = () => {
    setSelectedDate(new DateObject({ calendar: persian, locale: persian_fa }));
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
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

      {/* نوار ابزار تاریخ و فیلتر */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToNextDay}
            className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <DatePicker
            value={selectedDate}
            onChange={(val) => {
              if (val) setSelectedDate(val as DateObject);
            }}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-center"
            render={(value, openCalendar) => (
              <button
                onClick={openCalendar}
                className="rounded-lg px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {selectedDate.format("dddd، DD MMMM YYYY")}
              </button>
            )}
          />

          <button
            onClick={goToPrevDay}
            className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={goToToday}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            امروز
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 outline-none"
          >
            {DOCTORS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl border border-gray-200 p-0.5">
            <button
              onClick={() => setView("day")}
              className={`rounded-lg px-3 py-1.5 text-xs ${view === "day" ? "bg-primary text-white" : "text-gray-500"}`}
            >
              روزانه
            </button>
            <button
              onClick={() => setView("week")}
              className={`rounded-lg px-3 py-1.5 text-xs ${view === "week" ? "bg-primary text-white" : "text-gray-500"}`}
            >
              هفتگی
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* تایم‌لاین روز */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-gray-800">برنامه‌ی امروز</h2>

          <div className="relative space-y-3 border-r-2 border-gray-100 pr-4">
            {TIME_SLOTS.map((slot) => {
              const appt = filtered.find((a) => a.time === slot);
              return (
                <div key={slot} className="relative flex items-start gap-3">
                  <span className="absolute -right-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-gray-200" />
                  <span className="w-12 shrink-0 text-[11px] text-gray-400">{slot}</span>

                  {appt ? (
                    <Link
                      href={`/clinic/${clinicSlug}/calendar/${appt.id}`}
                      className={`flex-1 rounded-xl border p-3 transition-shadow hover:shadow-sm ${STATUS_TONE[appt.status]}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 shrink-0 rounded-full bg-white" />
                          <div>
                            <div className="text-xs font-semibold text-gray-800">{appt.patient}</div>
                            <div className="text-[11px] text-gray-500">
                              {appt.service} · {appt.doctor}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {appt.type === "آنلاین" && <Video className="h-3.5 w-3.5 text-blue-500" />}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_BADGE[appt.status]}`}>
                            {appt.status}
                          </span>
                          <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1 rounded-xl border border-dashed border-gray-100 p-3 text-[11px] text-gray-300">
                      خالی
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* خلاصه امروز */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">خلاصه‌ی امروز</h3>
              <Filter className="h-4 w-4 text-gray-300" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">کل نوبت‌ها</span>
                <span className="font-medium text-gray-800">{APPOINTMENTS.length.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">تایید‌شده</span>
                <span className="font-medium text-primary-dark">
                  {APPOINTMENTS.filter((a) => a.status === "تایید‌شده").length.toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">در انتظار تایید</span>
                <span className="font-medium text-warning">
                  {APPOINTMENTS.filter((a) => a.status === "در انتظار").length.toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">لغوشده</span>
                <span className="font-medium text-danger">
                  {APPOINTMENTS.filter((a) => a.status === "لغوشده").length.toLocaleString("fa-IR")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-gray-800">نوبت‌های در انتظار تایید</h3>
            <div className="space-y-3">
              {APPOINTMENTS.filter((a) => a.status === "در انتظار").map((a) => (
                <div key={a.patient} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-3.5 w-3.5 text-warning" />
                    <div>
                      <div className="font-medium text-gray-700">{a.patient}</div>
                      <div className="text-[10px] text-gray-400">{a.service}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-lg bg-primary-light/15 px-2 py-1 text-[10px] text-primary-dark">
                      تایید
                    </button>
                    <button className="rounded-lg bg-red-50 px-2 py-1 text-[10px] text-danger">رد</button>
                  </div>
                </div>
              ))}
              {APPOINTMENTS.filter((a) => a.status === "در انتظار").length === 0 && (
                <p className="text-xs text-gray-300">موردی در انتظار تایید نیست.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
