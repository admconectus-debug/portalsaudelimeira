import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Award, Clock, Phone, Mail, Globe, MessageCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BannerCarousel from "@/components/shared/BannerCarousel";
import MapEmbed from "@/components/shared/MapEmbed";
import ShareButton from "@/components/shared/ShareButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
        if (meta) meta.setAttribute("content", (data.description || config?.metaDescription || "").slice(0, 155));
      }
      setLoading(false);
    };
    load();
  }, [category, slug]);

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground animate-pulse">
          Carregando perfil...
        </div>
      </div>
    );
  }

  if (!item || !config) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Estabelecimento não encontrado</h1>
          <Button asChild>
            <Link to={`/${category}`}>Voltar para a lista</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fullAddress = item.address ? `${item.address}, ${item.city}${item.state ? ` - ${item.state}` : ""}` : `${item.city}, Brasil`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner */}
      {item.image_url && (
        <BannerCarousel banners={[item.image_url]} alt={`Banner de ${item.name}`} />
      )}

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/${category}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para {config.title}
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative mx-auto md:mx-0">
                    <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-lg">
                      <AvatarImage
                        src={item.image_url || undefined}
                        alt={item.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                        {Icon ? <Icon className="w-12 h-12" /> : getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                    <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                      {config.title}
                    </Badge>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {item.is_featured && <Badge className="bg-primary">Destaque</Badge>}
                      {item.is_24h && (
                        <Badge className="bg-destructive">
                          <Clock className="w-3 h-3 mr-1" />
                          Aberto 24h
                        </Badge>
                      )}
                    </div>

                    {item.address && (
                      <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-4">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{fullAddress}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                      <ShareButton
                        title={item.name}
                        text={`Conheça ${item.name} - ${config.title} no Portal Saúde Limeira`}
                      />
                    </div>
                  </div>
                </div>

                {/* About */}
                <Separator className="my-8" />
                <div>
                  <div className="flex items-center mb-6">
                    <Award className="h-6 w-6 mr-3 text-primary" />
                    <h3 className="text-2xl font-semibold">Sobre</h3>
                  </div>

                  {item.description && (
                    <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                      <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-muted-foreground">Categoria</h4>
                      <p className="font-semibold">{config.title}</p>
                    </div>
                    {item.schedule && (
                      <div>
                        <h4 className="font-medium text-muted-foreground">Horário de Atendimento</h4>
                        <p className="font-semibold">{item.schedule}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-muted-foreground">Localização</h4>
                      <p className="font-semibold">{item.city}{item.state && ` - ${item.state}`}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.phone && (
                    <a href={`tel:${item.phone}`} className="flex items-center gap-3 text-sm hover:text-primary">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{item.phone}</span>
                    </a>
                  )}
                  {item.email && (
                    <a href={`mailto:${item.email}`} className="flex items-center gap-3 text-sm hover:text-primary">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{item.email}</span>
                    </a>
                  )}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-primary">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="truncate">{item.website.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {item.schedule && (
                    <div className="flex items-start gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{item.schedule}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 pt-2">
                    {item.whatsapp && (
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <a href={`https://wa.me/55${item.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
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
                </CardContent>
              </Card>

              <MapEmbed address={fullAddress} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EstablishmentDetail;
