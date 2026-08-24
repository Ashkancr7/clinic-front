const PROXY_BASE = "/api/proxy";

interface RequestOptions extends RequestInit {
  clinicSlug?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { clinicSlug, headers, ...rest } = options;

  const res = await fetch(`${PROXY_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(clinicSlug ? { "X-Clinic-Slug": clinicSlug } : {}),
      ...headers,
    },
    credentials: "include",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    console.log(`API error [${res.status}] ${path}:`, JSON.stringify(body, null, 2)); // موقت برای دیباگ
    throw new ApiError(body?.message ?? `خطای درخواست: ${res.status}`, res.status);
  }

  return body as T;
}