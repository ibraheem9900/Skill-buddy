import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LOCALES, useI18n } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const current = LOCALES.find((l) => l.code === locale)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 px-2" aria-label="Language">
          <span className="text-base leading-none">{current.flag}</span>
          <span className="text-xs font-semibold uppercase">{current.code}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={`gap-2 ${l.code === locale ? "bg-accent text-accent-foreground" : ""}`}
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1 text-sm">{l.name}</span>
            <span className="text-xs uppercase text-muted-foreground">{l.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
