import { useState, useCallback } from "react";
import { apiClient, extractErrorMessage } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";

export interface FavoriteResponse {
  message: string;
  service_id: number;
}

/**
 * Hook for adding a service to favorites.
 *
 * NOTE: The backend currently only exposes POST /api/v1/clients/favorites (add).
 * There is NO DELETE endpoint for removing favorites, and NO GET endpoint for
 * fetching existing favorites. These gaps are flagged for the backend team.
 *
 * Until a GET /favorites endpoint exists, we cannot show pre-filled favorite
 * state or persist favorites across page reloads. The heart toggle is local
 * state only for now.
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
