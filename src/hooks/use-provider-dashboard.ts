import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ProviderDashboard {
  user_id: number;
  total_jobs_completed: number;
  total_jobs_inprogress: number;
  is_available: boolean;
  is_active: boolean;
}

/** In-memory cache for the provider dashboard summary. */
let cachedDashboard: ProviderDashboard | null = null;
let fetchPromise: Promise<ProviderDashboard | null> | null = null;

async function fetchProviderDashboardOnce(): Promise<ProviderDashboard | null> {
  if (cachedDashboard) return cachedDashboard;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<ProviderDashboard>("/api/v1/providers/dashboard")
    .then((data) => {
      cachedDashboard = data;
      return cachedDashboard;
    })
    .catch((err) => {
      // 404/403 means the user doesn't have a provider profile yet
      if (err?.status === 404 || err?.status === 403) {
        cachedDashboard = null;
        return null;
      }
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useProviderDashboard(enabled = true) {
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(
    enabled ? cachedDashboard : null,
  );
  const [loading, setLoading] = useState(
    enabled && !cachedDashboard,
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setDashboard(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProviderDashboardOnce();
      setDashboard(data);
    } catch {
      setError("Couldn't load dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    cachedDashboard = null;
    fetchPromise = null;
    load();
  }, [load]);

  return { dashboard, loading, error, retry };
}
