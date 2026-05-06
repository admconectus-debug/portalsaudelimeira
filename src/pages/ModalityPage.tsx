import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin, Phone, Mail, Globe, Clock, Search,
  Shield, Pill, FlaskConical, Sparkles, PawPrint, Activity, Building2,
  ExternalLink, MessageCircle,
} from "lucide-react";

export interface ModalityConfig {
  category: string;
  title: string;
  subtitle: string;
  metaDescription: string;
  icon: React.ComponentType<any>;
  emptyEmoji: string;
}

interface Establishment {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  schedule: string | null;
  is_24h: boolean;
  is_featured: boolean;
}

const ModalityPage = ({ config }: { config: ModalityConfig }) => {
  const [items, setItems] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const Icon = config.icon;

  useEffect(() => {
    document.title = `${config.title} - Portal Saúde Limeira`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", config.metaDescription);
    fetch();
  }, [config.category]);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("establishments")
      .select("*")
      .eq("category", config.category)
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("name");
    setItems(data || []);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const t = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(t) ||
        (i.description || "").toLowerCase().includes(t) ||
        (i.address || "").toLowerCase().includes(t)
    );
  }, [items, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-primary text-white py-12 md:py-16">
          <div className="container px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4">
              <Icon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{config.title}</h1>
            <p className="text-white/90 max-w-2xl mx-auto">{config.subtitle}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10">
          <div className="bg-card rounded-lg shadow-soft p-4 md:p-6 mb-8">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, descrição ou endereço..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">{config.emptyEmoji}</div>
              <h3 className="text-xl font-semibold mb-1">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar sua busca.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">
                {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 bg-gradient-subtle">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {item.is_featured && (
                          <Badge className="bg-primary text-primary-foreground">Destaque</Badge>
                        )}
                        {item.is_24h && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            24h
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1">
                      <h3 className="text-lg font-bold text-primary mb-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="space-y-2 text-sm">
                        {item.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {item.address}
                              <br />
                              <span className="text-xs">
                                {item.city}{item.state && ` - ${item.state}`}
                              </span>
                            </span>
                          </div>
                        )}
                        {item.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                            <a href={`tel:${item.phone}`} className="text-muted-foreground hover:text-primary">
                              {item.phone}
                            </a>
                          </div>
                        )}
                        {item.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{item.email}</span>
                          </div>
                        )}
                        {item.schedule && (
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-xs">{item.schedule}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex gap-2">
                      {item.whatsapp && (
                        <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                          <a
                            href={`https://wa.me/55${item.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                      {item.website && (
                        <Button asChild variant="outline" size="icon">
                          <a href={item.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {item.address && (
                        <Button asChild variant="outline" size="icon">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${item.address}, ${item.city}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const MODALITY_CONFIGS: Record<string, ModalityConfig> = {
  "planos-medicos": {
    category: "planos-medicos",
    title: "Planos Médicos",
    subtitle: "Encontre o plano de saúde ideal para você e sua família.",
    metaDescription: "Planos médicos e operadoras de saúde em Limeira. Compare opções e encontre o ideal.",
    icon: Shield,
    emptyEmoji: "🛡️",
  },
  "servicos-24h": {
    category: "servicos-24h",
    title: "Serviços 24 Horas",
    subtitle: "Atendimento de urgência, farmácias e laboratórios abertos 24h.",
    metaDescription: "Serviços de saúde 24 horas em Limeira: pronto socorro, farmácias e laboratórios.",
    icon: Clock,
    emptyEmoji: "🕐",
  },
  "laboratorios": {
    category: "laboratorios",
    title: "Laboratórios",
    subtitle: "Análises clínicas e exames de imagem na sua região.",
    metaDescription: "Laboratórios de análises clínicas e exames de imagem em Limeira.",
    icon: FlaskConical,
    emptyEmoji: "🧪",
  },
  "farmacias": {
    category: "farmacias",
    title: "Farmácias",
    subtitle: "Drogarias, farmácias de manipulação e homeopatia.",
    metaDescription: "Farmácias e drogarias em Limeira: medicamentos, manipulação e homeopatia.",
    icon: Pill,
    emptyEmoji: "💊",
  },
  "saude-beleza": {
    category: "saude-beleza",
    title: "Saúde & Beleza",
    subtitle: "Estética, nutrição, fisioterapia, pilates e bem-estar.",
    metaDescription: "Saúde e beleza em Limeira: estética, nutrição, fisioterapia e pilates.",
    icon: Sparkles,
    emptyEmoji: "✨",
  },
  "saude-pets": {
    category: "saude-pets",
    title: "Saúde Pets",
    subtitle: "Veterinários, pet shops e serviços para o seu melhor amigo.",
    metaDescription: "Veterinários, pet shops e banho e tosa em Limeira.",
    icon: PawPrint,
    emptyEmoji: "🐾",
  },
};

export default ModalityPage;
