import { useCallback, useEffect, useMemo, useState } from "react";
import { SERVICES } from "@/lib/data";
import {
  clearServicesCache,
  fetchServices,
  toServiceShape,
  type ApiService,
} from "@/lib/services-api";

/**
 * Session-wide hook for the public services catalog (GET /api/v1/services).
 *
 * The catalog is fetched ONCE and cached in memory (see services-api.ts), so
 * every consumer shares the same data without re-fetching.
 *
 * Fallback convention (same as the categories list on this page): when the
 * backend has no services yet (empty array) or the request fails, the rich
 * seed catalog stays visible so the marketplace remains browsable. As soon as
 * the backend returns services, the grid renders live API data instead.
 */
export function useServices() {
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchServices();
      setApiServices(data);
    } catch {
      setError("Couldn't load services. Showing preview catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = useCallback(() => {
    clearServicesCache();
    void load();
  }, [load]);

  /** Backend services mapped onto the app's card shape (empty while backend has none). */
  const liveServices = useMemo(() => apiServices.map(toServiceShape), [apiServices]);

  /** What the grid renders: live API data when available, seed catalog otherwise. */
  const services = liveServices.length > 0 ? liveServices : SERVICES;

  return {
    /** Cards shown in the grid (live API data, or the seed fallback). */
    services,
    /** Raw backend response — use for lookups/consumers that need API fields. */
    apiServices,
    /** True when the grid is showing live API data (vs the seed fallback). */
    live: liveServices.length > 0,
    loading,
    error,
    retry,
  };
}
