import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ProviderStatusHistoryEntry {
  status: string;
  reason: string;
  is_current: boolean;
}

export function useProviderStatusHistory() {
  const [history, setHistory] = useState<ProviderStatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const load = useCallback(async () => {
    if (fetched) return; // Already fetched, don't refetch
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<ProviderStatusHistoryEntry[]>(
        "/api/v1/providers/status-history",
      );
      setHistory(Array.isArray(data) ? data : []);
      setFetched(true);
    } catch (err) {
      if (err?.status === 404 || err?.status === 403) {
        setHistory([]);
        setFetched(true);
      } else {
        setError("Couldn't load status history. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetched]);

  const retry = useCallback(() => {
    setFetched(false);
    load();
  }, [load]);

  return { history, loading, error, load, retry };
}
