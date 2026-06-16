import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Search, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useTheme } from "@/components/theme-provider";
import { CATEGORIES } from "@/lib/data";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/explore", label: "Explore" },
  { to: "/become-a-provider", label: "Become a Pro" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center"><Logo /></Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((n) => (
              <NavigationMenuItem key={n.to}>
                {n.label === "Services" ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[560px] grid-cols-2 gap-1 p-3">
                        {CATEGORIES.map((c) => (
                          <NavigationMenuLink asChild key={c.slug}>
                            <Link
                              to="/services"
                              search={{ category: c.slug }}
                              className="rounded-lg p-3 hover:bg-accent"
                            >
                              <div className="text-sm font-semibold">{c.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{c.description}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link to={n.to} className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">
                      {n.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about" className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/contact" className="inline-flex items-center px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Language">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <div className="hidden md:flex items-center gap-2 pl-2">
            <Button asChild variant="ghost" size="sm"><Link to="/auth/login">Log in</Link></Button>
            <Button asChild size="sm" className="shadow-elegant"><Link to="/auth/signup">Sign Up</Link></Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-8 flex flex-col gap-1">
                {[...navLinks, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }].map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-lg px-3 py-3 text-base font-medium hover:bg-accent">
                    {n.label}
                  </Link>
                ))}
                <div className="mt-4 grid gap-2">
                  <Button asChild variant="outline"><Link to="/auth/login">Log in</Link></Button>
                  <Button asChild><Link to="/auth/signup">Sign Up</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
