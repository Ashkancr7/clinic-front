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

  // TODO: لیست همه‌ی کلینیک‌های عضویت بیمار را از API بگیر
  const myClinics = [
    {
      slug: clinicSlug,
      name: clinic?.clinicSlug ?? clinicSlug,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen">
      <header className="glass flex items-center justify-between rounded-none px-4 py-3 md:px-8">
        <span className="font-bold text-primary-light">
          {clinic?.clinicSlug ?? "کلینیک"}
        </span>

        <ClinicSwitcher
          currentSlug={clinicSlug}
          clinics={myClinics}
          basePath="patient"
        />
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8">
        <div className="glass-content rounded-3xl p-4 text-gray-900 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}