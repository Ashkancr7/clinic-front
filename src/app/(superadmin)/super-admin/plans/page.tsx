"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, Pencil, Sparkles, X } from "lucide-react";

import { superAdminApi, type Plan } from "@/lib/api/super-admin";
import { queryKeys } from "@/lib/query/keys";

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: queryKeys.superAdmin.plans.list(),
    queryFn: superAdminApi.getPlans,
  });

  const createMutation = useMutation({
    mutationFn: superAdminApi.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.plans.list() });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ planId, payload }: { planId: string; payload: Partial<Omit<Plan, "id">> }) =>
      superAdminApi.updatePlan(planId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.plans.list() });
      setEditingPlan(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">پلن‌های اشتراک</h1>
          <p className="mt-1 text-sm text-gray-400">مدیریت پلن‌های قابل‌فروش به کلینیک‌ها</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> ایجاد پلن جدید
        </button>
      </div>

      {isLoading && <div className="py-10 text-center text-sm text-gray-400">در حال بارگذاری...</div>}
      {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت پلن‌ها</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 ${
                plan.is_active ? "border-gray-100" : "border-red-100 opacity-60"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light/20 text-primary-dark">
                  <Sparkles className="h-5 w-5" />
                </div>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-base font-bold text-gray-900">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-gray-900">{plan.price.toLocaleString("fa-IR")}</span>
                <span className="text-xs text-gray-400">تومان / {plan.billing_cycle === "monthly" ? "ماه" : "سال"}</span>
              </div>
              {!plan.is_active && <div className="mt-1 text-[11px] text-danger">غیرفعال</div>}

              <ul className="mt-5 space-y-2.5">
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-dark" />
                  {plan.max_users ? `تا ${plan.max_users.toLocaleString("fa-IR")} کاربر فعال` : "کاربران نامحدود"}
                </li>
                {plan.max_sms_per_month != null && (
                  <li className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-dark" />
                    تا {plan.max_sms_per_month.toLocaleString("fa-IR")} پیامک در ماه
                  </li>
                )}
                {(plan.included_modules ?? []).map((m) => (
                  <li key={m} className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-dark" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm text-gray-400">هنوز پلنی ثبت نشده.</div>
          )}
        </div>
      )}

      {showCreateModal && (
        <PlanFormModal
          title="ایجاد پلن جدید"
          onClose={() => setShowCreateModal(false)}
          onSubmit={(payload) => createMutation.mutate(payload)}
          isSubmitting={createMutation.isPending}
          error={createMutation.error instanceof Error ? createMutation.error.message : null}
        />
      )}

      {editingPlan && (
        <PlanFormModal
          title="ویرایش پلن"
          initial={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSubmit={(payload) => updateMutation.mutate({ planId: editingPlan.id, payload })}
          isSubmitting={updateMutation.isPending}
          error={updateMutation.error instanceof Error ? updateMutation.error.message : null}
        />
      )}
    </div>
  );
}

function PlanFormModal({
  title,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  title: string;
  initial?: Plan;
  onClose: () => void;
  onSubmit: (payload: Omit<Plan, "id">) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [billingCycle, setBillingCycle] = useState<Plan["billing_cycle"]>(initial?.billing_cycle ?? "monthly");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [maxUsers, setMaxUsers] = useState(initial?.max_users?.toString() ?? "");
  const [modulesText, setModulesText] = useState((initial?.included_modules ?? []).join("، "));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const modules = useMemo(
    () => modulesText.split(/[،,]/).map((m) => m.trim()).filter(Boolean),
    [modulesText]
  );

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
            <label className="mb-1 block text-xs text-gray-600">نام پلن</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-600">قیمت (تومان)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">دوره‌ی صورتحساب</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as Plan["billing_cycle"])}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none"
              >
                <option value="monthly">ماهانه</option>
                <option value="yearly">سالانه</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-600">حداکثر کاربران (خالی = نامحدود)</label>
            <input
              type="number"
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-600">ماژول‌های شامل (با ویرگول جدا کنید)</label>
            <textarea
              value={modulesText}
              onChange={(e) => setModulesText(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="چت، نوبت‌دهی، تماس تصویری"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            پلن فعال باشد
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            انصراف
          </button>
          <button
            disabled={!name || !price || isSubmitting}
            onClick={() =>
              onSubmit({
                name,
                billing_cycle: billingCycle,
                price: Number(price),
                max_users: maxUsers ? Number(maxUsers) : null,
                max_file_storage_mb: initial?.max_file_storage_mb ?? null,
                max_sms_per_month: initial?.max_sms_per_month ?? null,
                included_modules: modules,
                is_active: isActive,
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