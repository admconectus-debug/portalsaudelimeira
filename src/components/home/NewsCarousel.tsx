import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  slug: string;
}

export const NewsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, summary, image_url, slug")
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Carregando notícias...</div>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Notícias
            </h2>
            <p className="text-muted-foreground text-sm">Fique por dentro das últimas novidades</p>
          </div>
          <Link to="/noticias">
            <Button variant="outline" size="sm">Ver todas</Button>
          </Link>
        </div>

        <Carousel
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {newsItems.map((news) => (
              <CarouselItem key={news.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2 animate-fade-in">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                    {news.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={news.image_url}
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1E3A8A] mb-3 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {news.summary}
                      </p>
                      <Link to={`/noticias/${news.slug}`}>
                        <Button
                          className="rounded-full"
                          style={{ backgroundColor: '#3569B2' }}
                        >
                          Ler mais
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {newsItems.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-8 bg-[#3569B2]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
