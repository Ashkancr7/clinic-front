import { NextRequest, NextResponse } from "next/server";

/**
 * این میدلور دو کار انجام می‌دهد:
 * ۱. بررسی می‌کند کاربر لاگین کرده و نقش او اجازه‌ی ورود به این route group را دارد
 * ۲. اگر مسیر شامل [clinicSlug] است، بررسی می‌کند کاربر واقعاً عضو همان کلینیک است
 *    (طبق NFR-TENANT-03: داده هر کلینیک باید کاملاً از کلینیک‌های دیگر جدا بماند)
 */

const PATIENT_PREFIX = "/patient/";
const CLINIC_PREFIX = "/clinic/";
const SUPERADMIN_PREFIX = "/super-admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // مسیرهای عمومی/احراز هویت نیازی به گارد ندارند
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/otp") ||
    pathname.startsWith("/select-clinic") ||
    pathname.includes("/intake") ||
    pathname.startsWith("/super-admin") ||
    pathname.includes("/dashboard") ||
    pathname.includes("/appointments") ||
    pathname.includes("/services") ||
    pathname.includes("/chat") ||
    pathname.includes("/medical-records")




  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TODO: session را با فراخوانی بک‌اند یا دیکود توکن اعتبارسنجی کن
  // const user = await verifySession(session);
  const user = { role: "patient", clinicIds: ["demo-clinic"] }; // placeholder موقت

  if (pathname.startsWith(SUPERADMIN_PREFIX) && user.role !== "superadmin") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const clinicSlugMatch =
    pathname.startsWith(PATIENT_PREFIX) || pathname.startsWith(CLINIC_PREFIX)
      ? pathname.split("/")[2]
      : null;

  if (clinicSlugMatch && !user.clinicIds.includes(clinicSlugMatch)) {
    // کاربر عضو این کلینیک نیست → اجازه‌ی دسترسی به داده‌های آن را ندارد
    return NextResponse.redirect(new URL("/select-clinic", request.url));
  }

  if (pathname.startsWith(PATIENT_PREFIX) && user.role !== "patient") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    pathname.startsWith(CLINIC_PREFIX) &&
    !["doctor", "receptionist", "clinic_admin"].includes(user.role)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * روی همه‌ی مسیرها اجرا شود، به‌جز فایل‌های استاتیک/تصاویر/api داخلی نکست
     * اضافه شدن |image برای عبور از میدل‌ور
     */
    "/((?!_next/static|_next/image|favicon.ico|api|image).*)",
  ],
};
