import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { tokenStore } from "@/lib/auth-tokens";
import { z } from "zod";

/**
 * OAuth callback handler for FastAPI-driven Google/Apple sign-in.
 *
 * ⚠️  FLAG FOR BACKEND TEAM: Confirm the exact redirect target and token delivery
 *     mechanism after the backend completes the OAuth dance.
 *     Assumption: backend redirects to {origin}/auth/callback with tokens as
 *     query params: ?access_token=...&refresh_token=...&token_type=bearer
 *     If tokens arrive differently (e.g. in the URL fragment or a POST), update this handler.
 */

const searchSchema = z.object({
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  token_type: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: searchSchema,
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const { signIn, refreshUser } = useAuth();
  const { access_token, refresh_token, error, error_description } = Route.useSearch();

  useEffect(() => {
    let cancelled = false;

    const handle = async () => {
      // Error from OAuth provider
      if (error) {
        console.error("OAuth error:", error, error_description);
        navigate({ to: "/auth/login" });
        return;
      }

      // Tokens present in query params (backend redirect)
      if (access_token && refresh_token) {
        // Immediately scrub tokens from the URL to avoid leaking via history/referrer
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        tokenStore.setAccess(access_token);
        tokenStore.setRefresh(refresh_token);

        try {
          await refreshUser();
        } catch {
          // refreshUser throws on API failure; send back to login
          tokenStore.clear();
          navigate({ to: "/auth/login" });
          return;
        }

        if (!cancelled) navigate({ to: "/dashboard" });
        return;
      }

      // No tokens — something unexpected; send back to login
      navigate({ to: "/auth/login" });
    };

    handle();

    return () => {
      cancelled = true;
    };
  }, [access_token, refresh_token, error, error_description, navigate, signIn, refreshUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
