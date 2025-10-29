import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ExternalLink, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Clinic {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  schedule: string | null;
  website: string | null;
}

interface Professional {
  id: string;
  name: string;
  location: string;
  photo_url: string | null;
  specialty_id: string | null;
}

const ClinicDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchClinicData();
    }
  }, [slug]);

  const fetchClinicData = async () => {
    try {
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (clinicError) throw clinicError;
      
      if (clinicData) {
        setClinic(clinicData);

        const { data: professionalsData, error: professionalsError } = await supabase
          .from("clinic_professionals")
          .select(`
            professional_id,
            professionals (
              id,
              name,
              location,
              photo_url,
              specialty_id
            )
          `)
          .eq("clinic_id", clinicData.id);

        if (professionalsError) throw professionalsError;

        const formattedProfessionals = professionalsData
          ?.filter(item => item.professionals)
          .map(item => {
            const professional = Array.isArray(item.professionals) ? item.professionals[0] : item.professionals;
            return professional;
          })
          .filter(Boolean) as Professional[];

        setProfessionals(formattedProfessionals || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados da clínica:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Carregando clínica...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Clínica não encontrada</h2>
            <Button asChild>
              <Link to="/clinicas">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para clínicas
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative h-64 md:h-96 bg-gradient-subtle">
        {clinic.image_url ? (
          <img 
            src={clinic.image_url} 
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-32 h-32 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/clinicas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6 mb-6">
              {clinic.image_url && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border bg-card">
                  <img 
                    src={clinic.image_url} 
                    alt={`Logo ${clinic.name}`}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{clinic.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}
                </p>
              </div>
            </div>

            {clinic.description && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-xl font-semibold mb-3">Sobre a Clínica</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{clinic.description}</p>
                </div>
              </>
            )}

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-4">
              {clinic.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Endereço</p>
                    <p className="text-muted-foreground text-sm">
                      {clinic.address}
                      <br />
                      {clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}
                    </p>
                  </div>
                </div>
              )}

              {clinic.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Telefone / WhatsApp</p>
                    <p className="text-muted-foreground text-sm">{clinic.phone}</p>
                  </div>
                </div>
              )}

              {clinic.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">E-mail</p>
                    <p className="text-muted-foreground text-sm">{clinic.email}</p>
                  </div>
                </div>
              )}

              {clinic.schedule && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Horário de Funcionamento</p>
                    <p className="text-muted-foreground text-sm">{clinic.schedule}</p>
                  </div>
                </div>
              )}
            </div>

            {clinic.website && (
              <>
                <Separator className="my-6" />
                <Button asChild variant="outline" className="w-full md:w-auto">
                  <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visitar Site
                  </a>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {professionals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Profissionais desta Clínica</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {professionals.map((professional) => (
                <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gradient-subtle">
                        {professional.photo_url ? (
                          <img 
                            src={professional.photo_url} 
                            alt={professional.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            👨‍⚕️
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{professional.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{professional.location}</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/profissionais/${professional.id}`}>
                          Ver Perfil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ClinicDetail;
