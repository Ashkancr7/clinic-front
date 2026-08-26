"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, FolderHeart, ChevronLeft, FileText, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { getPatients } from "@/lib/api/patients";
import { queryKeys } from "@/lib/query/keys";
import { LoadingLogo } from "@/components/LoadingLogo";

const STATUS_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  active: { dot: "bg-primary", text: "text-primary-dark", label: "فعال" },
  inactive: { dot: "bg-gray-300", text: "text-gray-400", label: "غیرفعال" },
  archived: { dot: "bg-gray-300", text: "text-gray-400", label: "آرشیو" },
};

function formatJalaliDate(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

export default function RecordsPage({ params }: { params: Promise<{ clinicSlug: string }> }) {
  const { clinicSlug } = use(params);
  const [search, setSearch] = useState("");

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: queryKeys.patients.list(clinicSlug, { search, context: "records" }),
    queryFn: () => getPatients(clinicSlug, search || undefined),
    enabled: !!clinicSlug,
  });

  const stats = useMemo(
    () => ({
      total: patients.length,
      withVisit: patients.filter((p) => p.lastVisitAt).length,
    }),
    [patients]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <FolderHeart className="h-5 w-5 text-primary-dark" /> پرونده‌ها
        </h1>
        <p className="mt-1 text-sm text-gray-400">دسترسی سریع به پرونده‌ی کامل هر مراجع</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-purple/30 text-purple-600">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[11px] text-gray-400">تعداد پرونده‌ها</div>
            <div className="text-base font-bold text-gray-900">
              {isLoading ? "…" : `${stats.total.toLocaleString("fa-IR")} پرونده`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[11px] text-gray-400">دارای سابقه‌ی مراجعه</div>
            <div className="text-base font-bold text-gray-900">
              {isLoading ? "…" : `${stats.withVisit.toLocaleString("fa-IR")} پرونده`}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام، کد پرونده یا کد ملی..."
              className="w-full bg-transparent text-xs text-gray-600 outline-none placeholder:text-gray-300"
            />
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal className="h-3.5 w-3.5" /> فیلتر
          </button>
        </div>

        {isLoading && <LoadingLogo />}
        {error && <div className="py-10 text-center text-sm text-danger">خطا در دریافت پرونده‌ها</div>}

        {!isLoading && !error && (
          <div className="space-y-3">
            {patients.length > 0 ? (
              patients.map((p) => {
                const status = p.status ? STATUS_STYLE[p.status] : null;
                return (
                  <Link
                    key={p.id}
                    href={`/clinic/${clinicSlug}/patients/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-50 p-3 transition hover:border-gray-100 hover:bg-gray-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <Image src="/image/user.PNG" alt="User" width={36} height={36} unoptimized className="rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-800">
                            {p.firstName} {p.lastName}
                          </span>
                          {status && (
                            <span className={`flex items-center gap-1 text-[10px] ${status.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /> {status.label}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {p.patientCode ?? "—"} · آخرین مراجعه: {formatJalaliDate(p.lastVisitAt)}
                        </div>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[11px] text-primary-dark">
                      <FileText className="h-3.5 w-3.5" /> مشاهده پرونده <ChevronLeft className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
                پرونده‌ای یافت نشد.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}