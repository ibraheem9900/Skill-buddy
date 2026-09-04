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