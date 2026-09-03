/**
 * Services API module — GET /api/v1/services (public, no auth required).
 *
 * The full services catalog is returned in one call with no pagination or
 * filtering, so it is fetched ONCE per session and cached in memory. Screens
 * that need service data reuse the cached list instead of re-fetching.
 *
 * Single-service lookups resolve client-side from this cached array — the
 * backend has no dedicated "Get Service by ID" endpoint yet.
 *
 * Prices arrive as backend Numeric strings (e.g. "20.00"). They must be parsed
 * and formatted before display — never dump the raw strings into the UI.
 */

import type { Service } from "@/lib/data";
import { apiClient } from "@/lib/api-client";

/** Exact shape returned by GET /api/v1/services. */
export interface ApiService {
  id: number;
  category_id: number;
  category_name: string;
  title: string;
  description: string;
  price_from: string | null;
  price_to: string | null;
  price_range: string | null;
  thumbnail_url: string | null;
}

/** One media item from GET /api/v1/services/{id} (media array or /media list). */
export interface ServiceMedia {
  id: number;
  media_type: string;
  media_url: string | null;
  position: number;
  is_thumbnail: boolean;
}

/** One inclusion option from GET /api/v1/services/{id} (inclusion_options). */
export interface ServiceInclusionOption {
  id: number;
  name: string;
}

/** Full detail returned by GET /api/v1/services/{service_id}. */
export interface ServiceDetail {
  id: number;
  category_id: number;
  category_name: string | null;
  title: string;
  description: string | null;
  price_from: string | null;
  price_to: string | null;
  price_range: string | null;
  what_to_expect: string | null;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  media: ServiceMedia[];
  inclusion_options: ServiceInclusionOption[];
}

/** Derived slug (mirrors use-categories slugify so filters stay consistent). */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Session-wide in-memory cache (single fetch, shared by all consumers) ────
let cachedServices: ApiService[] | null = null;
let fetchPromise: Promise<ApiService[]> | null = null;

