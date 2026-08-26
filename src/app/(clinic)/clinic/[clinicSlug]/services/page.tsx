"use client";

import { use, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Ban, Sparkles, Syringe, Scissors, Droplet, X } from "lucide-react";

import { getServices, createService, updateService, updateServiceStatus, type ClinicService } from "@/lib/api/services";
import { queryKeys } from "@/lib/query/keys";

import { LoadingLogo } from "@/components/LoadingLogo";


const ICONS = [Sparkles, Syringe, Scissors, Droplet];
const TONES = [
  "from-primary-light/60 to-primary-light/20",
  "from-pink-200 to-pink-100",
  "from-secondary-purple/60 to-secondary-purple/20",
  "from-secondary-blue/60 to-secondary-blue/20",
];

export default function ServicesManagementPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [category, setCategory] = useState("همه");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<ClinicService | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: queryKeys.services.list(clinicSlug),
    queryFn: () => getServices(clinicSlug),
    enabled: !!clinicSlug,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof createService>[1]) => createService(clinicSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.list(clinicSlug) });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateService>[2] }) =>
      updateService(clinicSlug, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.list(clinicSlug) });
      setEditingService(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateServiceStatus(clinicSlug, id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.services.list(clinicSlug) }),
  });

  // چون endpoint مستقلی برای دسته‌بندی‌ها نیست، لیست دسته‌ها را از خودِ داده می‌سازیم
  const categories = useMemo(() => {
    const names = new Set<string>();
    services.forEach((s) => {
      if (s.categoryName) names.add(s.categoryName);
    });
    return ["همه", ...Array.from(names)];
  }, [services]);

  const filtered = services.filter((s) => {
    const matchCategory = category === "همه" || s.categoryName === category;
    const keyword = search.trim();
    const matchSearch = !keyword || s.name.includes(keyword) || (s.categoryName ?? "").includes(keyword);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">خدمات</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت خدمات، قیمت‌ها و مدت‌زمان هر خدمت</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> افزودن خدمت جدید
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی خدمت..."
            className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-300"
          />
          <Search className="h-4 w-4 shrink-0 text-gray-300" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs ${category === c ? "bg-primary text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <LoadingLogo />}

      {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت خدمات</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            const tone = TONES[i % TONES.length];
            return (
              <div key={s.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <div className={`flex h-24 items-center justify-center bg-gradient-to-br ${tone}`}>
                  <Icon className="h-7 w-7 text-white/90" />
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                    <span className={`h-2 w-2 rounded-full ${s.isActive ? "bg-primary" : "bg-gray-300"}`} />
                  </div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{s.categoryName ?? "بدون دسته"}</span> · <span>{s.defaultDurationMinutes.toLocaleString("fa-IR")} دقیقه</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      {s.basePrice != null ? `${s.basePrice.toLocaleString("fa-IR")} تومان` : "—"}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingService(s)}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-primary-dark"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ id: s.id, isActive: !s.isActive })}
                        disabled={statusMutation.isPending}
                        title={s.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-danger disabled:opacity-50"
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
              خدمتی یافت نشد.
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <ServiceFormModal
          title="افزودن خدمت جدید"
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={createMutation.error instanceof Error ? createMutation.error.message : null}
        />
      )}

      {editingService && (
        <ServiceFormModal
          title="ویرایش خدمت"
          initial={editingService}
          onClose={() => setEditingService(null)}
          onSubmit={(payload) => updateMutation.mutate({ id: editingService.id, payload })}
          isSubmitting={updateMutation.isPending}
          error={updateMutation.error instanceof Error ? updateMutation.error.message : null}
        />
      )}
    </div>
  );
}

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
  const [description, setDescription] = useState(initial?.description ?? "");
  const [duration, setDuration] = useState(String(initial?.defaultDurationMinutes ?? 30));
  const [price, setPrice] = useState(initial?.basePrice?.toString() ?? "");
  const [requiresConsent, setRequiresConsent] = useState(initial?.requiresConsent ?? false);
  const [requiresImages, setRequiresImages] = useState(initial?.requiresBeforeAfterImages ?? false);
  const [requiresFollowup, setRequiresFollowup] = useState(initial?.requiresFollowup ?? false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-600">نام خدمت</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600">توضیحات (اختیاری)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-600">مدت‌زمان (دقیقه)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">قیمت پایه (تومان)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" checked={requiresConsent} onChange={(e) => setRequiresConsent(e.target.checked)} />
              نیازمند رضایت‌نامه
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" checked={requiresImages} onChange={(e) => setRequiresImages(e.target.checked)} />
              نیازمند تصاویر قبل/بعد
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" checked={requiresFollowup} onChange={(e) => setRequiresFollowup(e.target.checked)} />
              نیازمند نوبت پیگیری
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            انصراف
          </button>
          <button
            disabled={!name || !duration || isSubmitting}
            onClick={() =>
              onSubmit({
                name,
                description: description || undefined,
                default_duration_minutes: Number(duration),
                base_price: price ? Number(price) : undefined,
                requires_consent: requiresConsent,
                requires_before_after_images: requiresImages,
                requires_followup: requiresFollowup,
              })
            }
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}