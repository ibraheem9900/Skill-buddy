import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";

export interface County {
  id: number;
  name: string;
}

// In-memory cache keyed by country_id — counties rarely change
const countiesCache = new Map<number, County[]>();

/**
 * Hook for fetching counties/regions for a specific country.
 * This is a dependent dropdown — counties only load after a country is selected.
 *
 * GET /api/v1/countries/{country_id}/counties — public, no auth needed.
 *
 * Behavior:
 * - County dropdown starts disabled/empty until a country is selected
 * - Changing the country refetches counties and resets the selection
 * - Results are cached per country_id to avoid redundant API calls
 */
export function useCounties(countryId: number | null) {
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(0);

  useEffect(() => {
    // No country selected — clear counties
    if (!countryId) {
      setCounties([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    const cached = countiesCache.get(countryId);
    if (cached) {
      setCounties(cached);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch from API
    const fetchId = ++abortRef.current;
    setLoading(true);
    setError(null);

    apiClient
      .get<County[]>(`/api/v1/countries/${countryId}/counties`)
      .then((data) => {
        if (fetchId !== abortRef.current) return; // Stale request
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        countiesCache.set(countryId, sorted);
        setCounties(sorted);
        setLoading(false);
      })
      .catch((err) => {
        if (fetchId !== abortRef.current) return;
        console.error("Failed to fetch counties:", err);
        setCounties([]);
        setLoading(false);
        setError("Couldn't load regions. Please try again.");
      });
  }, [countryId]);

  return { counties, loading, error };
}

/**
 * Fetch counties for a country without using the hook (for non-React contexts).
 * Checks cache first, then calls the API.
 */
export async function fetchCountiesByCountryId(
  countryId: number
): Promise<County[]> {
  const cached = countiesCache.get(countryId);
  if (cached) return cached;

  try {
    const data = await apiClient.get<County[]>(
      `/api/v1/countries/${countryId}/counties`
    );
    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
    countiesCache.set(countryId, sorted);
    return sorted;
  } catch {
    return [];
  }
}
