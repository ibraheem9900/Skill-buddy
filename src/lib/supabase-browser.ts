import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isBrowser = typeof window !== "undefined";

if (isBrowser && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = isBrowser
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

export type UserRole = "client" | "provider";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  country: string | null;
  county: string | null;
  city: string | null;
  postal_code: string | null;
  street_address: string | null;
  house_number: string | null;
  verification_status: "pending" | "verified" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  primary_skill: string;
  secondary_skill: string | null;
  certification_url: string | null;
  residence_permit_front_url: string | null;
  residence_permit_back_url: string | null;
  face_verified: boolean;
  created_at: string;
  updated_at: string;
}
