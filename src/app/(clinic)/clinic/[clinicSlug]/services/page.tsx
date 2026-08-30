"use client";

import { use, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Ban,
  Sparkles,
  Syringe,
  Scissors,
  Droplet,
  X,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getServices,
  createService,
  updateService,
  updateServiceStatus,
  type ClinicService,
} from "@/lib/api/services";

import { queryKeys } from "@/lib/query/keys";
import { LoadingLogo } from "@/components/LoadingLogo";

const ICONS = [Sparkles, Syringe, Scissors, Droplet];

const TONES = [
  "from-primary-light/60 to-primary-light/20",
  "from-pink-200 dark:from-pink-900/50 dark:to-pink-950/30 to-pink-100",
  "from-secondary-purple/60 dark:from-purple-900/50 dark:to-purple-950/30 to-secondary-purple/20",
  "from-secondary-blue/60 dark:from-blue-900/50 dark:to-blue-950/30 to-secondary-blue/20",
];

export default function ServicesManagementPage({
  params,
}: {
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = use(params);

  const [category, setCategory] = useState("همه");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] =
    useState<ClinicService | null>(null);

  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.services.list(clinicSlug),
    queryFn: () => getServices(clinicSlug),
    enabled: !!clinicSlug,
  });

  const createMutation = useMutation({
    mutationFn: (
      payload: Parameters<typeof createService>[1]
    ) => createService(clinicSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.list(clinicSlug),
      });

      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateService>[2];
    }) => updateService(clinicSlug, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.list(clinicSlug),
      });

      setEditingService(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => updateServiceStatus(clinicSlug, id, isActive),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.list(clinicSlug),
      }),
  });

  // ساخت دسته‌بندی‌ها از داده‌های موجود
  const categories = useMemo(() => {
    const names = new Set<string>();

    services.forEach((service) => {
      if (service.categoryName) {
        names.add(service.categoryName);
      }
    });

    return ["همه", ...Array.from(names)];
  }, [services]);

  const filtered = services.filter((service) => {
    const matchCategory =
      category === "همه" || service.categoryName === category;

    const keyword = search.trim();

    const matchSearch =
      !keyword ||
      service.name.includes(keyword) ||
      (service.categoryName ?? "").includes(keyword);

    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            خدمات
          </h1>

          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            مدیریت خدمات، قیمت‌ها و مدت‌زمان هر خدمت
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="
            flex items-center justify-center gap-2
            rounded-xl
            bg-primary
            px-5 py-2.5
            text-sm font-medium text-white
            transition
            hover:bg-primary-dark
            active:scale-[0.98]
          "
        >
          <Plus className="h-4 w-4" />
          افزودن خدمت جدید
        </button>
      </div>

      {/* Search + Categories */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div
          className="
            flex items-center gap-2
            rounded-xl
            border border-gray-200
            bg-white
            px-3 py-2.5
            transition
            focus-within:border-primary
            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی خدمت..."
            className="
              w-full
              bg-transparent
              text-sm
              text-gray-700
              outline-none
              placeholder:text-gray-300
              dark:text-gray-200
              dark:placeholder:text-gray-600
            "
          />

          <Search className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`
                rounded-full
                px-4 py-1.5
                text-xs
                transition
                ${
                  category === c
                    ? "bg-primary text-white shadow-sm"
                    : `
                      border border-gray-200
                      bg-white
                      text-gray-500
                      hover:bg-gray-50
                      dark:border-gray-700
                      dark:bg-gray-900
                      dark:text-gray-400
                      dark:hover:bg-gray-800
                    `
                }
              `}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingLogo />}

      {/* Error */}
      {error && (
        <div
          className="
            rounded-2xl
            border border-red-100
            bg-red-50
            py-10
            text-center
            text-sm text-danger
            dark:border-red-900/40
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          خطا در دریافت خدمات
        </div>
      )}

      {/* Services */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, index) => {
            const Icon = ICONS[index % ICONS.length];
            const tone = TONES[index % TONES.length];

            return (
              <div
                key={service.id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border border-gray-100
                  bg-white
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                  dark:border-gray-800
                  dark:bg-gray-900
                  dark:shadow-black/20
                "
              >
                {/* Service visual */}
                <div
                  className={`
                    flex h-24
                    items-center justify-center
                    bg-gradient-to-br
                    ${tone}
                  `}
                >
                  <Icon className="h-7 w-7 text-white/90 drop-shadow-sm" />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Name + status */}
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-800
                        dark:text-gray-100
                      "
                    >
                      {service.name}
                    </span>

                    <span
                      className={`
                        h-2 w-2
                        shrink-0
                        rounded-full
                        ${
                          service.isActive
                            ? "bg-primary shadow-[0_0_0_3px_rgba(14,165,164,0.12)]"
                            : "bg-gray-300 dark:bg-gray-600"
                        }
                      `}
                    />
                  </div>

                  {/* Category + duration */}
                  <div
                    className="
                      mb-3
                      flex items-center gap-2
                      text-[11px]
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    <span>
                      {service.categoryName ?? "بدون دسته"}
                    </span>

                    <span>·</span>

                    <span>
                      {service.defaultDurationMinutes.toLocaleString(
                        "fa-IR"
                      )}{" "}
                      دقیقه
                    </span>
                  </div>

                  {/* Price + actions */}
                  <div className="flex items-center justify-between">
                    <span
                      className="
                        text-xs
                        font-bold
                        text-gray-800
                        dark:text-gray-100
                      "
                    >
                      {service.basePrice != null
                        ? `${service.basePrice.toLocaleString(
                            "fa-IR"
                          )} تومان`
                        : "—"}
                    </span>

                    <div className="flex gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => setEditingService(service)}
                        className="
                          rounded-lg
                          border border-gray-200
                          bg-white
                          p-1.5
                          text-gray-400
                          transition
                          hover:border-primary/30
                          hover:bg-primary/5
                          hover:text-primary-dark
                          dark:border-gray-700
                          dark:bg-gray-800
                          dark:text-gray-500
                          dark:hover:bg-primary/10
                          dark:hover:text-primary
                        "
                        title="ویرایش خدمت"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Activate / Deactivate */}
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            id: service.id,
                            isActive: !service.isActive,
                          })
                        }
                        disabled={statusMutation.isPending}
                        title={
                          service.isActive
                            ? "غیرفعال کردن"
                            : "فعال کردن"
                        }
                        className="
                          rounded-lg
                          border border-gray-200
                          bg-white
                          p-1.5
                          text-gray-400
                          transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-danger
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          dark:border-gray-700
                          dark:bg-gray-800
                          dark:text-gray-500
                          dark:hover:border-red-900/50
                          dark:hover:bg-red-950/30
                          dark:hover:text-red-400
                        "
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty */}
          {filtered.length === 0 && (
            <div
              className="
                col-span-full
                rounded-2xl
                border border-dashed border-gray-200
                bg-white
                py-10
                text-center
                text-sm text-gray-400
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-500
              "
            >
              خدمتی یافت نشد.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <ServiceFormModal
          title="افزودن خدمت جدید"
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={
            createMutation.error instanceof Error
              ? createMutation.error.message
              : null
          }
        />
      )}

      {/* Edit Modal */}
      {editingService && (
        <ServiceFormModal
          title="ویرایش خدمت"
          initial={editingService}
          onClose={() => setEditingService(null)}
          onSubmit={(payload) =>
            updateMutation.mutate({
              id: editingService.id,
              payload,
            })
          }
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

/* =========================================================
   Service Form Modal
========================================================= */

function ServiceFormModal({
  title,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  title: string;
  initial?: ClinicService;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description?: string;
    default_duration_minutes: number;
    base_price?: number;
    requires_consent?: boolean;
    requires_before_after_images?: boolean;
    requires_followup?: boolean;
  }) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");

  const [description, setDescription] = useState(
    initial?.description ?? ""
  );

  const [duration, setDuration] = useState(
    String(initial?.defaultDurationMinutes ?? 30)
  );

  const [price, setPrice] = useState(
    initial?.basePrice?.toString() ?? ""
  );

  const [requiresConsent, setRequiresConsent] = useState(
    initial?.requiresConsent ?? false
  );

  const [requiresImages, setRequiresImages] = useState(
    initial?.requiresBeforeAfterImages ?? false
  );

  const [requiresFollowup, setRequiresFollowup] = useState(
    initial?.requiresFollowup ?? false
  );

  const handleSubmit = () => {
    if (!name.trim() || !duration) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      default_duration_minutes: Number(duration),
      base_price: price ? Number(price) : undefined,
      requires_consent: requiresConsent,
      requires_before_after_images: requiresImages,
      requires_followup: requiresFollowup,
    });
  };

  return (
    <div
      className="
        fixed inset-0
        z-50
        flex items-center justify-center
        bg-black/40
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-md
          overflow-y-auto
          rounded-2xl
          border border-gray-100
          bg-white
          p-6
          shadow-2xl
          dark:border-gray-800
          dark:bg-gray-900
          dark:shadow-black/50
        "
      >
        {/* Modal Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="
              text-base
              font-bold
              text-gray-900
              dark:text-gray-100
            "
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-1.5
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-600
              dark:text-gray-500
              dark:hover:bg-gray-800
              dark:hover:text-gray-300
            "
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            className="
              mb-4
              rounded-xl
              border border-red-100
              bg-red-50
              px-3 py-2.5
              text-xs
              text-red-500
              dark:border-red-900/40
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {error}
          </p>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-xs
                font-medium
                text-gray-600
                dark:text-gray-400
              "
            >
              نام خدمت
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً بوتاکس"
              className="
                w-full
                rounded-xl
                border border-gray-200
                bg-white
                px-3 py-2.5
                text-sm
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-300
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-100
                dark:placeholder:text-gray-600
                dark:focus:border-primary
              "
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="
                mb-1.5
                block
                text-xs
                font-medium
                text-gray-600
                dark:text-gray-400
              "
            >
              توضیحات (اختیاری)
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="توضیحات مربوط به خدمت..."
              className="
                w-full
                resize-none
                rounded-xl
                border border-gray-200
                bg-white
                px-3 py-2.5
                text-sm
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-300
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-100
                dark:placeholder:text-gray-600
                dark:focus:border-primary
              "
            />
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-400
                "
              >
                مدت‌زمان (دقیقه)
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-3 py-2.5
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-100
                  dark:focus:border-primary
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-400
                "
              >
                قیمت پایه (تومان)
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="اختیاری"
                className="
                  w-full
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-3 py-2.5
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-300
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-100
                  dark:placeholder:text-gray-600
                  dark:focus:border-primary
                "
              />
            </div>
          </div>

          {/* Options */}
          <div
            className="
              space-y-2.5
              rounded-xl
              border border-gray-100
              bg-gray-50/70
              p-3
              dark:border-gray-800
              dark:bg-gray-800/50
            "
          >
            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2.5
                text-xs
                text-gray-600
                dark:text-gray-400
              "
            >
              <input
                type="checkbox"
                checked={requiresConsent}
                onChange={(e) =>
                  setRequiresConsent(e.target.checked)
                }
                className="
                  h-4 w-4
                  rounded
                  border-gray-300
                  accent-primary
                  dark:border-gray-600
                "
              />

              <span>نیازمند رضایت‌نامه</span>
            </label>

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2.5
                text-xs
                text-gray-600
                dark:text-gray-400
              "
            >
              <input
                type="checkbox"
                checked={requiresImages}
                onChange={(e) =>
                  setRequiresImages(e.target.checked)
                }
                className="
                  h-4 w-4
                  rounded
                  border-gray-300
                  accent-primary
                  dark:border-gray-600
                "
              />

              <span>نیازمند تصاویر قبل/بعد</span>
            </label>

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2.5
                text-xs
                text-gray-600
                dark:text-gray-400
              "
            >
              <input
                type="checkbox"
                checked={requiresFollowup}
                onChange={(e) =>
                  setRequiresFollowup(e.target.checked)
                }
                className="
                  h-4 w-4
                  rounded
                  border-gray-300
                  accent-primary
                  dark:border-gray-600
                "
              />

              <span>نیازمند نوبت پیگیری</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="
              flex-1
              rounded-xl
              border border-gray-200
              bg-white
              py-2.5
              text-sm
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:opacity-50
              dark:border-gray-700
              dark:bg-gray-800
              dark:text-gray-300
              dark:hover:bg-gray-750
            "
          >
            انصراف
          </button>

          <button
            disabled={!name.trim() || !duration || isSubmitting}
            onClick={handleSubmit}
            className="
              flex-1
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
            "
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}