/**
 * Central HTTP client for the SkillBuddy FastAPI backend.
 *
 * - Reads base URL from VITE_API_BASE_URL (never hardcoded).
 * - Attaches Bearer token on every authenticated request.
 * - Auto-refreshes tokens on 401, retries once, then clears session and emits 'auth:expired'.
 */

import { tokenStore } from "./auth-tokens";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? "";

// Queued callbacks waiting for an in-flight refresh to finish
let isRefreshing = false;
let refreshSubscribers: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
  refreshSubscribers = [];
}

function onRefreshFailed(err: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
}

function addRefreshSubscriber(resolve: (token: string) => void, reject: (err: unknown) => void) {
  refreshSubscribers.push({ resolve, reject });
}

async function doRefresh(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/api/v1/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  tokenStore.setAccess(data.access_token);
  tokenStore.setRefresh(data.refresh_token);
  return data.access_token;
}

function expireSession() {
  tokenStore.clear();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:expired"));
  }
}

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | FormData | string | URLSearchParams;
  /** If true, send Content-Type: application/x-www-form-urlencoded */
  formEncoded?: boolean;
}

async function _request(path: string, init: ApiRequestInit = {}, isRetry = false): Promise<Response> {
  const accessToken = tokenStore.getAccess();
  const headers = new Headers(init.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let body: BodyInit | undefined;

  if (init.body instanceof FormData || init.body instanceof URLSearchParams || typeof init.body === "string") {
    body = init.body as BodyInit;
  } else if (init.body !== undefined) {
    if (init.formEncoded) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(init.body as Record<string, unknown>)) {
        if (v !== undefined && v !== null) params.set(k, String(v));
      }
      body = params;
      headers.set("Content-Type", "application/x-www-form-urlencoded");
    } else {
      body = JSON.stringify(init.body);
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    body,
  });

  if (res.status === 401 && !isRetry) {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      expireSession();
      throw new Error("Session expired. Please log in again.");
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await doRefresh();
        onRefreshed(newToken);
      } catch (err) {
        onRefreshFailed(err);
        isRefreshing = false;
        expireSession();
        throw new Error("Session expired. Please log in again.");
      }
      isRefreshing = false;
    } else {
      // Wait for the in-flight refresh — propagates both success and failure
      await new Promise<string>((resolve, reject) => {
        addRefreshSubscriber(resolve, reject);
      });
    }

    return _request(path, init, true);
  }

  return res;
}

/** Parse JSON and throw on API errors. Exposed 422 details are returned as-is. */
async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return text as unknown as T;
  }
  if (!res.ok) throw json;
  return json as T;
}

export const apiClient = {
  get: async <T>(path: string, init?: Omit<ApiRequestInit, "body">) =>
    parseResponse<T>(await _request(path, { ...init, method: "GET" })),

  post: async <T>(path: string, body?: ApiRequestInit["body"], init?: ApiRequestInit) =>
    parseResponse<T>(await _request(path, { ...init, method: "POST", body })),

  patch: async <T>(path: string, body?: ApiRequestInit["body"], init?: ApiRequestInit) =>
    parseResponse<T>(await _request(path, { ...init, method: "PATCH", body })),

  delete: async <T>(path: string, body?: ApiRequestInit["body"], init?: ApiRequestInit) =>
    parseResponse<T>(await _request(path, { ...init, method: "DELETE", body })),

  /** Upload multipart/form-data — do NOT set Content-Type manually, let fetch do it. */
  upload: async <T>(path: string, form: FormData) =>
    parseResponse<T>(await _request(path, { method: "POST", body: form })),

  /** Raw request for cases where you need the Response object directly (e.g. OAuth redirect check). */
  raw: (path: string, init?: ApiRequestInit) => _request(path, init),
};

/** Extract field-level validation errors from a FastAPI 422 response detail array. */
export function extractFieldErrors(err: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (
    err &&
    typeof err === "object" &&
    "detail" in err &&
    Array.isArray((err as { detail: unknown }).detail)
  ) {
    for (const item of (err as { detail: Array<{ loc: string[]; msg: string }> }).detail) {
      const field = item.loc[item.loc.length - 1];
      if (field) fieldErrors[field] = item.msg;
    }
  }
  return fieldErrors;
}

/** Extract a human-readable error message from any API error shape. */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.detail === "string") return e.detail;
    if (Array.isArray(e.detail) && e.detail.length > 0) {
      const first = e.detail[0] as { msg?: string };
      return first?.msg ?? fallback;
    }
  }
  return fallback;
}
