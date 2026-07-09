const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

interface RequestOptions extends RequestInit {
  clinicSlug?: string; // اگر ست شود، به‌صورت هدر برای بک‌اند ارسال می‌شود
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { clinicSlug, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(clinicSlug ? { "X-Clinic-Slug": clinicSlug } : {}),
      ...headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message ?? `خطای درخواست: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
