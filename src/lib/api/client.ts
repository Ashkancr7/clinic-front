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

  /**
   * اگر body از نوع FormData باشد، نباید Content-Type را
   * دستی تنظیم کنیم.
   *
   * مرورگر خودش Content-Type مناسب به همراه multipart boundary
   * را ایجاد می‌کند.
   */
  const isFormData =
    typeof FormData !== "undefined" &&
    rest.body instanceof FormData;

  const requestHeaders: HeadersInit = {
    Accept: "application/json",

    /**
     * برای درخواست‌های معمولی JSON ارسال می‌کنیم.
     *
     * برای FormData این header را حذف می‌کنیم تا مرورگر
     * خودش boundary صحیح را تنظیم کند.
     */
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    /**
     * Header مربوط به clinic slug
     */
    ...(clinicSlug
      ? {
          "X-Clinic-Slug": clinicSlug,
        }
      : {}),

    /**
     * فقط برای APIهای قدیمی که نیاز به Clinic ID دارند.
     *
     * Endpointهای جدید Super Admin مثل:
     *
     * /super-admin/clinics/{clinic}/modules
     *
     * نباید از این گزینه استفاده کنند.
     */
    ...(directClinicId
      ? {
          "X-Direct-Clinic-Id": directClinicId,
        }
      : {}),

    /**
     * اجازه می‌دهیم caller بتواند headerهای اضافی
     * خودش را نیز ارسال کند.
     */
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