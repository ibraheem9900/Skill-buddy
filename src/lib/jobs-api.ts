/**
 * Jobs API module — structured for easy swap to real FastAPI endpoints.
 *
 * ⚠️  The backend team is still building the Jobs endpoints.
 *     Watch https://api.skillbuddy.zeyshan.com/docs for new routes.
 *     When ready, replace the mock implementations below with apiClient calls.
 *
 * Pattern:
 *   import { jobsApi } from "@/lib/jobs-api";
 *   const jobs = await jobsApi.list();
 */

import { JOBS } from "@/lib/jobs";

export interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  category?: string;
  urgency?: string;
  salary_range?: string;
  posted_at?: string;
  description?: string;
}

export const jobsApi = {
  /** List all jobs. Replace with: apiClient.get<Job[]>("/api/v1/jobs") */
  list: async (): Promise<Job[]> => {
    return JOBS as Job[];
  },

  /** Get a single job by ID. Replace with: apiClient.get<Job>(`/api/v1/jobs/${id}`) */
  get: async (id: string): Promise<Job | null> => {
    const all = JOBS as Job[];
    return all.find((j) => j.id === id) ?? null;
  },
};
