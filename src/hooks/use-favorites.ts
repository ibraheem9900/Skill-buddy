import { useState, useEffect, useCallback, useReducer } from "react";
import { apiClient, extractErrorMessage } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

/** POST /api/v1/clients/favorites success body — note: no favorite_id, only service_id. */
export interface FavoriteResponse {
  message: string;
  service_id: number;
}

/** A single saved favorite (GET /api/v1/clients/favorites + PATCH/{id} shape). */
export interface FavoriteItem {
  id: number;
  service_id: number;
  notes: string | null;
  created_at: string;
}

export interface FavoriteListResponse {
  favorites?: FavoriteItem[];
  total: number;
}

/**
 * Resolve the numeric backend service id for a card/service. Live catalog items
 * carry `apiId`; seed-fallback ids look like "s12" (strip the non-numeric part).
 */
export function toFavoriteServiceId(
  id: string | number,
  apiId?: number | null
): number | null {
  if (apiId != null && Number.isFinite(Number(apiId)) && Number(apiId) > 0) {
    return Number(apiId);
  }
  const n = Number(String(id).replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─── Session-wide favorites membership (service_id → favorite_id) ─────────────
// Shared by every heart so all cards agree without per-card network calls.
// null = not resolved yet; {} = resolved (possibly empty). Reset per signed-in
// user so one account's hearts can never leak into another session.
let favByService: Record<number, number> | null = null;
let favFetchPromise: Promise<void> | null = null;
let favMembershipUserId: string | number | null | undefined;
const favListeners = new Set<() => void>();

function notifyFavChanged(): void {
  for (const listener of favListeners) listener();
}

/**
 * Load GET /api/v1/clients/favorites once per session (deduped) into the
 * shared membership map. Never throws — a heart must not crash the catalog;
 * an unreachable/denied list simply reads as "nothing saved" (the add path
 * force-reloads afterward, which self-heals the map).
 */
async function ensureFavMembership(force = false): Promise<void> {
  if (!force && favByService) return;
  if (!force && favFetchPromise) return favFetchPromise;
  favFetchPromise = (async () => {
    try {
      const data = await apiClient.get<FavoriteListResponse>(
        "/api/v1/clients/favorites"
      );
      const next: Record<number, number> = {};
      for (const f of data?.favorites ?? []) next[f.service_id] = f.id;
      favByService = next;
    } catch (err) {
      favByService = favByService ?? {};
      console.warn(
        "[favorites] membership list unavailable; hearts default to unsaved.",
        err
      );
    } finally {
      favFetchPromise = null;
      notifyFavChanged();
    }
  })();
  return favFetchPromise;
}

export interface UseFavoriteResult {
  /** True when this service is in the client's saved favorites. */
  isFavorited: boolean;
  /** True while the add/remove request is in flight. */
  toggling: boolean;
  /** False only while the membership list is still loading for a client user. */
  ready: boolean;
  /** Add or remove the service; resolves true = now favorited, false = removed. */
  toggleFavorite: () => Promise<boolean>;
}

/**
 * Server-backed favorite heart for one service.
 *
 * Membership (which services are saved, and their real favorite ids) comes
 * from GET /api/v1/clients/favorites, fetched once per session and shared by
 * every heart, so the UI reflects reality on load and stays in sync across
 * cards without extra network calls.
 *
 * Toggling on POSTs { service_id } — the response carries only { message,
 * service_id }, so afterward the membership list is reloaded to learn the real
 * favorite_id (needed by PATCH/DELETE). Toggling off DELETEs via the stored
 * favorite_id.
 */
export function useFavorite(serviceId: number | null): UseFavoriteResult {
  const { user, roles } = useAuth();
  const [toggling, setToggling] = useState(false);
  const [, bump] = useReducer((x: number) => x + 1, 0);

  // A client favorites list only exists for CLIENT accounts (logged out →
  // allow the flow so the heart can route to login).
  const userRoles =
    roles.length > 0
      ? roles
      : user?.roles ?? (user?.role ? [user.role] : []);
  const canHaveFavorites = !user || userRoles.includes("CLIENT");
  const needsMembership = !!user && canHaveFavorites;

  // Reset + reload when the signed-in user changes; skip fetches entirely for
  // logged-out visitors and PROVIDER-only accounts.
  useEffect(() => {
    if (favMembershipUserId !== (user?.id ?? null)) {
      favByService = null;
      favFetchPromise = null;
      favMembershipUserId = user?.id ?? null;
    }
    if (user && canHaveFavorites && serviceId != null) {
      void ensureFavMembership();
    }
  }, [user, canHaveFavorites, serviceId]);

  // Re-render when the shared membership map changes (initial load, or another
  // card favorited/unfavorited something).
  useEffect(() => {
    favListeners.add(bump);
    return () => {
      favListeners.delete(bump);
    };
  }, []);

  const favId =
    serviceId != null && favByService ? favByService[serviceId] ?? null : null;
  const isFavorited = favId != null;
  const membershipLoading = needsMembership && favByService === null;

  const toggleFavorite = useCallback(async (): Promise<boolean> => {
    if (serviceId == null) throw new Error("Missing service id.");
    setToggling(true);
    try {
      // Remove — needs the real favorite_id this session learned from the list.
      if (favId != null) {
        await removeFavorite(favId); // rethrows except not-found
        if (favByService) delete favByService[serviceId];
        notifyFavChanged();
        return false;
      }
      // Add — POST returns only { message, service_id }; reload the list so the
      // real favorite_id is known for later update/delete calls.
      try {
        await apiClient.post<FavoriteResponse>("/api/v1/clients/favorites", {
          service_id: serviceId,
        });
      } catch (err) {
        const detail = (err as { detail?: unknown } | null)?.detail;
        const hint = `${err}`.toLowerCase();
        const alreadySaved =
          !Array.isArray(detail) &&
          (hint.includes("already") || hint.includes("duplicate"));
        if (Array.isArray(detail)) {
          console.warn(
            `[favorites] addFavorite(${serviceId}) validation error (422):`,
            detail
          );
        } else if (!alreadySaved) {
          console.warn(
            `[favorites] addFavorite(${serviceId}) failed (network/server):`,
            err
          );
        }
        if (!alreadySaved) throw err;
        // Duplicate save is a no-op success: reconcile below and heart fills.
      }
      await ensureFavMembership(true);
      return true;
    } finally {
      setToggling(false);
    }
  }, [serviceId, favId]);

  return { isFavorited, toggling, ready: !membershipLoading, toggleFavorite };
}

/**
 * PATCH /api/v1/clients/favorites/{favorite_id} — updates a saved
 * favorite's notes ({ notes }, maxLength 500, optional). Auth handled by
 * apiClient. 422 detail arrays are logged for debugging and the error is
 * rethrown so the caller can show a user-facing toast; network/server
 * failures are logged separately before rethrowing.
 */
export async function updateFavoriteNotes(
  favoriteId: number,
  notes: string
): Promise<FavoriteItem> {
  try {
    return await apiClient.patch<FavoriteItem>(
      `/api/v1/clients/favorites/${favoriteId}`,
      { notes }
    );
  } catch (err) {
    const detail = (err as { detail?: unknown } | null)?.detail;
    if (Array.isArray(detail)) {
      console.warn(
        `[favorites] updateFavoriteNotes(${favoriteId}) validation error (422):`,
        detail
      );
    } else {
      console.warn(
        `[favorites] updateFavoriteNotes(${favoriteId}) failed (network/server):`,
        err
      );
    }
    throw err;
  }
}

/**
 * GET /api/v1/clients/favorites/{favorite_id} — fetches one saved favorite
 * by id ({ id, service_id, notes, created_at }). Auth handled by apiClient.
 *
 * Returns the favorite, or null when it no longer exists (404/403/"not
 * found") so callers can fall back to list data gracefully. 422 detail
 * arrays are logged for debugging; network/server failures are logged
 * separately — both are rethrown so the caller can show a user-facing error.
 */
export async function fetchFavorite(
  favoriteId: number
): Promise<FavoriteItem | null> {
  try {
    return await apiClient.get<FavoriteItem>(
      `/api/v1/clients/favorites/${favoriteId}`
    );
  } catch (err) {
    const raw =
      err as { status?: number; detail?: unknown; message?: string } | null;
    const status =
      raw?.status ??
      (err as { response?: { status?: number } } | null)?.response?.status;
    const detail =
      typeof raw?.detail === "string" ? raw.detail.toLowerCase() : "";
    const msg = typeof raw?.message === "string" ? raw.message.toLowerCase() : "";
    const isNotFound =
      status === 404 ||
      status === 403 ||
      detail.includes("not found") ||
      msg.includes("not found");
    if (isNotFound) {
      console.info(
        `[favorites] fetchFavorite(${favoriteId}) not found; returning null.`,
        err
      );
      return null;
    }
    if (Array.isArray(raw?.detail)) {
      console.warn(
        `[favorites] fetchFavorite(${favoriteId}) validation error (422):`,
        raw.detail
      );
    } else {
      console.warn(
        `[favorites] fetchFavorite(${favoriteId}) failed (network/server):`,
        err
      );
    }
    throw err;
  }
}

/**
 * DELETE /api/v1/clients/favorites/{favorite_id} — removes a saved favorite.
 *
 * Success is 204 No Content: there is no response body, so this never tries
 * to parse JSON on success. Error handling is split:
 * - 404/403/"not found": already removed — treated as success (stale cleanup,
 *   logged) so the row clears instead of blocking forever.
 * - 422 (detail array): logged to console for debugging, rethrown.
 * - Network / timeout / 5xx / unexpected: logged separately, rethrown.
 */
export async function removeFavorite(favoriteId: number): Promise<void> {
  try {
    // 204 → empty body; apiClient.parseResponse tolerates ok responses with
    // no JSON (returns the empty text as-is) — no JSON-parse crash.
    await apiClient.delete<unknown>(`/api/v1/clients/favorites/${favoriteId}`);
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
      console.info(
        `[favorites] removeFavorite(${favoriteId}) already absent; treating as removed.`,
        err
      );
      return;
    }
    if (Array.isArray(raw?.detail)) {
      console.warn(
        `[favorites] removeFavorite(${favoriteId}) validation error (422):`,
        raw.detail
      );
    } else {
      console.warn(
        `[favorites] removeFavorite(${favoriteId}) failed (network/server):`,
        err
      );
    }
    throw err;
  }
}

/**
 * Hook for the authenticated client's saved favorites list.
 *
 * GET /api/v1/clients/favorites via the centralized authenticated apiClient.
 * Loading / error / retry states included; updateNotes() PATCHes a favorite's
 * notes and updates the in-memory list immediately (no refetch needed).
 */
export function useFavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<FavoriteListResponse>(
        "/api/v1/clients/favorites"
      );
      setFavorites(data?.favorites ?? []);
      setTotal(data?.total ?? data?.favorites?.length ?? 0);
    } catch (err) {
      const msg = extractErrorMessage(err, "Couldn't load saved services.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateNotes = useCallback(
    async (favoriteId: number, notes: string): Promise<FavoriteItem> => {
      const updated = await updateFavoriteNotes(favoriteId, notes); // rethrows on failure
      setFavorites((prev) =>
        prev.map((f) => (f.id === updated.id ? updated : f))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(async (favoriteId: number): Promise<void> => {
    await removeFavorite(favoriteId); // rethrows except not-found
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  return {
    favorites,
    total,
    loading,
    error,
    retry: load,
    updateNotes,
    removeFavorite: remove,
    loadDetail: fetchFavorite,
  };
}
