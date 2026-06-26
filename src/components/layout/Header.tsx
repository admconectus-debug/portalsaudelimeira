import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, HeartPulse, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(`/profissionais${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };
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
    name: "Categorias",
    href: "/categorias"
  }, {
    name: "Hospitais",
    href: "/hospitais"
  }, {
    name: "Notícias",
    href: "/noticias"
  }, {
    name: "Contato",
    href: "/contato"
  }];
  const isActive = (href: string) => location.pathname === href;
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center gap-4 px-4 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
          <span className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground shrink-0">
            <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <span className="hidden sm:inline text-lg md:text-2xl font-bold text-primary whitespace-nowrap">Portal Saúde Limeira</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar profissionais, especialidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 ml-auto">
          {navigation.map(item => <Link key={item.name} to={item.href} className={cn("text-sm font-medium transition-colors hover:text-primary", isActive(item.href) ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground")}>
              {item.name}
            </Link>)}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="lg:hidden ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && <div className="lg:hidden border-t bg-background">
          <nav className="container px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="flex sm:hidden relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </form>
            {navigation.map(item => <Link key={item.name} to={item.href} className={cn("block py-2 text-sm font-medium transition-colors", isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary")} onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>)}
          </nav>
        </div>}
    </header>;
};
export default Header;