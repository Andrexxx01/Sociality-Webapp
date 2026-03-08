import { APP_CONFIG } from "@/constants/appConfig";
import { getAuthSession, clearAuthSession } from "@/lib/auth-token";
import type { ApiResponse, ApiErrorResponse } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: BodyInit | null;
  headers?: HeadersInit;
  auth?: boolean;
};

function buildUrl(path: string): string {
  if (!APP_CONFIG.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const normalizedBaseUrl = APP_CONFIG.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

function buildHeaders(
  auth: boolean,
  customHeaders?: HeadersInit,
  isFormData?: boolean,
): Headers {
  const headers = new Headers(customHeaders);
  const session = getAuthSession();

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth && session?.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  return headers;
}

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const method = options.method ?? "GET";
  const isFormData = options.body instanceof FormData;

  const response = await fetch(buildUrl(path), {
    method,
    headers: buildHeaders(options.auth ?? false, options.headers, isFormData),
    body: options.body ?? null,
  });

  const payload = await parseJsonSafely<ApiResponse<T> | ApiErrorResponse>(
    response,
  );

  if (!response.ok) {
    const message =
      payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "Request failed.";

    if (response.status === 401 || response.status === 403) {
      clearAuthSession();
    }

    throw new Error(message);
  }

  if (!payload || !("success" in payload)) {
    throw new Error("Invalid API response.");
  }

  if (!payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload as ApiResponse<T>;
}

export async function apiGet<T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">,
): Promise<ApiResponse<T>> {
  return request<T>(path, {
    ...options,
    method: "GET",
  });
}

export async function apiPost<T>(
  path: string,
  body?: Record<string, unknown> | FormData,
  options?: Omit<RequestOptions, "method" | "body">,
): Promise<ApiResponse<T>> {
  return request<T>(path, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
  });
}

export async function apiPatch<T>(
  path: string,
  body?: Record<string, unknown> | FormData,
  options?: Omit<RequestOptions, "method" | "body">,
): Promise<ApiResponse<T>> {
  return request<T>(path, {
    ...options,
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
  });
}

export async function apiDelete<T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">,
): Promise<ApiResponse<T>> {
  return request<T>(path, {
    ...options,
    method: "DELETE",
  });
}
