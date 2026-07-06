import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SkillBuddy" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { accountStatus, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && accountStatus === "unauthenticated") {
      navigate({ to: "/auth/login" });
    }
  }, [accountStatus, loading, navigate]);

  if (loading || accountStatus === "unauthenticated") return null;

  // Unverified — show a blocking screen; user must click email link first
  if (accountStatus === "authenticated_unverified") {
    return (
      <SiteShell>
        <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-8">
          <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Mail className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account isn't verified yet.{" "}
              {user?.email && (
                <>Check <strong className="text-foreground">{user.email}</strong> for a verification link.</>
              )}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Already clicked the link?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => window.location.reload()}
              >
                Refresh the page
              </button>
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/verify-email">Verification help</Link>
            </Button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return <Outlet />;
}
