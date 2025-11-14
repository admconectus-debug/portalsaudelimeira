import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  slug: string;
  author: string | null;
  published_at: string | null;
}

export default function News() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Notícias
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fique por dentro das últimas novidades e atualizações
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-pulse">Carregando notícias...</div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma notícia disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} to={`/noticias/${item.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {item.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {item.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {item.published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(item.published_at).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        )}
                        {item.author && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{item.author}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="link" className="mt-4 p-0">
                        Ler mais →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
