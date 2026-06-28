import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { CATEGORIES_FULL } from "@/lib/categories";

interface CategoriesSliderProps {
  /** When provided, one item will render as the active (selected) card */
  activeSlug?: string;
  /** Called with the category slug when a card is clicked */
  onSelect?: (slug: string) => void;
}

export function CategoriesSlider({ activeSlug, onSelect }: CategoriesSliderProps = {}) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false, slidesToScroll: 1 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!embla) return;
    const update = () => {
      setCanPrev(embla.canScrollPrev());
      setCanNext(embla.canScrollNext());
      setSelectedSnap(embla.selectedScrollSnap());
    };
    setSnaps(embla.scrollSnapList());
    update();
    embla.on("select", update);
    embla.on("reInit", () => { setSnaps(embla.scrollSnapList()); update(); });
    const t = setTimeout(() => {
      if (embla.canScrollNext()) {
        embla.scrollTo(1, false);
        setTimeout(() => embla.scrollTo(0, false), 450);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div className="relative px-8 sm:px-10">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {CATEGORIES_FULL.map((c) => (
            <div
              key={c.slug}
              className="shrink-0 grow-0 basis-1/2 px-2 sm:basis-1/3 md:basis-1/5 lg:basis-1/7 xl:basis-[11.111%]"
              style={{ minWidth: 0 }}
            >
              <div className="h-full">
                <CategoryCard
                  category={c}
                  active={activeSlug === c.slug}
                  onSelect={onSelect}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        disabled={!canPrev}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-primary/10 disabled:opacity-40 sm:h-10 sm:w-10"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <ChevronLeft className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canNext}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-primary/10 disabled:opacity-40 sm:h-10 sm:w-10"
        style={{ minWidth: 40, minHeight: 40 }}
      >
        <ChevronRight className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
      </button>

      {snaps.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedSnap ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
