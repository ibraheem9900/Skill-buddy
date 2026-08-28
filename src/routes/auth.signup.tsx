import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ENABLE_ROLE_SELECTION_ON_SIGNUP } from "@/lib/feature-flags";

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
    // FEATURE FLAG: Set ENABLE_ROLE_SELECTION_ON_SIGNUP = true in
    // src/lib/feature-flags.ts to re-enable the role-selection screen.
    if (ENABLE_ROLE_SELECTION_ON_SIGNUP) {
      navigate({ to: "/register" });
    } else {
      // Skip role selection — go directly to client signup form.
      navigate({ to: "/register/seeker" });
    }
  }, [navigate]);

  return null;
}
