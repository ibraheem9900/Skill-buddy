import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Smartphone, Apple, MessageCircle, Shield, MapPin } from "lucide-react";

export function DownloadAppModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-border overflow-y-auto max-h-[90vh]">
        <div className="relative gradient-hero p-6 pb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary shadow-elegant">
            <Smartphone className="h-7 w-7 text-primary-foreground" />
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-center text-2xl font-extrabold">Get the SkillBuddy App</DialogTitle>
            <DialogDescription className="text-center text-base">
              Book services with real-time tracking, in-app chat, and secure payments.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-4 p-6 pt-4">
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <Feature icon={<MapPin className="h-4 w-4" />} label="Live tracking" />
            <Feature icon={<MessageCircle className="h-4 w-4" />} label="In-app chat" />
            <Feature icon={<Shield className="h-4 w-4" />} label="Secure pay" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StoreButton icon={<Apple className="h-5 w-5" />} small="Download on the" big="App Store" />
            <StoreButton icon={<PlayIcon />} small="GET IT ON" big="Google Play" />
          </div>
          <div className="relative flex items-center gap-2 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button asChild variant="outline" className="w-full h-11">
            <Link to="/auth/signup" onClick={() => onOpenChange(false)}>Continue on Web — Sign Up</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-surface p-3">
      <div className="text-primary">{icon}</div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function StoreButton({ icon, small, big }: { icon: React.ReactNode; small: string; big: string }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-3 py-3 text-background transition hover:opacity-90">
      {icon}
      <div className="text-left leading-tight">
        <div className="text-[9px] uppercase tracking-wide opacity-80">{small}</div>
        <div className="text-sm font-semibold">{big}</div>
      </div>
    </button>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M3 2.5v19l16-9.5L3 2.5z"/></svg>
  );
}
