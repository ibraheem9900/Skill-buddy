import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ClientDashboard {
  user_id: number;
  total_bookings: number;
  total_completed_jobs: number;
  total_active_jobs: number;
  total_amount_spent: string;
}

export function useClientDashboard(enabled = true) {
  const [dashboard, setDashboard] = useState<ClientDashboard | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setDashboard(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<ClientDashboard>(
        "/api/v1/clients/dashboard",
      );
      setDashboard(data);
    } catch {
      setError("Couldn't load dashboard stats. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const retry = useCallback(() => {
    load();
  }, [load]);

  return { dashboard, loading, error, retry };
}
