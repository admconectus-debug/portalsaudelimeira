import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";

interface News {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  author: string | null;
  published_at: string | null;
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNews();
    }
  }, [slug]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setNews(data);
    } catch (error) {
      console.error("Erro ao carregar notícia:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Carregando notícia...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
            <Link to="/noticias">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para notícias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/noticias">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para notícias
            </Button>
          </Link>

          <article className="bg-background rounded-lg shadow-lg overflow-hidden">
            {news.image_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {news.title}
              </h1>

              <div className="flex items-center gap-6 text-muted-foreground mb-6 pb-6 border-b">
                {news.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(news.published_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {news.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{news.author}</span>
                  </div>
                )}
              </div>

              {news.summary && (
                <p className="text-xl text-muted-foreground mb-6 italic">
                  {news.summary}
                </p>
              )}

              {news.content && (
                <div className="prose prose-lg max-w-none">
                  {news.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
