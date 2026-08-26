import { apiClient } from "./client";

interface LaravelEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await apiClient<LaravelEnvelope<Record<string, unknown>> | Record<string, unknown> | number>(
    "/notifications/unread-count"
  );

  if (typeof res === "number") return res;

  const data = (res as LaravelEnvelope<Record<string, unknown>>)?.data ?? res;
  if (typeof data === "number") return data;

  const obj = data as Record<string, unknown>;
  return Number(obj.count ?? obj.unread_count ?? 0);
}