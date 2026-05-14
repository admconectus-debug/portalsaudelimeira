import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, HeartPulse, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigation = [{
    name: "Início",
    href: "/"
  }, {
    name: "Clínicas",
    href: "/clinicas"
  }, {
    name: "Profissionais",
    href: "/profissionais"
  }, {
    name: "Especialidades",
    href: "/especialidades"
  }, {
    name: "Hospitais",
    href: "/hospitais"
  }, {
    name: "Notícias",
    href: "/noticias"
  }, {
    name: "Contato",
    href: "/contato"
  }, {
    name: "Admin",
    href: "/auth"
  }];
  const isActive = (href: string) => location.pathname === href;
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center min-w-0">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary whitespace-nowrap truncate">Portal Saúde Limeira</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map(item => <Link key={item.name} to={item.href} className={cn("text-sm font-medium transition-colors hover:text-primary", isActive(item.href) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground")}>
              {item.name}
            </Link>)}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="md:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-3">
            {navigation.map(item => <Link key={item.name} to={item.href} className={cn("block py-2 text-sm font-medium transition-colors", isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary")} onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>)}
          </nav>
        </div>}
    </header>;
};
export default Header;