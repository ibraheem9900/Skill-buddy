import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Log in — SkillBuddy" }, { name: "description", content: "Sign in to your SkillBuddy account." }] }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="mb-6"><Logo /></div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <h2 className="text-2xl font-extrabold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">New here? <Link to="/auth/signup" className="text-primary hover:underline">Create an account</Link></p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.info("Auth coming soon — enable Lovable Cloud to wire this up."); }}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@email.com" className="mt-1.5 h-11" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pw">Password</Label>
                <Link to="/auth/login" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative mt-1.5">
                <Input id="pw" type={show ? "text" : "password"} required placeholder="Your password" className="h-11 pr-10" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-11 w-full shadow-elegant">Sign in</Button>
          </form>
          <div className="my-5 flex items-center gap-2 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-3 gap-2">
            {["Google", "Apple", "Facebook"].map((p) => (
              <Button key={p} variant="outline" className="h-11">{p}</Button>
            ))}
          </div>
        </div>
      </div>

      <JoinAsProButton />
    </SiteShell>
  );
}

function JoinAsProButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
      style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50 }}
    >
      <motion.a
        href="/auth/signup"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08, boxShadow: "0 8px 32px rgba(45,122,95,0.55)" }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#2D7A5F",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          borderRadius: 50,
          padding: "12px 22px",
          boxShadow: "0 4px 20px rgba(45,122,95,0.4)",
          textDecoration: "none",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        <Star className="h-4 w-4 fill-white" />
        Join as a Pro →
      </motion.a>
    </motion.div>
  );
}
