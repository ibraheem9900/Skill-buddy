import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ProviderCurrentStatus {
  status: string;
  reason: string;
  is_current: boolean;
}

/** In-memory cache for the provider current status. */
let cachedStatus: ProviderCurrentStatus | null = null;
let fetchPromise: Promise<ProviderCurrentStatus | null> | null = null;

async function fetchProviderCurrentStatusOnce(): Promise<ProviderCurrentStatus | null> {
  if (cachedStatus) return cachedStatus;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<ProviderCurrentStatus>("/api/v1/providers/status-current")
    .then((data) => {
      cachedStatus = data;
      return cachedStatus;
    })
    .catch((err) => {
      // 404/403 means the user hasn't applied yet or has no provider profile
      if (err?.status === 404 || err?.status === 403) {
        cachedStatus = null;
        return null;
      }
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useProviderCurrentStatus(enabled = true) {
  const [currentStatus, setCurrentStatus] = useState<ProviderCurrentStatus | null>(
    enabled ? cachedStatus : null,
  );
  const [loading, setLoading] = useState(
    enabled && !cachedStatus,
  );
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setCurrentStatus(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProviderCurrentStatusOnce();
      setCurrentStatus(data);
    } catch {
      setError("Couldn't load application status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    cachedStatus = null;
    fetchPromise = null;
    load();
  }, [load]);

  return { currentStatus, loading, error, retry };
}
