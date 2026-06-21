import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Sign Up — SkillBuddy" }, { name: "description", content: "Create your SkillBuddy account in seconds." }] }),
  component: Signup,
});

function Signup() {
  const [show, setShow] = useState(false);
  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight">Join 3.4M+ people who get things done with SkillBuddy.</h1>
          <p className="mt-4 text-muted-foreground">Create an account to save favorites, message pros, and book in one tap.</p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>✓ Free to join — only pay for services you book.</li>
            <li>✓ Hand-vetted pros across 55+ services.</li>
            <li>✓ 24/7 support and a happiness guarantee.</li>
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-elegant">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h2 className="text-2xl font-extrabold">Create your account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Already a member? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link></p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.info("Auth coming soon — enable Lovable Cloud to wire this up."); }}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Jane Cooper" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@email.com" className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <div className="relative mt-1.5">
                <Input id="pw" type={show ? "text" : "password"} required placeholder="Min. 8 characters" className="h-11 pr-10" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox required className="mt-0.5" />
              <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> & <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</span>
            </label>
            <Button type="submit" className="h-11 w-full shadow-elegant">Create account</Button>
          </form>
          <div className="my-5 flex items-center gap-2 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or continue with<div className="h-px flex-1 bg-border" /></div>
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
