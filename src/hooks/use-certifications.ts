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