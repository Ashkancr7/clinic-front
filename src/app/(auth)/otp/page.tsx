import { Suspense } from "react";
import OtpForm from "./OtpForm";

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white px-5">
          <div className="w-full max-w-sm rounded-3xl border border-gray-100 p-6 text-center shadow-xl">
            <p className="text-sm text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      }
    >
      <OtpForm />
    </Suspense>
  );
}