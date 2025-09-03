import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
          <p className="text-muted-foreground mb-8">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/">
              <Home className="h-5 w-5 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link to="/profissionais">
              <Search className="h-5 w-5 mr-2" />
              Buscar Profissionais
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
