import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface CategoryDetail {
  id: number;
  name: string;
  description: string;
  icon_url: string | null;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

/** In-memory cache keyed by category ID. */
const cache = new Map<number, CategoryDetail>();

export function useCategory(categoryId: number | null | undefined) {
  const [category, setCategory] = useState<CategoryDetail | null>(
    categoryId != null ? (cache.get(categoryId) ?? null) : null,
  );
  const [loading, setLoading] = useState(
    categoryId != null && !cache.has(categoryId),
  );
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const cached = cache.get(id);
      if (cached) {
        setCategory(cached);
        setLoading(false);
        return;
      }
      const data = await apiClient.get<CategoryDetail>(
        `/api/v1/categories/${id}`,
      );
      cache.set(id, data);
      setCategory(data);
    } catch (err) {
      console.error("Failed to fetch category:", err);
      setError("Category not found or unavailable.");
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId != null && categoryId > 0) {
      fetchCategory(categoryId);
    } else {
      setCategory(null);
      setLoading(false);
    }
  }, [categoryId, fetchCategory]);

  const retry = useCallback(() => {
    if (categoryId != null && categoryId > 0) {
      cache.delete(categoryId);
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  return { category, loading, error, retry };
}