async function fetchServicesOnce(): Promise<ApiService[]> {
  if (cachedServices) return cachedServices;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<ApiService[]>("/api/v1/services")
    .then((data) => {
      cachedServices = Array.isArray(data) ? data : [];
      return cachedServices;
    })
    .catch((err) => {
      // Reset so the next call can retry
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

/** Fetch (or return the cached) services catalog. */
export async function fetchServices(): Promise<ApiService[]> {
  return fetchServicesOnce();
}

/** Force a refetch on next call (e.g. after a manual refresh action). */
export function clearServicesCache(): void {
  cachedServices = null;
  fetchPromise = null;
}

/**
 * Resolve a single service by ID from the cached catalog (client-side).
 * Returns null if the catalog hasn't been fetched yet or the ID is unknown.
 * Only for SUMMARY fields — full detail needs fetchServiceDetail.
 */
export async function fetchServiceById(id: number): Promise<ApiService | null> {
  if (cachedServices === null) return null; // catalog not loaded — no single endpoint exists
  return cachedServices.find((s) => s.id === id) ?? null;
}

// ─── Single-service detail (GET /api/v1/services/{service_id}) ────────────────

/** Per-session cache so revisiting a service doesn't re-fetch its detail. */
const detailCache = new Map<number, ServiceDetail>();

/**
 * Fetch the FULL detail for one service. Only used on detail views that need
 * fields the cached list lacks (what_to_expect, status, media, inclusions).
 * Returns null on 404 / 422 / network failure — callers show a fallback.
 */
export async function fetchServiceDetail(serviceId: number): Promise<ServiceDetail | null> {
  const cached = detailCache.get(serviceId);
  if (cached) return cached;
  try {
    const detail = await apiClient.get<ServiceDetail>(`/api/v1/services/${serviceId}`);
    if (detail && typeof detail === "object" && typeof (detail as { id?: unknown }).id === "number") {
      detailCache.set(serviceId, detail);
      return detail;
    }
    return null;
  } catch {
    return null;
  }
}

/** Force detail refetch on next call (e.g. after a manual refresh). */
export function clearServiceDetailCache(): void {
  detailCache.clear();
}

/**
 * Order media by position, keeping the thumbnail-flagged item first
 * (it acts as the hero/cover image when present).
 */
export function sortServiceMedia(items: ServiceMedia[]): ServiceMedia[] {
  return [...items].sort(
    (a, b) =>
      Number(b.is_thumbnail) - Number(a.is_thumbnail) ||
      a.position - b.position,
  );
}

/**
 * Image URLs for a service detail: image-type media in display order
 * (hero first). Empty when the service has no image media.
 */
export function serviceDetailImages(detail: ServiceDetail): string[] {
  return sortServiceMedia(detail.media ?? [])
    .filter((m) => m.media_type === "image" && !!m.media_url)
    .map((m) => m.media_url as string);
}

// ─── Service media list (GET /api/v1/services/{service_id}/media) ─────────────

/** Per-session cache so revisiting a service doesn't re-fetch its media. */
const mediaCache = new Map<number, ServiceMedia[]>();

/**
 * Fetch the dedicated media list for a service. Only called on detail views
 * when the embedded "media" array from GET /services/{id} comes back empty
 * (that field defaults to [] server-side) — so media is never fetched twice
 * for the same service load. Returns null on 404/422/network failure.
 */
export async function fetchServiceMedia(serviceId: number): Promise<ServiceMedia[] | null> {
  const cached = mediaCache.get(serviceId);
  if (cached) return cached;
  try {
    const data = await apiClient.get<ServiceMedia[]>(
      `/api/v1/services/${serviceId}/media`,
    );
    const list = Array.isArray(data) ? data : null;
    if (list) mediaCache.set(serviceId, list);
    return list;
  } catch {
    return null;
  }
}

/** Force media refetch on next call (e.g. after a manual refresh). */
export function clearServiceMediaCache(): void {
  mediaCache.clear();
}

// ─── Service inclusion options (GET /api/v1/services/{id}/inclusion-options) ──

/** Per-session cache so revisiting a service doesn't re-fetch its inclusions. */
const inclusionCache = new Map<number, ServiceInclusionOption[]>();

/**
 * Fetch the dedicated inclusion-options list for a service. Only called on
 * detail views when the embedded "inclusion_options" array from
 * GET /services/{id} comes back empty (that field defaults to [] server-side)
 * — never fetched twice for the same service load. Returns null on
 * 404/422/network failure (callers hide the section rather than break).
 */
export async function fetchServiceInclusionOptions(
  serviceId: number,
): Promise<ServiceInclusionOption[] | null> {
  const cached = inclusionCache.get(serviceId);
  if (cached) return cached;
  try {
    const data = await apiClient.get<ServiceInclusionOption[]>(
      `/api/v1/services/${serviceId}/inclusion-options`,
    );
    const list = Array.isArray(data) ? data : null;
    if (list) inclusionCache.set(serviceId, list);
    return list;
  } catch {
    return null;
  }
}

/** Force inclusion-options refetch on next call (e.g. after a manual refresh). */
export function clearServiceInclusionOptionsCache(): void {
  inclusionCache.clear();
}

// ─── Price helpers — backend sends Numeric values as strings ─────────────────

/** Parse a backend Numeric string to a finite number; null for empty/junk. */
export function parseDecimal(value: string | null | undefined): number | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

/** Format one EUR amount for display (whole euros, thousands separator). */
export function formatEuro(n: number): string {
  return `€${Math.round(n).toLocaleString("en-IE")}`;
}

/**
 * Format a service's price range for display, e.g. "€85 – €115".
 * Falls back gracefully when one or both bounds are missing.
 */
export function formatPriceRange(
  priceFrom: number | null | undefined,
  priceTo: number | null | undefined,
): string | null {
  const lo = priceFrom ?? null;
  const hi = priceTo ?? null;
  if (lo == null && hi == null) return null;
  if (lo != null && hi != null) {
    return lo === hi ? formatEuro(lo) : `${formatEuro(lo)} – ${formatEuro(hi)}`;
  }
  if (lo != null) return `from ${formatEuro(lo)}`;
  return `up to ${formatEuro(hi!)}`;
}

// ─── Mapping — backend catalog entry → the card shape used by the UI ─────────

const PLACEHOLDER_PROVIDER = {
  id: "",
  name: "",
  avatar: "",
  verified: false,
  location: "",
  bio: "",
};

/**
 * Map a backend service onto the app's Service display shape.
 * Fields the backend doesn't provide yet (rating, gallery, provider) get safe
 * neutral defaults — the catalog grid only reads image/title/category/price.
 */
export function toServiceShape(api: ApiService): Service {
  const lo = parseDecimal(api.price_from);
  const hi = parseDecimal(api.price_to);
  const price =
    lo != null && hi != null
      ? Math.round((lo + hi) / 2)
      : (lo ?? hi ?? 0);

  return {
    id: String(api.id),
    // No dedicated detail endpoint exists — numeric ID is the stable handle
    slug: String(api.id),
    titleKey: "", // empty → title fallback in the card's t() guard
    title: api.title,
    category: api.category_name,
    categorySlug: slugify(api.category_name) || "uncategorized",
    description: api.description ?? "",
    longDescription: api.description ?? "",
    price,
    rating: 0,
    reviewCount: 0,
    image: api.thumbnail_url ?? "",
    gallery: api.thumbnail_url ? [api.thumbnail_url] : [],
    provider: { ...PLACEHOLDER_PROVIDER, id: String(api.id) },
    // Live extras the card uses to render real labels/prices
    apiId: api.id,
    categoryLabel: api.category_name,
    priceFrom: lo,
    priceTo: hi,
  };
}
