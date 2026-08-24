import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "https://api.hessjr.com/api/v1";

async function forward(req: NextRequest, pathParts: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const clinicSlugHeader = req.headers.get("X-Clinic-Slug");

  let clinicId: string | undefined;
  if (clinicSlugHeader) {
    const clinicsRaw = cookieStore.get("clinics")?.value;
    const clinics: { id: string; slug: string }[] = clinicsRaw ? JSON.parse(clinicsRaw) : [];
    clinicId = clinics.find((c) => c.slug === clinicSlugHeader)?.id;

    if (!clinicId) {
      return NextResponse.json({ message: "دسترسی به این کلینیک وجود ندارد" }, { status: 403 });
    }
  }

  const targetUrl = `${API_URL}/${pathParts.join("/")}${req.nextUrl.search}`;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD" && method !== "DELETE";

  const upstream = await fetch(targetUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(clinicId ? { "X-Clinic-Id": clinicId } : {}),
    },
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });

  const data = await upstream.text();

  // 401 از بک‌اند یعنی توکن نامعتبر/منقضی → کوکی‌ها رو پاک کن
  if (upstream.status === 401) {
    const res = new NextResponse(data, {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    res.cookies.delete("access_token");
    res.cookies.delete("user_type");
    res.cookies.delete("clinics");
    return res;
  }

  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}