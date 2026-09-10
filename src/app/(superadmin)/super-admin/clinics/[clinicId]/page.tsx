"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Pencil,
  Ban,
  Phone,
  MapPin,
  Info,
  X,
} from "lucide-react";

import { superAdminApi, type Clinic } from "@/lib/api/super-admin";
import { queryKeys } from "@/lib/query/keys";

const STATUS_LABELS: Record<
  Clinic["status"],
  { label: string; tone: string }
> = {
  active: {
    label: "فعال",
    tone: "bg-primary-light/20 text-primary-dark dark:bg-primary/10 dark:text-primary",
  },
  inactive: {
    label: "غیرفعال",
    tone: "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400",
  },
  suspended: {
    label: "معلق",
    tone: "bg-red-50 text-danger dark:bg-red-500/10 dark:text-red-400",
  },
};

export default function ClinicDetailPage({
  params,
}: {
  params: Promise<{ clinicId: string }>;
}) {
  const { clinicId } = use(params);
  const queryClient = useQueryClient();

  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: clinic,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.superAdmin.clinics.detail(clinicId),
    queryFn: () => superAdminApi.getClinic(clinicId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: Clinic["status"]) =>
      superAdminApi.updateClinicStatus(clinicId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.clinics.detail(clinicId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.clinics.list(),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (
      payload: Parameters<typeof superAdminApi.updateClinic>[1]
    ) => superAdminApi.updateClinic(clinicId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.superAdmin.clinics.detail(clinicId),
      });

      setShowEditModal(false);
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">
        در حال بارگذاری...
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="py-20 text-center text-sm text-danger dark:text-red-400">
        کلینیک یافت نشد.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* بازگشت */}
      <Link
        href="/super-admin/clinics"
        className="
          flex w-fit items-center gap-1.5
          text-sm text-gray-500
          transition-colors
          hover:text-primary
          dark:text-gray-400
          dark:hover:text-primary
        "
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست کلینیک‌ها
      </Link>

      {/* هدر کلینیک */}
      <div
        className="
          flex flex-col gap-4
          rounded-2xl
          border border-gray-100
          bg-white
          p-5
          transition-colors
          dark:border-white/10
          dark:bg-white/[0.06]
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="
              flex h-14 w-14 shrink-0 items-center justify-center
              rounded-full
              bg-gray-100
              text-gray-400
              dark:bg-white/10
              dark:text-gray-500
            "
          >
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {clinic.name}
              </h1>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_LABELS[clinic.status].tone}`}
              >
                {STATUS_LABELS[clinic.status].label}
              </span>
            </div>

            <div
              className="
                mt-1 flex items-center gap-1.5
                text-xs text-gray-400
                dark:text-gray-500
              "
              dir="ltr"
            >
              <span dir="rtl">شناسه:</span>
              {clinic.slug}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="
              flex items-center gap-1.5
              rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2
              text-xs text-gray-600
              transition-all
              hover:bg-gray-50
              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-gray-300
              dark:hover:bg-white/10
            "
          >
            <Pencil className="h-3.5 w-3.5" />
            ویرایش اطلاعات
          </button>

          <button
            type="button"
            onClick={() =>
              statusMutation.mutate(
                clinic.status === "suspended" ? "active" : "suspended"
              )
            }
            disabled={statusMutation.isPending}
            className={`
              flex items-center gap-1.5
              rounded-xl
              px-4 py-2
              text-xs font-medium
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                clinic.status === "suspended"
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-red-50 text-danger hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              }
            `}
          >
            <Ban className="h-3.5 w-3.5" />

            {clinic.status === "suspended"
              ? "فعال‌سازی مجدد"
              : "تعلیق کلینیک"}
          </button>
        </div>
      </div>

      {/* اطلاعات کلی */}
      <div
        className="
          rounded-2xl
          border border-gray-100
          bg-white
          p-5
          transition-colors
          dark:border-white/10
          dark:bg-white/[0.06]
        "
      >
        <h2 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
          اطلاعات کلی
        </h2>

        <div className="space-y-3 text-xs">
          <InfoRow
            icon={Phone}
            label="تلفن"
            value={clinic.phone ?? "ثبت نشده"}
            dir="ltr"
          />

          <InfoRow
            icon={MapPin}
            label="آدرس"
            value={clinic.address ?? "ثبت نشده"}
          />

          <InfoRow
            icon={Info}
            label="تخصص"
            value={clinic.specialty ?? "ثبت نشده"}
          />

          <InfoRow
            icon={Info}
            label="شعار"
            value={clinic.slogan ?? "ثبت نشده"}
          />

          {/* Brand Color */}
          <div className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <Info className="h-3.5 w-3.5" />
              رنگ برند
            </span>

            {clinic.brand_color ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="
                    h-4 w-4 rounded-full
                    border border-gray-200
                    dark:border-white/20
                  "
                  style={{
                    backgroundColor: clinic.brand_color,
                  }}
                />

                <span
                  className="text-gray-700 dark:text-gray-300"
                  dir="ltr"
                >
                  {clinic.brand_color}
                </span>
              </span>
            ) : (
              <span className="text-gray-700 dark:text-gray-300">
                ثبت نشده
              </span>
            )}
          </div>

          {/* Coordinates */}
          <InfoRow
            icon={MapPin}
            label="مختصات (Lat, Lng)"
            value={
              clinic.latitude && clinic.longitude
                ? `${clinic.latitude}, ${clinic.longitude}`
                : "ثبت نشده"
            }
            dir="ltr"
          />

          {/* Logo */}
          {clinic.logo_url && (
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                <Info className="h-3.5 w-3.5" />
                لوگو
              </span>

              <a
                href={clinic.logo_url}
                target="_blank"
                rel="noreferrer"
                className="
                  max-w-[200px]
                  truncate
                  text-primary
                  hover:underline
                "
                dir="ltr"
              >
                {clinic.logo_url}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditClinicModal
          clinic={clinic}
          onClose={() => setShowEditModal(false)}
          onSubmit={(payload) => updateMutation.mutate(payload)}
          isSubmitting={updateMutation.isPending}
          error={
            updateMutation.error instanceof Error
              ? updateMutation.error.message
              : null
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Row                                                                    */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>

      <span
        className="max-w-[65%] text-left text-gray-700 dark:text-gray-300"
        dir={dir}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edit Clinic Modal                                                           */
/* -------------------------------------------------------------------------- */

function EditClinicModal({
  clinic,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  clinic: Clinic;

  onClose: () => void;

  onSubmit: (payload: {
    name: string;
    phone?: string;
    address?: string;
    slogan?: string;
    specialty?: string;
    logo_url?: string;
    brand_color?: string;
    latitude?: string;
    longitude?: string;
  }) => void;

  isSubmitting: boolean;
  error: string | null;
}) {
  const [name, setName] = useState(clinic.name);
  const [phone, setPhone] = useState(clinic.phone ?? "");
  const [address, setAddress] = useState(clinic.address ?? "");
  const [slogan, setSlogan] = useState(clinic.slogan ?? "");
  const [specialty, setSpecialty] = useState(clinic.specialty ?? "");
  const [logoUrl, setLogoUrl] = useState(clinic.logo_url ?? "");
  const [brandColor, setBrandColor] = useState(
    clinic.brand_color ?? "#0EA5A4"
  );
  const [latitude, setLatitude] = useState(clinic.latitude ?? "");
  const [longitude, setLongitude] = useState(clinic.longitude ?? "");

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full max-w-lg
          overflow-y-auto
          rounded-2xl
          border border-gray-100
          bg-white
          p-6
          shadow-2xl
          dark:border-white/10
          dark:bg-[#11161d]
        "
      >
        {/* Modal Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            ویرایش اطلاعات کلینیک
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-1.5
              text-gray-400
              transition-colors
              hover:bg-gray-100
              hover:text-gray-600
              dark:hover:bg-white/10
              dark:hover:text-gray-200
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            className="
              mb-3
              rounded-lg
              border border-red-100
              bg-red-50
              px-3 py-2
              text-xs text-red-500
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            {error}
          </p>
        )}

        <div className="space-y-3">
          {/* Name */}
          <FormField label="نام کلینیک">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>

          {/* Slogan */}
          <FormField label="شعار کلینیک">
            <input
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>

          {/* Specialty */}
          <FormField label="تخصص">
            <input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>

          {/* Phone */}
          <FormField label="تلفن">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
              className={INPUT_CLASS}
            />
          </FormField>

          {/* Address */}
          <FormField label="آدرس">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className={`${INPUT_CLASS} resize-none`}
            />
          </FormField>

          {/* Logo URL */}
          <FormField label="آدرس لوگو (URL)">
            <input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              dir="ltr"
              className={INPUT_CLASS}
            />
          </FormField>

          {/* Brand Color */}
          <FormField label="رنگ برند">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="
                  h-10 w-12
                  cursor-pointer
                  rounded-lg
                  border border-gray-200
                  bg-transparent
                  p-1
                  dark:border-white/10
                "
              />

              <input
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                dir="ltr"
                className={`flex-1 ${INPUT_CLASS}`}
              />
            </div>
          </FormField>

          {/* Coordinates */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="عرض جغرافیایی (Lat)">
              <input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                dir="ltr"
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="طول جغرافیایی (Lng)">
              <input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                dir="ltr"
                className={INPUT_CLASS}
              />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border border-gray-200
              bg-white
              py-2.5
              text-sm text-gray-600
              transition-colors
              hover:bg-gray-50
              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-gray-300
              dark:hover:bg-white/10
            "
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={!name.trim() || isSubmitting}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                phone: phone || undefined,
                address: address || undefined,
                slogan: slogan || undefined,
                specialty: specialty || undefined,
                logo_url: logoUrl || undefined,
                brand_color: brandColor || undefined,
                latitude: latitude || undefined,
                longitude: longitude || undefined,
              })
            }
            className="
              flex-1
              rounded-xl
              bg-primary
              py-2.5
              text-sm font-medium
              text-white
              transition-all
              hover:bg-primary-dark
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form Helpers                                                                */
/* -------------------------------------------------------------------------- */

const INPUT_CLASS = `
  w-full
  rounded-xl
  border border-gray-200
  bg-white
  px-3 py-2
  text-sm
  text-gray-800
  outline-none
  transition-colors
  placeholder:text-gray-400
  focus:border-primary
  focus:ring-2
  focus:ring-primary/10
  dark:border-white/10
  dark:bg-white/[0.04]
  dark:text-gray-100
  dark:placeholder:text-gray-500
`;

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
        {label}
      </label>

      {children}
    </div>
  );
}