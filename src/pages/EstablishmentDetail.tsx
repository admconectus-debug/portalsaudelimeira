import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe, Clock, MessageCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { MODALITY_CONFIGS, ModalityConfig } from "./ModalityPage";

interface Establishment {
  id: string; category: string; name: string; slug: string;
  description: string | null; image_url: string | null;
  address: string | null; city: string; state: string | null;
  phone: string | null; whatsapp: string | null; email: string | null;
  website: string | null; schedule: string | null;
  is_24h: boolean; is_featured: boolean;
}

const EstablishmentDetail = ({ category }: { category: string }) => {
  const { slug } = useParams();
  const [item, setItem] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const config: ModalityConfig | undefined = MODALITY_CONFIGS[category];
  const Icon = config?.icon;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("establishments")
        .select("*")
        .eq("category", category)
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      setItem(data);
      if (data) {
        document.title = `${data.name} - ${config?.title}`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute("content", data.description?.slice(0, 155) || config?.metaDescription || "");
      }
      setLoading(false);
    };
    load();
  }, [category, slug]);

  if (!config) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Carregando...</div>
        ) : !item ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold mb-2">Não encontrado</h1>
            <Button asChild variant="outline" className="mt-4">
              <Link to={`/${category}`}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Link>
            </Button>
          </div>
        ) : (
          <>
            <section className="bg-gradient-primary text-white py-10">
              <div className="container px-4">
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 mb-4">
                  <Link to={`/${category}`}><ArrowLeft className="w-4 h-4 mr-2" />{config.title}</Link>
                </Button>
                <div className="flex items-center gap-3 mb-2">
                  {Icon && <Icon className="w-8 h-8" />}
                  <h1 className="text-3xl md:text-4xl font-bold">{item.name}</h1>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {item.is_featured && <Badge className="bg-white text-primary">Destaque</Badge>}
                  {item.is_24h && <Badge className="bg-destructive"><Clock className="w-3 h-3 mr-1" />24h</Badge>}
                </div>
              </div>
            </section>

            <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-lg overflow-hidden bg-gradient-subtle aspect-video">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : Icon && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-24 h-24 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                {item.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-3 text-primary">Sobre</h2>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-bold text-primary">Contato</h2>
                    {item.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-primary mt-0.5" />
                        <div className="text-muted-foreground">
                          {item.address}<br />
                          <span className="text-xs">{item.city}{item.state && ` - ${item.state}`}</span>
                        </div>
                      </div>
                    )}
                    {item.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <a href={`tel:${item.phone}`} className="text-muted-foreground hover:text-primary">{item.phone}</a>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <a href={`mailto:${item.email}`} className="text-muted-foreground hover:text-primary truncate">{item.email}</a>
                      </div>
                    )}
                    {item.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-primary" />
                        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary truncate">
                          {item.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    {item.schedule && (
                      <div className="flex items-start gap-3 text-sm">
                        <Clock className="w-4 h-4 text-primary mt-0.5" />
                        <span className="text-muted-foreground">{item.schedule}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  {item.whatsapp && (
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <a href={`https://wa.me/55${item.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />Conversar no WhatsApp
                      </a>
                    </Button>
                  )}
                  {item.address && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.address}, ${item.city}`)}`} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4 mr-2" />Ver no Mapa
                      </a>
                    </Button>
                  )}
                  {item.website && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={item.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />Visitar Site
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EstablishmentDetail;
