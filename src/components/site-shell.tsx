import type { ReactNode } from "react";
import { Footer } from "@/components/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
