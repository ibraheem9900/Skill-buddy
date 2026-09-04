import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * GET /api/v1/users/profile-picture — returns the authenticated user's
 * profile picture URL ({ url: string }).
 *
 * Usage pattern: pass `enabled={!!user && !user.avatar_url}` so this is only
 * fetched when the auth-context user doesn't already carry an avatar (the
 * app's existing shared source, set from /users/me or a same-session upload).
 * That avoids a duplicate/network call when the picture is already known.
 *
 * Caching: resolved once per session (module-level) and shared by every
 * consumer (navbar, dashboard sidebar, profile hero) — no per-render or
 * per-component refetching.
 *
 * Errors degrade to `null` so consumers fall back to their initials avatar:
 * - HTTP-level errors (404 "no profile picture", 401 handled upstream by
 *   apiClient's refresh, other 4xx) mark the session as checked → null.
 * - Transient network/5xx errors leave the session unchecked so a later
 *   mount retries automatically (and `retry()` forces an immediate retry).
 */
let cachedUrl: string | null = null;
let checked = false; // whether the backend was already queried this session
let fetchPromise: Promise<string | null> | null = null;

async function fetchProfilePictureOnce(): Promise<string | null> {
  if (checked) return cachedUrl;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const data = await apiClient.get<{ url?: unknown } | string>(
        "/api/v1/users/profile-picture",
      );
      let url: string | null = null;
      if (typeof data === "string") {
        url = data.trim() || null;
      } else if (data && typeof data === "object") {
        const u = (data as { url?: unknown }).url;
        if (typeof u === "string" && u.trim()) url = u.trim();
      }
      cachedUrl = url;
      checked = true;
    } catch (err) {
      const raw = err as { status?: number; detail?: unknown; message?: string } | null;
      const status =
        raw?.status ??
        (err as { response?: { status?: number } } | null)?.response?.status;
      const isServerError = typeof status === "number" && status >= 500;
      const looksLikeApiResponse =
        raw?.detail !== undefined || raw?.message !== undefined || typeof status === "number";
      cachedUrl = null;
      if (looksLikeApiResponse && !isServerError) {
        // 404 / 403 / other 4xx — treat as "no profile picture"; initials fallback.
        checked = true;
      } else {
        // Network failure / timeout / 5xx — retry on the next mount
        console.warn("[profile-picture] fetch failed:", err);
      }
    }
    return cachedUrl;
  })();

  return fetchPromise;
}

/**
 * DELETE /api/v1/users/profile-picture — removes the authenticated user's
 * profile picture. Returns the success message (or null).
 *
 * On success the session cache is cleared (cachedUrl = null, checked = true)
 * so no later GET resurrects the deleted URL, and callers must also clear
 * the avatar in the auth context so every consumer flips to the placeholder.
 *
 * - 200 { message } → message returned, cache cleared
 * - 404/403/"not found" (nothing to delete) → treated as already-removed
 *   (logged, cache cleared, null returned) so stale state can't trap the user
 * - 401 handled upstream by apiClient (refresh → retry → auth:expired)
 * - Network / 5xx / unexpected → logged and rethrown (caller toasts)
 */
export async function deleteProfilePicture(): Promise<string | null> {
  try {
    const res = await apiClient.delete<{ message?: unknown } | string>(
      "/api/v1/users/profile-picture",
    );
    cachedUrl = null;
    checked = true;
    if (typeof res === "string") {
      return res.trim() || null;
    }
    if (res && typeof res === "object") {
      const m = (res as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) return m.trim();
    }
    return null;
  } catch (err) {
    const raw = err as { status?: number; detail?: unknown; message?: string } | null;
    const status =
      raw?.status ??
      (err as { response?: { status?: number } } | null)?.response?.status;
    const detail = typeof raw?.detail === "string" ? raw.detail.toLowerCase() : "";
    const msg = typeof raw?.message === "string" ? raw.message.toLowerCase() : "";
    const isNotFound =
      status === 404 ||
      status === 403 ||
      detail.includes("not found") ||
      msg.includes("not found");
    if (isNotFound) {
      // Nothing to delete — the picture is already gone; clear local state.
      console.info(
        "[profile-picture] delete: no picture existed; treating as removed.",
        err,
      );
      cachedUrl = null;
      checked = true;
      return null;
    }
    console.warn("[profile-picture] delete failed (network/server):", err);
    throw err;
  }
}

export function useProfilePicture(enabled = true) {
  const [url, setUrl] = useState<string | null>(
    enabled && checked ? cachedUrl : null,
  );
  const [loading, setLoading] = useState(enabled && !checked);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const u = await fetchProfilePictureOnce();
      setUrl(u);
    } catch {
      setError("Couldn't load profile picture.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    cachedUrl = null;
    checked = false;
    fetchPromise = null;
    load();
  }, [load]);

  return { url, loading, error, retry };
}