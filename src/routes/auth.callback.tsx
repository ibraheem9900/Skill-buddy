import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let didNavigate = false;

    const goNext = async (userId: string) => {
      if (didNavigate) return;
      didNavigate = true;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("user_id", userId)
        .single();

      if (profile?.full_name) {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/register" });
      }
    };

    // Supabase fires SIGNED_IN for both PKCE (?code=) and implicit (#access_token=) flows
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
          subscription.unsubscribe();
          clearTimeout(timer);
          await goNext(session.user.id);
        }
      }
    );

    // Also manually handle PKCE code exchange if ?code= is in the URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).catch(() => {});
    }

    // Fallback: if already signed in (e.g. returning to the page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !didNavigate) {
        subscription.unsubscribe();
        clearTimeout(timer);
        goNext(session.user.id);
      }
    });

    // Timeout — something went wrong, send to login
    const timer = setTimeout(() => {
      if (!didNavigate) {
        subscription.unsubscribe();
        navigate({ to: "/auth/login" });
      }
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
