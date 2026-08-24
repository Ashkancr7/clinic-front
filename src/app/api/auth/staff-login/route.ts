import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "https://api.hessjr.com/api/v1";

export async function POST(req: NextRequest) {
  const { phone, password, rememberMe } = await req.json();

  const upstream = await fetch(`${API_URL}/auth/staff/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ phone, password }),
  });

  const body = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json({ message: body?.message ?? "ورود ناموفق بود" }, { status: upstream.status });
  }

  const { token, user, clinics } = body.data;

  const res = NextResponse.json({
    user,
    clinics: clinics.map((c: any) => ({ id: c.id, slug: c.slug })),
  });

  // اگر rememberMe تیک نخورده باشد، maxAge ست نمی‌شود → کوکی session-only
  // (با بستن کامل مرورگر پاک می‌شود). اگر تیک خورده باشد، ۷ روز می‌ماند.
  const baseCookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  const cookieOpts = rememberMe
    ? { ...baseCookieOpts, maxAge: 60 * 60 * 24 * 7 }
    : baseCookieOpts;

  res.cookies.set("access_token", token, cookieOpts);
  res.cookies.set("user_type", user.user_type, cookieOpts);
  res.cookies.set("clinics", JSON.stringify(clinics.map((c: any) => ({ id: c.id, slug: c.slug }))), cookieOpts);

  return res;
}