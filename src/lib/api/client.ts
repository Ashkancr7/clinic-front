
const PROXY_BASE = "/api/proxy";

interface RequestOptions extends RequestInit {
  /**
   * برای APIهایی که بر اساس slug کلینیک کار می‌کنند.
   */
  clinicSlug?: string;

  /**
   * فقط برای APIهای قدیمی که نیاز دارند
   * clinic ID از طریق header ارسال شود.
   *
   * APIهای جدید Super Admin مثل:
   *
   * /super-admin/clinics/{clinic}/modules
   *
   * نیازی به این گزینه ندارند.
   */
  directClinicId?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number
  ) {
    super(message);

    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    clinicSlug,
    directClinicId,
    headers,
    ...rest
  } = options;

  /**
   * =========================================================
   * Request Headers
   * =========================================================
   */

  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",

    ...(clinicSlug
      ? {
          "X-Clinic-Slug": clinicSlug,
        }
      : {}),

    /**
     * فقط اگر caller مشخص کرده باشد.
     *
     * برای endpointهای جدید Super Admin استفاده نمی‌شود.
     */
    ...(directClinicId
      ? {
          "X-Direct-Clinic-Id": directClinicId,
        }
      : {}),

    ...(headers ?? {}),
  };

  /**
   * =========================================================
   * Request
   * =========================================================
   */

  const res = await fetch(
    `${PROXY_BASE}${path}`,
    {
      ...rest,
      headers: requestHeaders,
      credentials: "include",
    }
  );

  /**
   * =========================================================
   * Response Body
   * =========================================================
   */

  const body = await res
    .json()
    .catch(() => null);

  /**
   * =========================================================
   * Error Handling
   * =========================================================
   */

  if (!res.ok) {
    console.error(
      `API error [${res.status}] ${path}:`,
      JSON.stringify(
        body,
        null,
        2
      )
    );

    throw new ApiError(
      body?.message ??
        `خطای درخواست: ${res.status}`,
      res.status
    );
  }

  return body as T;
}

