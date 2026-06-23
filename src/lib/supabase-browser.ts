import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
