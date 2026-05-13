import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Ambulance, Building2, ExternalLink } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_emergency: boolean;
  is_public: boolean;
}

const Hospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Hospitais - Portal Saúde Limeira";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Conheça os hospitais e pronto-socorros de Limeira: endereço, telefone e localização no mapa.");
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    const { data } = await supabase
      .from("hospitals")
      .select("*")
      .eq("is_active", true)
      .order("name");
    setHospitals(data || []);
    setLoading(false);
  };

  const mapSrc = (address: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-primary text-white py-12 md:py-16">
          <div className="container px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Hospitais</h1>
            <p className="text-white/90 max-w-2xl mx-auto">
              Hospitais e serviços de urgência de Limeira e região. Encontre endereço, contato e localização.
            </p>
          </div>
        </section>

        {/* List */}
        <section className="py-12">
          <div className="container px-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Carregando hospitais...</div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Nenhum hospital cadastrado ainda.</div>
            ) : (
              <div className="space-y-8">
                {hospitals.map((h) => (
                  <Card key={h.id} className="overflow-hidden shadow-soft hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                      {/* Foto */}
                      <div className="relative aspect-video lg:aspect-auto lg:min-h-[280px] bg-muted">
                        {h.image_url ? (
                          <img src={h.image_url} alt={h.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building2 className="w-16 h-16" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {h.is_emergency && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              <Ambulance className="w-3 h-3 mr-1" />
                              Urgência
                            </Badge>
                          )}
                          {h.is_public && (
                            <Badge variant="secondary">Público (SUS)</Badge>
                          )}
                        </div>
                      </div>

                      {/* Mapa */}
                      <div className="min-h-[280px] bg-muted border-y lg:border-y-0 lg:border-x border-border">
                        {h.address ? (
                          <iframe
                            src={mapSrc(`${h.address}, ${h.city}${h.state ? ", " + h.state : ""}`)}
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: 280 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Mapa - ${h.name}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <MapPin className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="p-6 flex flex-col">
                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">{h.name}</h2>
                        {h.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{h.description}</p>
                        )}
                        <div className="space-y-3 text-sm">
                          {h.address && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                {h.address}
                                <br />
                                {h.city}{h.state && ` - ${h.state}`}
                              </span>
                            </div>
                          )}
                          {h.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                              <a href={`tel:${h.phone}`} className="hover:text-primary">{h.phone}</a>
                            </div>
                          )}
                          {h.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                              <a href={`mailto:${h.email}`} className="hover:text-primary break-all">{h.email}</a>
                            </div>
                          )}
                          {h.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                              <a href={h.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">
                                {h.website.replace(/^https?:\/\//, "")}
                              </a>
                            </div>
                          )}
                        </div>

                        {h.address && (
                          <Button
                            asChild
                            variant="outline"
                            className="mt-4 w-full"
                          >
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${h.address}, ${h.city}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Como chegar
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Hospitals;
