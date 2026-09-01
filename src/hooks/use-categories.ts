import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
  icon_url: string | null;
}

/** Derived slug from category name for internal routing/filtering. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── In-memory cache ─────────────────────────────────────────────────────────
let cachedCategories: ApiCategory[] | null = null;
let fetchPromise: Promise<ApiCategory[]> | null = null;

async function fetchCategoriesOnce(): Promise<ApiCategory[]> {
  if (cachedCategories) return cachedCategories;
  if (fetchPromise) return fetchPromise;

  fetchPromise = apiClient.get<ApiCategory[]>("/api/v1/categories")
    .then((data) => {
      cachedCategories = Array.isArray(data) ? data : [];
      return cachedCategories;
    })
    .catch((err) => {
      // Reset so next call can retry
      fetchPromise = null;
      throw err;
    });

  return fetchPromise;
}

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>(cachedCategories ?? []);
  const [loading, setLoading] = useState(!cachedCategories);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesOnce();
      setCategories(data);
    } catch {
      setError("Couldn't load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const retry = useCallback(() => {
    cachedCategories = null;
    fetchPromise = null;
    load();
  }, [load]);

  /** Categories mapped to the shape used by the existing CategoryCard. */
  const mapped = categories.map((c) => ({
    id: c.id,
    slug: slugify(c.name),
    name: c.name,
    description: c.description,
    icon_url: c.icon_url,
    /** Fallback lucide icon name (used when icon_url is missing) */
    icon: "Sparkles" as string,
  }));

  return { categories: mapped, raw: categories, loading, error, retry };
}
