import { useState, useEffect, useCallback } from "react";
import { apiClient, extractErrorMessage } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

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
 * Hook for adding a service to favorites.
 *
 * The heart toggle is local UI state; to see which services are actually
 * saved use useFavoritesList() (GET /api/v1/clients/favorites).
 */
export function useFavorites() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const addFavorite = useCallback(
    async (serviceId: number): Promise<FavoriteResponse | null> => {
      if (!user) return null;
      setLoading(true);
      try {
        const res = await apiClient.post<FavoriteResponse>(
          "/api/v1/clients/favorites",
          { service_id: serviceId }
        );
        return res;
      } catch (err) {
        const msg = extractErrorMessage(err, "Couldn't add to favorites.");
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { addFavorite, loading };
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

  return { favorites, total, loading, error, retry: load, updateNotes, removeFavorite: remove };
}