import { Link } from "@tanstack/react-router";
import { Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Service } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link
        to="/services/$id"
        params={{ id: service.slug }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:shadow-elegant"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />
          <Badge className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur" variant="secondary">
            {service.category}
          </Badge>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-elegant">
              View details <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{service.title}</h3>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium">{service.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src={service.provider.avatar} alt="" className="h-6 w-6 rounded-full" />
            <span className="line-clamp-1 text-xs text-muted-foreground">{service.provider.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">({service.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
            <div>
              <div className="text-xs text-muted-foreground">Starting from</div>
              <div className="font-mono text-lg font-bold text-primary">${service.price}</div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Post a Job →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
