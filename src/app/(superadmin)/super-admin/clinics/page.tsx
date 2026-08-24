"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Building2, CheckCircle2, XCircle, Ban, X } from "lucide-react";

import { superAdminApi, type Clinic } from "@/lib/api/super-admin";
import { queryKeys } from "@/lib/query/keys";

const STATUS_LABELS: Record<Clinic["status"], { label: string; tone: string }> = {
  active: { label: "فعال", tone: "text-primary-dark" },
  inactive: { label: "غیرفعال", tone: "text-gray-400" },
  suspended: { label: "معلق", tone: "text-danger" },
};

const STATUS_FILTERS: { value: Clinic["status"] | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
  { value: "suspended", label: "معلق" },
];

export default function ClinicsListPage() {
  const [statusFilter, setStatusFilter] = useState<Clinic["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: clinics = [], isLoading, error } = useQuery({
    queryKey: queryKeys.superAdmin.clinics.list(),
    queryFn: superAdminApi.getClinics,
  });

  const statusMutation = useMutation({
    mutationFn: ({ clinicId, status }: { clinicId: string; status: Clinic["status"] }) =>
      superAdminApi.updateClinicStatus(clinicId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.clinics.list() });
    },
  });

  const createMutation = useMutation({
    mutationFn: superAdminApi.createClinic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.clinics.list() });
      setShowCreateModal(false);
    },
  });

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const matchSearch = clinic.name.includes(search) || (clinic.phone ?? "").includes(search);
      const matchStatus = statusFilter === "all" || clinic.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [clinics, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: clinics.length,
      active: clinics.filter((c) => c.status === "active").length,
      inactive: clinics.filter((c) => c.status !== "active").length,
    }),
    [clinics]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">کلینیک‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت تمام کلینیک‌های ثبت‌شده در سامانه</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> افزودن کلینیک جدید
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Building2} tone="text-primary-dark bg-primary-light/20" label="کل کلینیک‌ها" value={stats.total} />
        <StatCard icon={CheckCircle2} tone="text-primary-dark bg-primary-light/20" label="کلینیک‌های فعال" value={stats.active} />
        <StatCard icon={XCircle} tone="text-danger bg-red-50" label="غیرفعال / معلق" value={stats.inactive} />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 lg:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام یا تلفن کلینیک..."
              className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
            />
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  statusFilter === f.value
                    ? "border-primary bg-primary-light/10 text-primary-dark"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="py-10 text-center text-sm text-gray-400">در حال بارگذاری...</div>}
        {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت لیست کلینیک‌ها</div>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-right text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="py-2 font-medium">نام کلینیک</th>
                  <th className="py-2 font-medium">تلفن</th>
                  <th className="py-2 font-medium">وضعیت</th>
                  <th className="py-2 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredClinics.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="py-3">
                      <Link href={`/super-admin/clinics/${c.id}`} className="font-medium text-gray-800 hover:text-primary-dark">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-500" dir="ltr">
                      {c.phone ?? "-"}
                    </td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 ${STATUS_LABELS[c.status].tone}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {STATUS_LABELS[c.status].label}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            clinicId: c.id,
                            status: c.status === "active" ? "suspended" : "active",
                          })
                        }
                        disabled={statusMutation.isPending}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Ban className="h-3 w-3" />
                        {c.status === "active" ? "تعلیق" : "فعال‌سازی"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClinics.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                      هیچ کلینیکی پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateClinicModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={createMutation.error instanceof Error ? createMutation.error.message : null}
        />
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Building2;
  tone: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900">{value.toLocaleString("fa-IR")}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

function CreateClinicModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: { name: string; slug: string; phone?: string; address?: string }) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">افزودن کلینیک جدید</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-600">نام کلینیک</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="کلینیک پوست و مو نگین"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">شناسه یکتا (slug)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="negin-clinic"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">تلفن (اختیاری)</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">آدرس (اختیاری)</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              rows={2}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            انصراف
          </button>
          <button
            disabled={!name || !slug || isSubmitting}
            onClick={() => onSubmit({ name, slug, phone: phone || undefined, address: address || undefined })}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت کلینیک"}
          </button>
        </div>
      </div>
    </div>
  );
}