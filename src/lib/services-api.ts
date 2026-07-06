/**
 * Services API module — structured for easy swap to real FastAPI endpoints.
 *
 * ⚠️  The backend team is still building the Services endpoints.
 *     Watch https://api.skillbuddy.zeyshan.com/docs for new routes.
 *     When ready, replace the mock implementations below with apiClient calls.
 *
 * Pattern:
 *   import { servicesApi } from "@/lib/services-api";
 *   const services = await servicesApi.list();
 */

import { MOCK_SERVICES } from "@/lib/data";

export interface Service {
  id: string;
  title: string;
  category: string;
  provider_name?: string;
  price?: number;
  rating?: number;
  image_url?: string;
  description?: string;
}

export const servicesApi = {
  /** List all services. Replace with: apiClient.get<Service[]>("/api/v1/services") */
  list: async (): Promise<Service[]> => {
    return MOCK_SERVICES as Service[];
  },

  /** Get a single service by ID. Replace with: apiClient.get<Service>(`/api/v1/services/${id}`) */
  get: async (id: string): Promise<Service | null> => {
    const all = MOCK_SERVICES as Service[];
    return all.find((s) => s.id === id) ?? null;
  },
};
