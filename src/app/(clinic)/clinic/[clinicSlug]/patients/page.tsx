"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  Send,
  FileSpreadsheet,
  Calendar,
  Link2,
  FolderOpen,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Users,
  ArrowDownUp,
  X,
} from "lucide-react";
import Image from "next/image";

import { getPatients, createPatient, type PatientListItem } from "@/lib/api/patients";
import { queryKeys } from "@/lib/query/keys";

const STATUS_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  active: { dot: "bg-primary", text: "text-primary-dark", label: "فعال" },
  inactive: { dot: "bg-gray-300", text: "text-gray-400", label: "غیرفعال" },
  archived: { dot: "bg-gray-300", text: "text-gray-400", label: "آرشیو" },
};

// این دو کارت هیچ منبع داده‌ای در بک‌اند ندارند (نه endpoint نوبت آینده به‌ازای
// بیمار، نه شمارش هشدار پزشکی) — طبق دستور، دقیقاً همان مقدار mock باقی می‌مانند.
const STATIC_STATS = [
  { key: "upcoming", label: "دارای نوبت آینده", value: "۴۲۳ نفر", icon: CalendarClock, tone: "bg-blue-50 text-blue-500" },
  { key: "alerts", label: "هشدار پزشکی", value: "۲۹ نفر", icon: AlertTriangle, tone: "bg-danger/10 text-danger" },
];

function formatJalaliDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

export default function PatientsListPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: queryKeys.patients.list(clinicSlug, { search }),
    queryFn: () => getPatients(clinicSlug, search || undefined),
    enabled: !!clinicSlug,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof createPatient>[1]) => createPatient(clinicSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.list(clinicSlug, { search }) });
      setShowCreateModal(false);
    },
  });

  const stats = useMemo(
    () => ({
      total: patients.length,
      active: patients.filter((p) => p.status === "active").length,
    }),
    [patients]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">لیست مراجعین</h1>
          <p className="mt-1 text-sm text-gray-400">جستجو، فیلتر و مدیریت اطلاعات بیماران کلینیک</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            <FileSpreadsheet className="h-4 w-4" /> خروجی اکسل
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            <Send className="h-4 w-4" /> ارسال پیامک
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            <UserPlus className="h-4 w-4" /> افزودن مراجعه‌کننده
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="جستجو بر اساس نام، نام خانوادگی، کد ملی یا موبایل..."
                className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
              />
              <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
              <SlidersHorizontal className="h-3.5 w-3.5" /> فیلترها
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
            <div>
              <p className="text-[11px] text-gray-400">کل مراجعین</p>
              <p className="mt-1 text-base font-bold text-gray-900">
                {isLoading ? "…" : `${stats.total.toLocaleString("fa-IR")} نفر`}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-purple/30 text-purple-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
            <div>
              <p className="text-[11px] text-gray-400">مراجعین فعال</p>
              <p className="mt-1 text-base font-bold text-gray-900">
                {isLoading ? "…" : `${stats.active.toLocaleString("fa-IR")} نفر`}
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          {STATIC_STATS.map((s) => (
            <div key={s.key} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="text-[11px] text-gray-400">{s.label}</p>
                <p className="mt-1 text-base font-bold text-gray-900">{s.value}</p>
              </div>
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <ArrowDownUp className="h-3.5 w-3.5" /> مرتب‌سازی: جدیدترین
          </button>
        </div>

        {isLoading && <div className="py-10 text-center text-sm text-gray-400">در حال بارگذاری...</div>}
        {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت لیست مراجعین</div>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="py-2 font-medium">نام و نام خانوادگی</th>
                  <th className="py-2 font-medium">موبایل</th>
                  <th className="py-2 font-medium">کد ملی</th>
                  <th className="py-2 font-medium">سن</th>
                  <th className="py-2 font-medium">آخرین مراجعه</th>
                  <th className="py-2 font-medium">پزشک معالج</th>
                  <th className="py-2 font-medium">وضعیت</th>
                  <th className="py-2 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => {
                  const status = p.status ? STATUS_STYLE[p.status] : null;
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                      <td className="py-3">
                        <Link href={`/clinic/${clinicSlug}/patients/${p.id}`} className="flex items-center gap-2">
                          <Image src="/image/user.PNG" alt="User" width={30} height={30} unoptimized className="rounded-full object-cover" />
                          <span className="font-medium text-gray-800 hover:text-primary-dark">
                            {p.firstName} {p.lastName}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3 text-gray-500" dir="ltr">
                        {p.phone || "—"}
                      </td>
                      <td className="py-3 text-gray-500" dir="ltr">
                        {p.nationalId ?? "—"}
                      </td>
                      <td className="py-3 text-gray-500">{p.age != null ? p.age.toLocaleString("fa-IR") : "—"}</td>
                      <td className="py-3 text-gray-500">{formatJalaliDate(p.lastVisitAt)}</td>
                      {/* بک‌اند فیلدی برای پزشک معالج بیمار ندارد */}
                      <td className="py-3 text-gray-300">—</td>
                      <td className="py-3">
                        {status ? (
                          <span className={`flex items-center gap-1 ${status.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /> {status.label}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button title="ارسال لینک" className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                            <Link2 className="h-3.5 w-3.5" />
                          </button>
                          <button title="ثبت نوبت" className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
                            <Calendar className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            href={`/clinic/${clinicSlug}/patients/${p.id}`}
                            title="مشاهده پرونده"
                            className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-400">
                      موردی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePatientModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={createMutation.error instanceof Error ? createMutation.error.message : null}
        />
      )}
    </div>
  );
}

function CreatePatientModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: { first_name: string; last_name: string; phone: string; national_id?: string }) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">افزودن مراجعه‌کننده</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-600">نام</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">نام خانوادگی</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">موبایل</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="09121112233" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">کد ملی (اختیاری)</label>
            <input value={nationalId} onChange={(e) => setNationalId(e.target.value)} dir="ltr" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            انصراف
          </button>
          <button
            disabled={!firstName || !lastName || !phone || isSubmitting}
            onClick={() => onSubmit({ first_name: firstName, last_name: lastName, phone, national_id: nationalId || undefined })}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت"}
          </button>
        </div>
      </div>
    </div>
  );
}