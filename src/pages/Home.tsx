import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { BannerSlider } from "@/components/home/BannerSlider";
import { ModalitiesSection } from "@/components/home/ModalitiesSection";
import { VideosSection } from "@/components/home/VideosSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { NewsCarousel } from "@/components/home/NewsCarousel";
import { FeaturedClinicsSection } from "@/components/home/FeaturedClinicsSection";
import { ScheduleSection } from "@/components/home/ScheduleSection";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const Home = () => {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from("professionals")
        .select(`
          *,
          specialties (name)
        `)
        .order("name")
        .limit(6);

      if (data) {
        setFeaturedProfessionals(data);
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

      {/* News Section */}
      <NewsCarousel />

      {/* Schedule CTA Section */}
      <ScheduleSection />

      {/* Featured Professionals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-2 uppercase tracking-wide text-primary">
            Profissionais em Destaque
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Novos perfis no Portal Saúde Limeira
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Carregando profissionais...</div>
            </div>
          ) : featuredProfessionals.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {featuredProfessionals.map((professional) => (
                  <CarouselItem key={professional.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <ProfessionalCard professional={professional} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum profissional cadastrado ainda.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="link" className="text-primary">
              <Link to="/profissionais">
                Ver todos os profissionais
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Clinics Section */}
      <FeaturedClinicsSection />

      {/* Partners Section */}
      <PartnersSection />
      
      <Footer />
    </div>
  );
};

export default Home;