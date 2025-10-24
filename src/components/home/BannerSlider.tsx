import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import banner images
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import banner4 from "@/assets/banner-4.jpg";
import banner5 from "@/assets/banner-5.jpg";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

// Mock data for banners - later can be fetched from database
const banners: Banner[] = [
  {
    id: 1,
    title: "Encontre os Melhores",
    subtitle: "Profissionais de Saúde",
    description: "Conectamos você com médicos, dentistas, psicólogos e outros especialistas qualificados na sua região",
    imageUrl: banner1,
    ctaText: "Ver Profissionais",
    ctaLink: "/profissionais"
  },
  {
    id: 2,
    title: "Cuidados Médicos",
    subtitle: "de Qualidade",
    description: "Profissionais verificados e qualificados para cuidar da sua saúde e bem-estar",
    imageUrl: banner2,
    ctaText: "Agendar Consulta",
    ctaLink: "/profissionais"
  },
  {
    id: 3,
    title: "Especialidades",
    subtitle: "Completas",
    description: "Diversas especialidades médicas disponíveis para atender todas as suas necessidades",
    imageUrl: banner3,
    ctaText: "Ver Especialidades",
    ctaLink: "/especialidades"
  },
  {
    id: 4,
    title: "Atendimento",
    subtitle: "Personalizado",
    description: "Cada profissional oferece atendimento personalizado e focado nas suas necessidades específicas",
    imageUrl: banner4,
    ctaText: "Fale Conosco",
    ctaLink: "/contato"
  },
  {
    id: 5,
    title: "Sua Saúde",
    subtitle: "Nossa Prioridade",
    description: "Facilitamos o acesso a cuidados de saúde de qualidade na sua região",
    imageUrl: banner5,
    ctaText: "Começar Agora",
    ctaLink: "/profissionais"
  }
];

export function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
      {/* Banner Images */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {banners[currentSlide].title}
                <span className="block text-primary-glow">
                  {banners[currentSlide].subtitle}
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                {banners[currentSlide].description}
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                <Link to={banners[currentSlide].ctaLink}>
                  {banners[currentSlide].ctaText}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          className="h-full bg-primary transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / banners.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
}