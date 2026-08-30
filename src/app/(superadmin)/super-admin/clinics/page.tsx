
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Building2,
  CheckCircle2,
  XCircle,
  Ban,
  X,
  Loader2,
} from "lucide-react";

import {
  superAdminApi,
  type Clinic,
} from "@/lib/api/super-admin";

import { queryKeys } from "@/lib/query/keys";

const STATUS_LABELS: Record<
  Clinic["status"],
  {
    label: string;
    tone: string;
    dot: string;
    badge: string;
  }
> = {
  active: {
    label: "فعال",
    tone: "text-primary-dark dark:text-primary-light",
    dot: "bg-primary-dark dark:bg-primary-light",
    badge:
      "bg-primary-light/20 text-primary-dark dark:bg-primary/10 dark:text-primary-light",
  },

  inactive: {
    label: "غیرفعال",
    tone: "text-gray-500 dark:text-gray-400",
    dot: "bg-gray-400 dark:bg-gray-500",
    badge:
      "bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-gray-400",
  },

  suspended: {
    label: "معلق",
    tone: "text-danger",
    dot: "bg-danger",
    badge: "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-400",
  },
};

const STATUS_FILTERS: {
  value: Clinic["status"] | "all";
  label: string;
}[] = [
  { value: "all", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
  { value: "suspended", label: "معلق" },
];

export default function ClinicsListPage() {
  const [statusFilter, setStatusFilter] =
    useState<Clinic["status"] | "all">("all");

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: clinics = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.superAdmin.clinics.list(),
    queryFn: superAdminApi.getClinics,
  });

  /*
   * تغییر وضعیت کلینیک
   */
  const statusMutation = useMutation({
    mutationFn: ({
      clinicId,
      status,
    }: {
      clinicId: string;
      status: Clinic["status"];
    }) => superAdminApi.updateClinicStatus(clinicId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.clinics.list(),
      });
    },
  });

  /*
   * ایجاد کلینیک
   */
  const createMutation = useMutation({
    mutationFn: superAdminApi.createClinic,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.clinics.list(),
      });

      setShowCreateModal(false);
    },
  });

  /*
   * فیلتر کلینیک‌ها
   */
  const filteredClinics = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return clinics.filter((clinic) => {
      const matchSearch =
        !normalizedSearch ||
        clinic.name.toLowerCase().includes(normalizedSearch) ||
        (clinic.phone ?? "").toLowerCase().includes(normalizedSearch);

      const matchStatus =
        statusFilter === "all" || clinic.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [clinics, search, statusFilter]);

  /*
   * آمار
   */
  const stats = useMemo(
    () => ({
      total: clinics.length,

      active: clinics.filter((clinic) => clinic.status === "active").length,

      inactive: clinics.filter(
        (clinic) => clinic.status !== "active"
      ).length,
    }),
    [clinics]
  );

  /*
   * خطای Mutation
   */
  const createError =
    createMutation.error instanceof Error
      ? createMutation.error.message
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
            کلینیک‌ها
          </h1>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            مدیریت تمام کلینیک‌های ثبت‌شده در سامانه
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="
            flex items-center justify-center gap-2
            rounded-xl
            bg-primary
            px-5 py-2.5
            text-sm font-medium text-white
            shadow-sm
            transition
            hover:bg-primary-dark
            dark:bg-primary
            dark:hover:bg-primary-light
          "
        >
          <Plus className="h-4 w-4" />
          افزودن کلینیک جدید
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          tone="
            text-primary-dark bg-primary-light/20
            dark:bg-primary/10 dark:text-primary-light
          "
          label="کل کلینیک‌ها"
          value={stats.total}
        />

        <StatCard
          icon={CheckCircle2}
          tone="
            text-primary-dark bg-primary-light/20
            dark:bg-primary/10 dark:text-primary-light
          "
          label="کلینیک‌های فعال"
          value={stats.active}
        />

        <StatCard
          icon={XCircle}
          tone="
            text-danger bg-red-50
            dark:bg-red-500/10 dark:text-red-400
          "
          label="غیرفعال / معلق"
          value={stats.inactive}
        />
      </div>

      {/* Main table card */}
      <div
        className="
          rounded-2xl
          border border-gray-100
          bg-white
          p-5
          shadow-sm
          dark:border-white/[0.08]
          dark:bg-white/[0.025]
          dark:shadow-none
        "
      >
        {/* Toolbar */}
        <div
          className="
            mb-5
            flex flex-col gap-3
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Search */}
          <div
            className="
              flex items-center gap-2
              rounded-xl
              border border-gray-200
              bg-transparent
              px-3 py-2.5
              transition
              focus-within:border-primary
              dark:border-white/[0.1]
              dark:focus-within:border-primary-light/50
              lg:w-80
            "
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجوی نام یا تلفن کلینیک..."
              className="
                w-full
                bg-transparent
                text-right
                text-xs
                text-gray-700
                outline-none
                placeholder:text-gray-300
                dark:text-gray-200
                dark:placeholder:text-gray-600
              "
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((filter) => {
              const isSelected = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`
                    rounded-xl
                    border
                    px-3 py-2
                    text-xs
                    transition
                    ${
                      isSelected
                        ? `
                          border-primary
                          bg-primary-light/10
                          text-primary-dark
                          dark:border-primary-light/40
                          dark:bg-primary/10
                          dark:text-primary-light
                        `
                        : `
                          border-gray-200
                          text-gray-600
                          hover:bg-gray-50
                          dark:border-white/[0.1]
                          dark:text-gray-400
                          dark:hover:bg-white/[0.05]
                        `
                    }
                  `}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-14">
            <Loader2 className="mb-3 h-5 w-5 animate-spin text-primary" />

            <span className="text-sm text-gray-400 dark:text-gray-500">
              در حال بارگذاری کلینیک‌ها...
            </span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-center text-sm text-danger dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400">
            خطا در دریافت لیست کلینیک‌ها
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[720px]
                text-right
                text-xs
              "
            >
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.07]">
                  <th className="py-3 font-medium text-gray-400 dark:text-gray-500">
                    نام کلینیک
                  </th>

                  <th className="py-3 font-medium text-gray-400 dark:text-gray-500">
                    تلفن
                  </th>

                  <th className="py-3 font-medium text-gray-400 dark:text-gray-500">
                    وضعیت
                  </th>

                  <th className="py-3 font-medium text-gray-400 dark:text-gray-500">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredClinics.map((clinic) => {
                  const status = STATUS_LABELS[clinic.status];

                  const isUpdating =
                    statusMutation.isPending &&
                    statusMutation.variables?.clinicId === clinic.id;

                  return (
                    <tr
                      key={clinic.id}
                      className="
                        border-b border-gray-50
                        transition
                        hover:bg-gray-50/70
                        dark:border-white/[0.05]
                        dark:hover:bg-white/[0.025]
                      "
                    >
                      {/* Clinic name */}
                      <td className="py-3.5">
                        <Link
                          href={`/super-admin/clinics/${clinic.id}`}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            font-medium
                            text-gray-800
                            transition
                            hover:text-primary-dark
                            dark:text-gray-200
                            dark:hover:text-primary-light
                          "
                        >
                          <span
                            className="
                              flex h-8 w-8
                              items-center justify-center
                              rounded-lg
                              bg-primary-light/20
                              text-primary-dark
                              dark:bg-primary/10
                              dark:text-primary-light
                            "
                          >
                            <Building2 className="h-4 w-4" />
                          </span>

                          <span>{clinic.name}</span>
                        </Link>
                      </td>

                      {/* Phone */}
                      <td
                        className="py-3.5 text-gray-500 dark:text-gray-400"
                        dir="ltr"
                      >
                        {clinic.phone ?? "-"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-2.5 py-1
                            text-[11px]
                            ${status.badge}
                          `}
                        >
                          <span
                            className={`
                              h-1.5 w-1.5
                              rounded-full
                              ${status.dot}
                            `}
                          />

                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            statusMutation.mutate({
                              clinicId: clinic.id,

                              status:
                                clinic.status === "active"
                                  ? "suspended"
                                  : "active",
                            })
                          }
                          disabled={statusMutation.isPending}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border border-gray-200
                            px-2.5 py-1.5
                            text-[11px]
                            text-gray-500
                            transition
                            hover:border-gray-300
                            hover:bg-gray-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:border-white/[0.1]
                            dark:text-gray-400
                            dark:hover:border-white/[0.16]
                            dark:hover:bg-white/[0.05]
                          "
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Ban className="h-3 w-3" />
                          )}

                          {clinic.status === "active"
                            ? "تعلیق"
                            : "فعال‌سازی"}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty */}
                {filteredClinics.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-14 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="
                            mb-3
                            flex h-12 w-12
                            items-center justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-400
                            dark:bg-white/[0.06]
                            dark:text-gray-500
                          "
                        >
                          <Building2 className="h-5 w-5" />
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          هیچ کلینیکی پیدا نشد.
                        </p>

                        {(search || statusFilter !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setStatusFilter("all");
                            }}
                            className="
                              mt-2
                              text-xs
                              text-primary-dark
                              hover:underline
                              dark:text-primary-light
                            "
                          >
                            حذف فیلترها
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!isLoading && !error && (
          <div
            className="
              mt-4
              flex
              flex-col
              gap-2
              text-xs
              text-gray-400
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span>
              نمایش{" "}
              <strong className="font-medium text-gray-600 dark:text-gray-300">
                {filteredClinics.length.toLocaleString("fa-IR")}
              </strong>{" "}
              از{" "}
              <strong className="font-medium text-gray-600 dark:text-gray-300">
                {clinics.length.toLocaleString("fa-IR")}
              </strong>{" "}
              کلینیک
            </span>

            <Link
              href="/super-admin/dashboard"
              className="
                text-primary-dark
                transition
                hover:underline
                dark:text-primary-light
              "
            >
              بازگشت به داشبورد
            </Link>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateClinicModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={createError}
        />
      )}
    </div>
  );
}

/* =========================================================
   Stat Card
========================================================= */

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
    <div
      className="
        flex items-center gap-3
        rounded-2xl
        border border-gray-100
        bg-white
        p-4
        shadow-sm
        dark:border-white/[0.08]
        dark:bg-white/[0.025]
        dark:shadow-none
      "
    >
      <div
        className={`
          flex h-11 w-11
          shrink-0
          items-center justify-center
          rounded-full
          ${tone}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {value.toLocaleString("fa-IR")}
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500">
          {label}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Create Clinic Modal
========================================================= */

function CreateClinicModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;

  onSubmit: (payload: {
    name: string;
    slug: string;
    phone?: string;
    address?: string;
  }) => void;

  isSubmitting: boolean;

  error: string | null;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  /*
   * قفل اسکرول صفحه هنگام باز بودن Modal
   */
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  /*
   * بستن Modal با Escape
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const isValid =
    name.trim().length > 0 &&
    slug.trim().length > 0 &&
    !isSubmitting;

  return (
    <div
      className="
        fixed inset-0
        z-[100]
        flex items-center justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-clinic-title"
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border border-gray-100
          bg-white
          shadow-2xl
          dark:border-white/[0.1]
          dark:bg-[#15191d]
        "
      >
        {/* Modal Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-gray-100
            px-5 py-4
            dark:border-white/[0.07]
          "
        >
          <div>
            <h2
              id="create-clinic-title"
              className="text-base font-bold text-gray-900 dark:text-white"
            >
              افزودن کلینیک جدید
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              اطلاعات کلینیک را وارد کنید.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="بستن"
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-600
              disabled:opacity-50
              dark:hover:bg-white/[0.06]
              dark:hover:text-gray-200
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {error && (
            <div
              className="
                mb-4
                rounded-xl
                border border-red-100
                bg-red-50
                px-3 py-2.5
                text-xs
                leading-relaxed
                text-red-600
                dark:border-red-500/10
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="clinic-name"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-300
                "
              >
                نام کلینیک
              </label>

              <input
                id="clinic-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                autoFocus
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-transparent
                  px-3 py-2.5
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-300
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/[0.1]
                  dark:text-gray-100
                  dark:placeholder:text-gray-600
                  dark:focus:border-primary-light/50
                "
                placeholder="کلینیک پوست و مو نگین"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="clinic-slug"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-300
                "
              >
                شناسه یکتا (slug)
              </label>

              <input
                id="clinic-slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                disabled={isSubmitting}
                dir="ltr"
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-transparent
                  px-3 py-2.5
                  text-left
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-300
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/[0.1]
                  dark:text-gray-100
                  dark:placeholder:text-gray-600
                  dark:focus:border-primary-light/50
                "
                placeholder="negin-clinic"
              />

              <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-600">
                فقط برای شناسایی یکتای کلینیک استفاده می‌شود.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="clinic-phone"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-300
                "
              >
                تلفن
                <span className="mr-1 text-gray-400">(اختیاری)</span>
              </label>

              <input
                id="clinic-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={isSubmitting}
                dir="ltr"
                inputMode="tel"
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-transparent
                  px-3 py-2.5
                  text-left
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-300
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/[0.1]
                  dark:text-gray-100
                  dark:placeholder:text-gray-600
                  dark:focus:border-primary-light/50
                "
                placeholder="02112345678"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="clinic-address"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-300
                "
              >
                آدرس
                <span className="mr-1 text-gray-400">(اختیاری)</span>
              </label>

              <textarea
                id="clinic-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                disabled={isSubmitting}
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-gray-200
                  bg-transparent
                  px-3 py-2.5
                  text-right
                  text-sm
                  leading-relaxed
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-300
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/[0.1]
                  dark:text-gray-100
                  dark:placeholder:text-gray-600
                  dark:focus:border-primary-light/50
                "
                placeholder="آدرس کلینیک..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                flex-1
                rounded-xl
                border border-gray-200
                bg-transparent
                py-2.5
                text-sm
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:opacity-50
                dark:border-white/[0.1]
                dark:text-gray-300
                dark:hover:bg-white/[0.05]
              "
            >
              انصراف
            </button>

            <button
              type="button"
              disabled={!isValid}
              onClick={() =>
                onSubmit({
                  name: name.trim(),
                  slug: slug.trim(),
                  phone: phone.trim() || undefined,
                  address: address.trim() || undefined,
                })
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-primary-dark
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-primary
                dark:hover:bg-primary-light
              "
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isSubmitting
                ? "در حال ثبت..."
                : "ثبت کلینیک"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

