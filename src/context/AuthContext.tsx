import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { tokenStore } from "@/lib/auth-tokens";
import { apiClient, extractErrorMessage } from "@/lib/api-client";

// ─── FastAPI user shape ───────────────────────────────────────────────────────
export interface FastAPIUser {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string | null;
  phone_number?: string | null;
  /** "CLIENT" | "PROVIDER" — single role from login/signup */
  role?: "CLIENT" | "PROVIDER" | null;
  /** Array of roles from GET /api/v1/users/me (e.g. ["CLIENT", "PROVIDER"]) */
  roles?: string[];
  personal_code?: string | null;
  country?: string | null;
  county?: string | null;
  city?: string | null;
  postal_code?: string | null;
  street_address?: string | null;
  house_number?: string | null;
  is_verified: boolean;
  deactivated?: boolean;
  avatar_url?: string | null;
  /** Raw field from /api/v1/users/me — mapped to avatar_url internally */
  profile_picture_url?: string | null;
  created_at?: string;
}

// ─── Auth context types ───────────────────────────────────────────────────────
export type AccountStatus =
  | "unauthenticated"
  | "authenticated_unverified"
  | "authenticated_verified";

interface AuthContextValue {
  user: FastAPIUser | null;
  roles: string[];
  active_role: string | null;
  accountStatus: AccountStatus;
  loading: boolean;
  signIn: (
    user: FastAPIUser,
    accessToken: string,
    refreshToken: string,
    roles: string[],
    activeRole: string
  ) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserLocal: (updates: Partial<FastAPIUser>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  roles: [],
  active_role: null,
  accountStatus: "unauthenticated",
  loading: true,
  signIn: () => {},
  signOut: async () => {},
  refreshUser: async () => {},
  updateUserLocal: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FastAPIUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [active_role, setActiveRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const data = await apiClient.get<Record<string, unknown>>("/api/v1/users/me");
    // The response may be the user object directly or wrapped in { user: ... }
    const raw = ("user" in (data as object) ? (data as { user: Record<string, unknown> }).user : data) as Record<string, unknown>;
    const u: FastAPIUser = {
      id: raw.id as string | number,
      email: raw.email as string,
      first_name: raw.first_name as string,
      last_name: raw.last_name as string,
      username: (raw.username as string) ?? null,
      phone_number: (raw.phone_number as string) ?? null,
      personal_code: (raw.personal_code as string) ?? null,
      is_verified: Boolean(raw.is_verified),
      deactivated: Boolean(raw.deactivated),
      created_at: (raw.created_at as string) ?? undefined,
      // Map API fields to local fields
      avatar_url: (raw.profile_picture_url as string) ?? (raw.avatar_url as string) ?? null,
      profile_picture_url: (raw.profile_picture_url as string) ?? null,
      roles: Array.isArray(raw.roles) ? (raw.roles as string[]) : undefined,
      role: raw.role as "CLIENT" | "PROVIDER" | null | undefined,
      // Address fields (may not be present on /me endpoint)
      country: (raw.country as string) ?? undefined,
      county: (raw.county as string) ?? undefined,
      city: (raw.city as string) ?? undefined,
      postal_code: (raw.postal_code as string) ?? undefined,
      street_address: (raw.street_address as string) ?? undefined,
      house_number: (raw.house_number as string) ?? undefined,
    };
    setUser(u);
    // Update roles from the API response
    if (u.roles && u.roles.length > 0) {
      setRoles(u.roles);
      // Set active role to the first role if not already set
      setActiveRole((prev) => prev ?? u.roles?.[0] ?? null);
    }
    // Note: this intentionally throws on failure so callers (e.g. auth.callback)
    // can react deterministically. The auth:expired event handler covers signout.
  }, []);

  const signIn = useCallback(
    (
      incomingUser: FastAPIUser,
      accessToken: string,
      refreshToken: string,
      incomingRoles: string[],
      activeRole: string
    ) => {
      tokenStore.setAccess(accessToken);
      tokenStore.setRefresh(refreshToken);
      setUser(incomingUser);
      setRoles(incomingRoles);
      setActiveRole(activeRole);
    },
    []
  );

  const signOut = useCallback(async () => {
    const accessToken = tokenStore.getAccess();
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) ?? "";
      await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
    } catch {
      // best-effort; clear regardless
    }
    tokenStore.clear();
    setUser(null);
    setRoles([]);
    setActiveRole(null);
  }, []);

  const updateUserLocal = useCallback((updates: Partial<FastAPIUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  // On mount: try to restore session from stored refresh token
  useEffect(() => {
    const restore = async () => {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${(import.meta.env.VITE_API_BASE_URL as string) ?? ""}/api/v1/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );
        if (!res.ok) throw new Error("refresh failed");
        const data = await res.json();
        tokenStore.setAccess(data.access_token);
        tokenStore.setRefresh(data.refresh_token);
        setRoles([]);
        setActiveRole(null);
        await refreshUser();
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };

    restore();

    // Listen for global session-expired events from the API client
    const onExpired = () => {
      setUser(null);
      setRoles([]);
      setActiveRole(null);
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [refreshUser]);

  const accountStatus: AccountStatus = !user
    ? "unauthenticated"
    : !user.is_verified
      ? "authenticated_unverified"
      : "authenticated_verified";

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        active_role,
        accountStatus,
        loading,
        signIn,
        signOut,
        refreshUser,
        updateUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
