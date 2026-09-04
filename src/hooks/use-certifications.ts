import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface Certification {
  id: number;
  provider_id: number;
  certification_url: string;
  created_at: string;
  updated_at: string | null;
  created_by: number | null;
  updated_by: number | null;
}

export interface CertificationsResponse {
  certifications: Certification[];
  total: number;
}

export interface CertificationUploadResponse {
  message: string;
  certification: Certification;
}

/**
 * GET /api/v1/certifications/{certification_id} — fresh single-record fetch
 * through the centralized authenticated apiClient (Bearer token + 401 refresh).
 *
 * The list endpoint already carries the full CertificationResponse shape, so
 * this is for on-demand detail interactions (e.g. expanding a row to confirm
 * the current server state) — don't call it per-row to re-show list data.
 *
 * - 422 validation errors (detail array): logged to console, returns null so
 *   the UI degrades gracefully instead of crashing.
 * - 404/403/"not found": returns null (caller shows a graceful message).
 * - Network/timeout/5xx/unexpected: logged separately and rethrown so the
 *   caller can surface a distinct retry path.
 */
export async function fetchCertificationById(
  certificationId: number,
): Promise<Certification | null> {
  try {
    const cert = await apiClient.get<Certification>(
      `/api/v1/certifications/${certificationId}`,
    );
    return cert ?? null;
  } catch (err) {
    const raw = err as { status?: number; detail?: unknown; message?: string } | null;
    const status =
      raw?.status ??
      (err as { response?: { status?: number } } | null)?.response?.status;
    const detail = raw?.detail;

    // FastAPI 422 — detail is an array of {loc, msg, type, input, ctx}
    if (Array.isArray(detail)) {
      console.warn(
        `[certifications] fetchCertificationById(${certificationId}) validation error (422):`,
        detail,
      );
      return null;
    }

    const detailText = typeof detail === "string" ? detail.toLowerCase() : "";
    const msg = typeof raw?.message === "string" ? raw.message.toLowerCase() : "";
    const isNotFound =
      status === 404 ||
      status === 403 ||
      detailText.includes("not found") ||
      msg.includes("not found");
    if (isNotFound) return null;

    // Network / timeout / 5xx / unexpected — separate handling path
    console.warn(
      `[certifications] fetchCertificationById(${certificationId}) failed (network/server):`,
      err,
    );
    throw err;
  }
}

/**
 * POST /api/v1/certifications — multipart/form-data file upload.
 * Auth header + 401 refresh handled by apiClient; Content-Type is left to the
 * browser so the multipart boundary is set correctly (never set manually).
 */
export async function uploadCertification(file: File): Promise<Certification> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.upload<CertificationUploadResponse>(
    "/api/v1/certifications",
    formData,
  );
  const cert = res?.certification;
  if (!cert) throw new Error("Upload succeeded but returned no certification.");
  // Keep the session cache in sync so the new item survives re-mounts.
  cachedCertifications = {
    certifications: [cert, ...(cachedCertifications?.certifications ?? [])],
    total: (cachedCertifications?.total ?? 0) + 1,
  };
  return cert;
}

/** In-memory cache for the current provider's certifications. */
let cachedCertifications: CertificationsResponse | null = null;
let fetchPromise: Promise<CertificationsResponse | null> | null = null;

async function fetchCertificationsOnce(): Promise<CertificationsResponse | null> {
  if (cachedCertifications) return cachedCertifications;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient
    .get<CertificationsResponse>("/api/v1/certifications")
    .then((data) => {
      cachedCertifications = data;
      return cachedCertifications;
    })
    .catch((err) => {
      // 404/403 means the user has no provider profile yet — not an error
      if (err?.status === 404 || err?.status === 403) {
        cachedCertifications = null;
        return null;
      }
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useCertifications(enabled = true) {
  const [certifications, setCertifications] = useState<Certification[]>(
    enabled ? cachedCertifications?.certifications ?? [] : [],
  );
  const [total, setTotal] = useState(enabled ? cachedCertifications?.total ?? 0 : 0);
  const [loading, setLoading] = useState(enabled && !cachedCertifications);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setCertifications([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCertificationsOnce();
      setCertifications(data?.certifications ?? []);
      setTotal(data?.total ?? 0);
    } catch {
      setError("Couldn't load certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    cachedCertifications = null;
    fetchPromise = null;
    load();
  }, [load]);

  return { certifications, total, loading, error, retry };
}