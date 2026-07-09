import { getActiveClinic } from "@/lib/auth/clinic-context";

const NAV_ITEMS = [
  { href: "dashboard", label: "داشبورد" },
  { href: "patients", label: "مراجعین" },
  { href: "calendar", label: "تقویم" },
  { href: "reception", label: "پذیرش" },
  { href: "services", label: "خدمات" },
  { href: "finance", label: "مالی" },
  { href: "reports", label: "گزارش‌ها" },
  { href: "users", label: "کاربران" },
  { href: "settings", label: "تنظیمات" },
];

export default async function ClinicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = await params;
  const clinic = await getActiveClinic(clinicSlug);

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50">
      <aside className="w-56 shrink-0 border-l bg-white p-4">
        <div className="mb-6 font-bold text-primary-dark">{clinic?.clinicName ?? "کلینیک"}</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={`/clinic/${clinicSlug}/${item.href}`}
              className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-primary-light/20"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
