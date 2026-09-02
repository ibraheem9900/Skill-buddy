import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ProviderProfile {
  id: number;
  user_id: number;
  bio: string;
  hourly_rate: string;
  provider_type: string;
  is_available: boolean;
  is_active: boolean;
  total_jobs_completed: number;
  total_jobs_cancelled_by_provider: number;
  total_jobs_cancelled_by_client: number;
  total_jobs_inprogress: number;
  total_reviews: number;
  star_rating: number;
  badge_count: number;
  credibility_score: number;
  response_time_avg: number;
  service_radius: number;
  current_status: {
    status: string;
    reason: string;
    is_current: boolean;
  } | null;
}

/** In-memory cache for the provider profile. */
let cachedProfile: ProviderProfile | null = null;
let fetchPromise: Promise<ProviderProfile | null> | null = null;

async function fetchProviderProfileOnce(): Promise<ProviderProfile | null> {
  if (cachedProfile) return cachedProfile;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<ProviderProfile>("/api/v1/providers/profile")
    .then((data) => {
      cachedProfile = data;
      return cachedProfile;
    })
    .catch((err) => {
      // 404/403 means the user doesn't have a provider profile yet — not an error
      if (err?.status === 404 || err?.status === 403) {
        cachedProfile = null;
        return null;
      }
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useProviderProfile(enabled = true) {
  const [profile, setProfile] = useState<ProviderProfile | null>(
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
      const data = await fetchProviderProfileOnce();
      setProfile(data);
    } catch {
      setError("Couldn't load provider profile. Please try again.");
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
