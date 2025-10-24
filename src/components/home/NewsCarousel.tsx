import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const newsItems = [
  {
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop",
    title: "Nova Unidade de Atendimento Inaugurada",
    summary: "Expandimos nossa rede com mais uma clínica moderna e equipada para melhor atender você e sua família com excelência.",
  },
  {
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=450&fit=crop",
    title: "Telemedicina: O Futuro da Saúde Já Chegou",
    summary: "Consultas online com especialistas qualificados, no conforto da sua casa. Tecnologia e cuidado ao seu alcance.",
  },
  {
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=450&fit=crop",
    title: "Campanha de Vacinação em Todo o País",
    summary: "Participe da nossa campanha nacional de vacinação. Proteja sua saúde e de quem você ama com segurança e qualidade.",
  },
  {
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&h=450&fit=crop",
    title: "Tecnologia de Ponta em Diagnósticos",
    summary: "Investimos em equipamentos modernos para diagnósticos mais precisos e rápidos, garantindo o melhor tratamento para você.",
  },
];

export const NewsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1E3A8A]">
          Últimas Notícias
        </h2>

        <Carousel
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {newsItems.map((news, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 animate-fade-in">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1E3A8A] mb-3 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {news.summary}
                      </p>
                      <Button
                        className="rounded-full"
                        style={{ backgroundColor: '#3569B2' }}
                      >
                        Ler mais
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
          
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  current === index ? "bg-[#3569B2] w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};
