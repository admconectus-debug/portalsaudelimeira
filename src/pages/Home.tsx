import { Link } from "react-router-dom";
import { Search, Users, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpecialtyCard from "@/components/cards/SpecialtyCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { specialties, professionals } from "@/data/mockData";

const Home = () => {
  // Featured professionals (first 3)
  const featuredProfessionals = professionals.slice(0, 3);
  
  // Featured specialties (first 6)
  const featuredSpecialties = specialties.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre os Melhores
              <span className="block">Profissionais de Saúde</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Conectamos você com médicos, dentistas, psicólogos e outros especialistas 
              qualificados na sua região
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="flex-1">
                  <Input 
                    placeholder="Buscar por especialidade ou profissional..."
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/70"
                  />
                </div>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/profissionais">
                  <Users className="h-5 w-5 mr-2" />
                  Ver Todos os Profissionais
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/especialidades">
                  <Heart className="h-5 w-5 mr-2" />
                  Explorar Especialidades
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o Saúde Connect?
            </h2>
            <p className="text-lg text-muted-foreground">
              Facilitamos o acesso a profissionais de saúde qualificados e confiáveis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Profissionais Verificados</h3>
                <p className="text-muted-foreground">
                  Todos os profissionais são verificados e possuem registro nos órgãos competentes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-secondary mx-auto mb-6">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Busca Inteligente</h3>
                <p className="text-muted-foreground">
                  Encontre o profissional ideal por especialidade, localização ou disponibilidade
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Contato Direto</h3>
                <p className="text-muted-foreground">
                  Entre em contato diretamente com os profissionais via WhatsApp ou telefone
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Specialties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Principais Especialidades
              </h2>
              <p className="text-lg text-muted-foreground">
                Encontre profissionais nas áreas mais procuradas
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/especialidades">Ver Todas</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpecialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Profissionais em Destaque
              </h2>
              <p className="text-lg text-muted-foreground">
                Conheça alguns dos nossos profissionais mais bem avaliados
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/profissionais">Ver Todos</Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para encontrar seu profissional ideal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece sua busca agora e encontre o cuidado que você merece
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/profissionais">
                Explorar Profissionais
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contato">
                Fale Conosco
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;