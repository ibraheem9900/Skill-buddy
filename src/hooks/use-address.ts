import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface AddressRegion {
  id: number;
  name: string;
}

export interface AddressCountry extends AddressRegion {
  iso2?: string | null;
  iso3?: string | null;
  phone_code?: string | null;
}

export interface AddressResponse {
  id: number;
  user_id?: number | null;
  latitude?: string | null;
  longitude?: string | null;
  house_number?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  landmark?: string | null;
  formatted_address?: string | null;
  is_default: boolean;
  country?: AddressCountry | null;
  county?: AddressRegion | null;
  city?: AddressRegion | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Build a human-readable address display string from an address object.
 * Falls back to building from parts if formatted_address is empty.
 */
export function formatAddress(addr: AddressResponse): string {
  if (addr.formatted_address && addr.formatted_address.trim()) {
    return addr.formatted_address;
  }
  const parts = [
    [addr.house_number, addr.street_address].filter(Boolean).join(" "),
    addr.city?.name,
    addr.county?.name,
    addr.postal_code,
    addr.country?.name,
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * Hook for fetching the authenticated client's address.
 *
 * IMPORTANT — schema note: despite the endpoint being named "Get Addresses"
 * (plural), GET /api/v1/addresses returns a SINGLE AddressResponse object
 * (confirmed from the Swagger Schema tab — response is $ref AddressResponse,
 * not an array). The hook defensively handles both shapes in case the backend
 * ever changes to a list.
 *
 * Fetched via the centralized apiClient so the Authorization header and
 * 401 auto-refresh/retry logic are applied automatically.
 */
export function useAddress() {
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /api/v1/addresses — auth handled by apiClient
      const data = await apiClient.get<unknown>("/api/v1/addresses");
      let addr: AddressResponse | null = null;
      if (Array.isArray(data)) {
        addr = (data[0] as AddressResponse) ?? null;
      } else if (data && typeof data === "object") {
        addr = data as AddressResponse;
      }
      setAddress(addr);
    } catch (err) {
      // No saved address yet — not an error state
      const raw = err as { status?: number; detail?: unknown; message?: string } | null;
      const status = raw?.status ?? (err as { response?: { status?: number } } | null)?.response?.status;
      const detail = typeof raw?.detail === "string" ? raw.detail.toLowerCase() : "";
      const msg = typeof raw?.message === "string" ? raw.message.toLowerCase() : "";
      const isNotFound =
        status === 404 ||
        status === 403 ||
        detail.includes("not found") ||
        detail.includes("no address") ||
        msg.includes("not found") ||
        msg.includes("no address");
      if (isNotFound) {
        setAddress(null);
      } else {
        console.error("Failed to fetch address:", err);
        setError("Couldn't load your address. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { address, loading, error, refetch: fetchAddress };
}

/** Payload for create/update address endpoints — all fields optional per schema. */
export type AddressCreatePayload = {
  // Decimal values arrive as strings from the API but the schema accepts numbers too
  latitude?: number | string | null;
  longitude?: number | string | null;
  country_id?: number | null;
  county_id?: number | null;
  city_id?: number | null;
  house_number?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  landmark?: string | null;
  formatted_address?: string | null;
  is_default?: boolean;
};

/**
 * Create a new address for the authenticated client.
 *
 * POST /api/v1/addresses — auth handled by apiClient (Authorization header +
 * 401 auto-refresh/retry). On a 422 the API error (with detail[] loc/msg
 * pairs) is re-thrown so the caller can render field-level errors via
 * extractFieldErrors.
 */
export async function createAddress(
  payload: AddressCreatePayload
): Promise<AddressResponse> {
  return apiClient.post<AddressResponse>("/api/v1/addresses", payload);
}

/**
 * Fetch a single address by its ID — used to pre-fill the Edit Address form
 * with fresh data (never stale list data).
 *
 * GET /api/v1/addresses/{address_id} — auth handled by apiClient.
 * Returns null on 404/not-found so callers can show a "not found" message.
 */
export async function fetchAddressById(
  addressId: number
): Promise<AddressResponse | null> {
  try {
    const addr = await apiClient.get<AddressResponse>(
      `/api/v1/addresses/${addressId}`
    );
    return addr ?? null;
  } catch (err) {
    const raw = err as { status?: number; detail?: unknown; message?: string } | null;
    const status = raw?.status ?? (err as { response?: { status?: number } } | null)?.response?.status;
    const detail = typeof raw?.detail === "string" ? raw.detail.toLowerCase() : "";
    const msg = typeof raw?.message === "string" ? raw.message.toLowerCase() : "";
    const isNotFound =
      status === 404 ||
      status === 403 ||
      detail.includes("not found") ||
      msg.includes("not found");
    if (isNotFound) return null;
    throw err;
  }
}

/**
 * Update an existing address (PUT /api/v1/addresses/{address_id}).
 * Auth handled by apiClient. 422 detail[] is re-thrown so callers can
 * render field-level errors via extractFieldErrors.
 */
export async function updateAddress(
  addressId: number,
  payload: AddressCreatePayload
): Promise<AddressResponse> {
  return apiClient.put<AddressResponse>(`/api/v1/addresses/${addressId}`, payload);
}
