"use client";

import { useRouter } from "next/navigation";

interface ClinicOption {
  slug: string;
  name: string;
}

interface ClinicSwitcherProps {
  currentSlug: string;
  clinics: ClinicOption[];
  basePath: "patient" | "clinic";
}

/**
 * فقط زمانی نمایش بده که clinics.length > 1 باشد.
 * با انتخاب کلینیک جدید، کل داده‌ها دوباره fetch می‌شوند (چون clinicSlug عوض شده و query key هم عوض می‌شود).
 */
export function ClinicSwitcher({ currentSlug, clinics, basePath }: ClinicSwitcherProps) {
  const router = useRouter();

  if (clinics.length <= 1) return null;

  return (
    <select
      value={currentSlug}
      onChange={(e) => router.push(`/${basePath}/${e.target.value}/dashboard`)}
      className="glass-input rounded-lg px-3 py-1.5 text-sm [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-abyss-900 dark:[&>option]:text-gray-100"
    >
      {clinics.map((clinic) => (
        <option key={clinic.slug} value={clinic.slug}>
          {clinic.name}
        </option>
      ))}
    </select>
  );
}
