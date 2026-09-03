import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code: string;
}

// In-memory cache — fetched once, reused across all components
let cachedCountries: Country[] | null = null;
let fetchPromise: Promise<Country[]> | null = null;

async function fetchCountries(): Promise<Country[]> {
  if (cachedCountries) return cachedCountries;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<Country[]>("/api/v1/countries/")
    .then((data) => {
      cachedCountries = data;
      return data;
    })
    .catch((err) => {
      console.error("Failed to fetch countries:", err);
      fetchPromise = null;
      return [] as Country[];
    });

  return fetchPromise;
}

/**
 * Hook for fetching and caching the list of countries.
 * Data is fetched once and cached in memory for the session.
 * Returns countries sorted alphabetically by name.
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>(cachedCountries ?? []);
  const [loading, setLoading] = useState(!cachedCountries);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCountries().then((data) => {
      if (!cancelled) {
        setCountries(data);
        setLoading(false);
        if (data.length === 0 && !cachedCountries) {
          setError("Couldn't load countries. Please try again.");
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Sort alphabetically by name
  const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));

  return { countries: sorted, loading, error };
}

/**
 * Find a country by ISO2 code (e.g. "EE" for Estonia).
 */
export function findCountryByIso2(
  countries: Country[],
  iso2: string
): Country | undefined {
  return countries.find((c) => c.iso2.toUpperCase() === iso2.toUpperCase());
}

/**
 * Find a country by phone code (e.g. "+372").
 */
export function findCountryByPhoneCode(
  countries: Country[],
  phoneCode: string
): Country | undefined {
  return countries.find((c) => c.phone_code === phoneCode);
}

/**
 * Find a country by numeric ID from the cached list (client-side only).
 * Returns undefined if the cache isn't loaded yet or ID isn't found.
 */
export function findCountryById(
  countries: Country[],
  id: number
): Country | undefined {
  return countries.find((c) => c.id === id);
}

/**
 * Fetch a single country by ID.
 * Checks the in-memory cache first; only calls the API if the cache
 * doesn't have the country (or hasn't been loaded yet).
 *
 * GET /api/v1/countries/{country_id} — public, no auth needed.
 */
export async function fetchCountryById(
  countryId: number
): Promise<Country | null> {
  // Prefer cached list if available
  if (cachedCountries) {
    const found = cachedCountries.find((c) => c.id === countryId);
    if (found) return found;
  }

  // If cache is loaded but country not found, don't waste an API call
  if (cachedCountries !== null) return null;

  // Cache not loaded yet — try the single-lookup endpoint
  try {
    const country = await apiClient.get<Country>(
      `/api/v1/countries/${countryId}`
    );
    return country ?? null;
  } catch {
    return null;
  }
}

/**
 * Get a flag emoji from ISO2 code.
 * Uses Unicode regional indicator symbols.
 */
export function getFlagEmoji(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "🏳️";
  const codePoints = iso2
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 - 65 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
