import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — SkillBuddy" },
      { name: "description", content: "Create your SkillBuddy account in seconds." },
    ],
  }),
  component: SignupRedirect,
});

function SignupRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/register" });
  }, [navigate]);

  return null;
}
