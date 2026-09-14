"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getCurrentClinicUser } from "@/lib/api/session";
import { getAppointments } from "@/lib/api/appointments";
import { queryKeys } from "@/lib/query/keys";

/**
 * برای پزشک‌ها: پرونده‌ی مراجعینی که هیچ نوبتی با این پزشک نداشته‌اند
 * نباید در لیست بیماران/پرونده‌ها دیده شود. مدیر کلینیک و منشی همه را می‌بینند.
 *
 * این هوک لیست شناسه‌ی همان مراجعین را (فقط برای پزشک) با استفاده از
 * GET /appointments?doctor_user_id=... می‌سازد.
 */
export function useDoctorPatientScope(clinicSlug: string) {
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.session.currentUser(clinicSlug),
    queryFn: () => getCurrentClinicUser(clinicSlug),
    enabled: !!clinicSlug,
  });

  const isDoctor = currentUser?.roleKey === "doctor";
  const doctorUserId = isDoctor ? currentUser?.userId ?? undefined : undefined;

  const { data: doctorAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["doctor-patient-scope", clinicSlug, doctorUserId ?? "none"],
    queryFn: () => getAppointments(clinicSlug, { doctorUserId }),
    enabled: !!clinicSlug && isDoctor && !!doctorUserId,
  });

  const patientIds = useMemo(() => {
    if (!isDoctor) return null;
    return new Set(doctorAppointments.map((a) => a.patientId).filter(Boolean));
  }, [isDoctor, doctorAppointments]);

  return {
    isDoctor,
    patientIds,
    isLoading: userLoading || (isDoctor && appointmentsLoading),
  };
}