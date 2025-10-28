import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string | null;
  bio: string | null;
  photo_url: string | null;
  schedule: string | null;
  appointment_link: string | null;
}

interface Clinic {
  id: string;
  name: string;
  city: string;
  state: string | null;
  slug: string;
  image_url: string | null;
}

const DoctorDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchDoctorData();
    }
  }, [slug]);

  const fetchDoctorData = async () => {
    try {
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (doctorError) throw doctorError;
      
      if (doctorData) {
        setDoctor(doctorData);

        const { data: clinicsData, error: clinicsError } = await supabase
          .from("clinic_doctors")
          .select(`
            clinic_id,
            clinics (
              id,
              name,
              city,
              state,
              slug,
              image_url
            )
          `)
          .eq("doctor_id", doctorData.id);

        if (clinicsError) throw clinicsError;

        const formattedClinics = clinicsData
          ?.filter(item => item.clinics)
          .map(item => {
            const clinic = Array.isArray(item.clinics) ? item.clinics[0] : item.clinics;
            return clinic;
          })
          .filter(Boolean) as Clinic[];

        setClinics(formattedClinics || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do profissional:", error);
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
            <div className="animate-pulse">Carregando profissional...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Profissional não encontrado</h2>
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

      <div className="container mx-auto px-4 py-12">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/clinicas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gradient-subtle">
                {doctor.photo_url ? (
                  <img 
                    src={doctor.photo_url} 
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    👨‍⚕️
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-xl text-muted-foreground mb-4">{doctor.specialty}</p>
                {doctor.crm && (
                  <p className="text-sm text-muted-foreground mb-4">CRM: {doctor.crm}</p>
                )}

                {doctor.bio && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Sobre</h2>
                      <p className="text-muted-foreground whitespace-pre-line">{doctor.bio}</p>
                    </div>
                  </>
                )}

                {doctor.schedule && (
                  <>
                    <Separator className="my-6" />
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Horários de Atendimento</p>
                        <p className="text-muted-foreground text-sm whitespace-pre-line">{doctor.schedule}</p>
                      </div>
                    </div>
                  </>
                )}

                {doctor.appointment_link && (
                  <>
                    <Separator className="my-6" />
                    <Button asChild className="w-full md:w-auto">
                      <a href={doctor.appointment_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Agendar Consulta
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {clinics.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Clínicas de Atendimento</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <Card key={clinic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col">
                      {clinic.image_url ? (
                        <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gradient-subtle">
                          <img 
                            src={clinic.image_url} 
                            alt={clinic.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 mb-4 rounded-lg flex items-center justify-center bg-gradient-subtle">
                          <Building2 className="w-16 h-16 text-muted-foreground/20" />
                        </div>
                      )}
                      <h3 className="font-bold text-lg mb-2">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/clinicas/${clinic.slug}`}>
                          Ver Clínica
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

export default DoctorDetail;
