import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SkillBuddy" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { accountStatus, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && accountStatus === "unauthenticated") {
      navigate({ to: "/auth/login" });
    }
  }, [accountStatus, loading, navigate]);

  if (loading || accountStatus === "unauthenticated") return null;

  return <Outlet />;
}
