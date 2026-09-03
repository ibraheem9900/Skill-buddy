import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";

export interface City {
  id: number;
  name: string;
}

// In-memory cache keyed by county_id — cities rarely change
const citiesCache = new Map<number, City[]>();

/**
 * Hook for fetching cities for a specific county.
 * Third level of the cascading location dropdown: Country → County → City.
 *
 * GET /api/v1/counties/{county_id}/cities — public, no auth needed.
 *
 * Behavior:
 * - City dropdown starts disabled/empty until a county is selected
 * - Changing the county refetches cities and resets the selection
 * - Results are cached per county_id to avoid redundant API calls
 */
export function useCities(countyId: number | null) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(0);

  useEffect(() => {
    if (!countyId) {
      setCities([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = citiesCache.get(countyId);
    if (cached) {
      setCities(cached);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchId = ++abortRef.current;
    setLoading(true);
    setError(null);

    apiClient
      .get<City[]>(`/api/v1/counties/${countyId}/cities`)
      .then((data) => {
        if (fetchId !== abortRef.current) return;
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        citiesCache.set(countyId, sorted);
        setCities(sorted);
        setLoading(false);
      })
      .catch((err) => {
        if (fetchId !== abortRef.current) return;
        console.error("Failed to fetch cities:", err);
        setCities([]);
        setLoading(false);
        setError("Couldn't load cities. Please try again.");
      });
  }, [countyId]);

  return { cities, loading, error };
}

/**
 * Fetch cities for a county without using the hook (for non-React contexts).
 * Checks cache first, then calls the API.
 */
export async function fetchCitiesByCountyId(countyId: number): Promise<City[]> {
  const cached = citiesCache.get(countyId);
  if (cached) return cached;

  try {
    const data = await apiClient.get<City[]>(
      `/api/v1/counties/${countyId}/cities`
    );
    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
    citiesCache.set(countyId, sorted);
    return sorted;
  } catch {
    return [];
  }
}

/**
 * Find a city by ID from any cached city list (client-side only).
 * Searches across all cached county city lists.
 */
export function findCityById(cityId: number): City | undefined {
  for (const cities of citiesCache.values()) {
    const found = cities.find((c) => c.id === cityId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Fetch a single city by ID.
 * Checks all cached city lists first; only calls the API if not found.
 *
 * GET /api/v1/cities/{city_id} — public, no auth needed.
 */
export async function fetchCityById(cityId: number): Promise<City | null> {
  const cached = findCityById(cityId);
  if (cached) return cached;

  if (citiesCache.size > 0) return null;

  try {
    const city = await apiClient.get<City>(`/api/v1/cities/${cityId}`);
    return city ?? null;
  } catch {
    return null;
  }
}
