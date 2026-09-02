import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ClientProfile {
  id: number;
  user_id: number;
  preferred_language: string;
  total_bookings: number;
  total_completed_jobs: number;
  total_cancelled_jobs: number;
  total_active_jobs: number;
  total_reviews: number;
  star_rating: number;
  total_amount_spent: string;
}

/** In-memory cache for the client profile. */
let cachedProfile: ClientProfile | null = null;
let fetchPromise: Promise<ClientProfile | null> | null = null;

async function fetchClientProfileOnce(): Promise<ClientProfile | null> {
  if (cachedProfile) return cachedProfile;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<ClientProfile>("/api/v1/clients/profile")
    .then((data) => {
      cachedProfile = data;
      return cachedProfile;
    })
    .catch((err) => {
      if (err?.status === 404 || err?.status === 403) {
        cachedProfile = null;
        return null;
      }
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useClientProfile(enabled = true) {
  const [profile, setProfile] = useState<ClientProfile | null>(
    enabled ? cachedProfile : null,
  );
  const [loading, setLoading] = useState(
    enabled && !cachedProfile,
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClientProfileOnce();
      setProfile(data);
    } catch {
      setError("Couldn't load profile stats. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    cachedProfile = null;
    fetchPromise = null;
    load();
  }, [load]);

  return { profile, loading, error, retry };
}
