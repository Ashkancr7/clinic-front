import { cookies } from "next/headers";

export interface Session {
  userId: string;
  role: "patient" | "doctor" | "receptionist" | "clinic_admin" | "superadmin";
  clinicIds: string[]; // برای بیمار می‌تواند چند مقداره باشد (چندکلینیکی)
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;

  // TODO: به بک‌اند وصل کن یا JWT را دیکود کن
  return {
    userId: "demo-user",
    role: "patient",
    clinicIds: ["demo-clinic"],
  };
}
