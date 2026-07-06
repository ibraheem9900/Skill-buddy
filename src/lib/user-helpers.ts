/**
 * Pure helper functions for the FastAPIUser type.
 * Kept in a plain .ts module so they don't violate Vite Fast Refresh
 * (which requires .tsx files to export only React components).
 */
import type { FastAPIUser } from "@/context/AuthContext";

export function getFullName(user: FastAPIUser | null): string {
  if (!user) return "";
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.email || "";
}

export function isProfileComplete(user: FastAPIUser | null): boolean {
  if (!user) return false;
  return Boolean(user.role && user.city && user.street_address);
}
