import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Users, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpecialtyCard from "@/components/cards/SpecialtyCard";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { ModalitiesSection } from "@/components/home/ModalitiesSection";
import { VideosSection } from "@/components/home/VideosSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string;
  description: string | null;
  photo_url: string | null;
  specialties: { name: string } | null;
}

interface Specialty {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

const Home = () => {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [featuredSpecialties, setFeaturedSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [professionalsResponse, specialtiesResponse] = await Promise.all([
        supabase
          .from("professionals")
          .select(`
            *,
            specialties (name)
          `)
          .order("name")
          .limit(3),
        supabase
          .from("specialties")
          .select("*")
          .order("name")
          .limit(6)
      ]);

      if (professionalsResponse.data) {
        setFeaturedProfessionals(professionalsResponse.data);
      }

      if (specialtiesResponse.data) {
        setFeaturedSpecialties(specialtiesResponse.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Banner Slider Section */}
      <BannerSlider />

      {/* Modalities Section */}
      <ModalitiesSection />

      {/* Videos Section */}
      <VideosSection />

      {/* Search Section */}
      <section className="py-8 bg-white/95 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Encontre o profissional ideal para você
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Buscar por especialidade ou profissional..."
                    className="h-12 text-lg"
                  />
                </div>
                <Button size="lg" className="h-12 px-8">
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  Cardiologia
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  Odontologia
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  Psicologia
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                  Pediatria
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o Portal Saúde Limeira?
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
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-pulse">Carregando profissionais...</div>
              </div>
            ) : featuredProfessionals.length > 0 ? (
              featuredProfessionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhum profissional cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* News Carousel */}
      <NewsCarousel />

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