import { getActiveClinic } from "@/lib/auth/clinic-context";
import { ClinicSwitcher } from "@/components/layout/ClinicSwitcher";

export default async function PatientClinicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clinicSlug: string }>;
}) {
  const { clinicSlug } = await params;
  const clinic = await getActiveClinic(clinicSlug);

  // TODO: لیست همه‌ی کلینیک‌های عضویت بیمار را از API بگیر (برای ClinicSwitcher)
  const myClinics = [{ slug: clinicSlug, name: clinic?.clinicName ?? clinicSlug }];

  return (
  <div dir="rtl" className="min-h-screen bg-gray-50">
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:px-8">
      <span className="font-bold text-primary-dark">
        {clinic?.clinicName ?? "کلینیک"}
      </span>

      <ClinicSwitcher
        currentSlug={clinicSlug}
        clinics={myClinics}
        basePath="patient"
      />
    </header>

    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8">
      {children}
    </main>
  </div>
);
}
