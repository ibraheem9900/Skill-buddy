import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import type { Service } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addFavorite, loading: favLoading } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user) {
        navigate({ to: "/auth/login" });
        return;
      }
      if (isFavorited || favLoading) return;
      try {
        // service.id is a string like "s1" — extract the numeric part for the API
        const numericId = parseInt(service.id.replace("s", ""), 10);
        await addFavorite(numericId);
        setIsFavorited(true);
        toast.success("Added to favorites!");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Couldn't add to favorites.";
        toast.error(msg);
      }
    },
    [user, isFavorited, favLoading, service.id, addFavorite, navigate]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group h-full"
    >
      <Link
        to="/services/$id"
        params={{ id: service.slug }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-elegant hover:-translate-y-1"
        style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
      >
        <div className="relative overflow-hidden bg-muted" style={{ height: 200, flexShrink: 0 }}>
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
          <Badge className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur" variant="secondary">
            {t("cat." + service.categorySlug.replace(/-/g, "_"))}
          </Badge>
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background disabled:opacity-50"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition ${isFavorited ? "fill-red-500 text-red-500" : "text-foreground/70"}`}
            />
          </button>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-elegant">
              {t("common.viewDetails")} <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{t(service.titleKey) !== service.titleKey ? t(service.titleKey) : service.title}</h3>
          </div>
          <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
            <div>
              <div className="text-xs text-muted-foreground">{t("common.from")}</div>
              <div className="font-mono text-lg font-bold text-primary">~€{Math.round(service.price * 0.85 / 5) * 5} – €{Math.round(service.price * 1.15 / 5) * 5}</div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t("common.postJob")} →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
