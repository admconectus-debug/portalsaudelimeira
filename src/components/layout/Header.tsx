import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Home,
  UserRound,
  Building2,
  Stethoscope,
  Hospital,
  LayoutGrid,
  Newspaper,
  Mail,
  Info,
} from "lucide-react";
import { YogaIcon } from "@/components/icons/YogaIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Profissionais", href: "/profissionais", icon: UserRound },
  { name: "Clínicas", href: "/clinicas", icon: Building2 },
  { name: "Especialidades", href: "/especialidades", icon: Stethoscope },
  { name: "Hospitais", href: "/hospitais", icon: Hospital },
  { name: "Categorias", href: "/categorias", icon: LayoutGrid },
  { name: "Notícias", href: "/noticias", icon: Newspaper },
  { name: "Contato", href: "/contato", icon: Mail },
  { name: "Quem Somos", href: "/quem-somos", icon: Info },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background border-b border-border transition-shadow duration-200",
        scrolled ? "shadow-[0_4px_16px_-8px_rgba(0,0,0,0.15)]" : "shadow-none"
      )}
    >
      <div className="container relative flex items-center h-[72px] md:h-[76px] px-4 lg:px-6">
        {/* Left: Menu button */}
        <div className="flex items-center z-10">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-3 h-11 font-semibold text-foreground hover:bg-muted transition-colors"
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-5 w-5" />
                <span className="text-sm tracking-wide">MENU</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[340px] p-0 duration-[250ms]"
            >
              <SheetHeader className="px-6 py-5 border-b border-border">
                <SheetTitle className="flex items-center gap-2 text-primary">
                  <span className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground">
                    <HeartPulse className="h-5 w-5" />
                  </span>
                  <span className="text-base font-bold">Portal Saúde Limeira</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="py-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary border-l-4 border-primary pl-5"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center: Logo (absolutely centered) */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
          aria-label="Portal Saúde Limeira - Início"
        >
          <span className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground shrink-0 transition-transform group-hover:scale-105">
            <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="hidden md:inline text-lg lg:text-xl font-bold text-primary whitespace-nowrap">
            Portal Saúde Limeira
          </span>
        </Link>

        {/* Right: Contact + About */}
        <div className="flex items-center gap-1 md:gap-3 ml-auto z-10">
          <Button
            asChild
            variant="ghost"
            className="h-11 px-2 md:px-4 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors"
          >
            <Link to="/contato">Contato</Link>
          </Button>

          <Button
            asChild
            className="h-[42px] px-3 md:px-5 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all"
          >
            <Link to="/quem-somos">Quem Somos</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
