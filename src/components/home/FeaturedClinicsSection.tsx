import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  slug: string;
  category: string | null;
}

export function FeaturedClinicsSection() {
  const [featuredClinics, setFeaturedClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedClinics();
  }, []);

  const fetchFeaturedClinics = async () => {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("name")
        .limit(3);

      if (error) {
        console.error("Erro ao carregar clínicas em destaque:", error);
      } else {
        setFeaturedClinics(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar clínicas em destaque:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || featuredClinics.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Clínicas em Destaque
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça nossas clínicas parceiras selecionadas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClinics.map((clinic) => (
            <Card key={clinic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {clinic.image_url ? (
                  <img
                    src={clinic.image_url}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  {clinic.category && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {clinic.category}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mt-2 mb-2">{clinic.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {clinic.description || "Clínica de saúde especializada"}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {clinic.city}{clinic.state && `, ${clinic.state}`}
                    </span>
                  </div>
                  {clinic.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                  {clinic.email && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{clinic.email}</span>
                    </div>
                  )}
                </div>

                <Link to={`/clinicas/${clinic.slug}`}>
                  <Button className="w-full" variant="outline">
                    Ver detalhes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/clinicas">
            <Button size="lg" variant="outline">
              Ver todas as clínicas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
