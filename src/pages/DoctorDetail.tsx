import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  slug: string;
}

export default function DoctorDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchDoctorData();
    }
  }, [slug]);

  const fetchDoctorData = async () => {
    try {
      // Fetch doctor data
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (doctorError) throw doctorError;
      if (!doctorData) {
        navigate("/404");
        return;
      }

      setDoctor(doctorData);

      // Fetch clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from("clinic_doctors")
        .select(
          `
          clinic_id,
          clinics!inner (
            id,
            name,
            city,
            slug,
            is_active
          )
        `
        )
        .eq("doctor_id", doctorData.id);

      if (clinicsError) throw clinicsError;

      const activeClinics = clinicsData
        ?.map((item: any) => item.clinics)
        .filter((clinic: any) => clinic.is_active) || [];

      setClinics(activeClinics);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
      navigate("/medicos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-48 h-48 mx-auto mb-6">
                      <AvatarImage src={doctor.photo_url || ""} />
                      <AvatarFallback>
                        <User className="w-24 h-24" />
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                    <Badge className="mb-2">{doctor.specialty}</Badge>
                    {doctor.crm && (
                      <p className="text-sm text-muted-foreground mb-4">
                        CRM: {doctor.crm}
                      </p>
                    )}

                    {doctor.appointment_link && (
                      <a
                        href={doctor.appointment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Agendar Consulta
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {doctor.bio && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Sobre</h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {doctor.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {doctor.schedule && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Horários de Atendimento
                          </h3>
                          <p className="text-muted-foreground">
                            {doctor.schedule}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {clinics.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <h3 className="text-xl font-bold">Atende nas clínicas:</h3>
                      </div>
                      <div className="space-y-3 ml-9">
                        {clinics.map((clinic) => (
                          <Link
                            key={clinic.id}
                            to={`/clinicas/${clinic.slug}`}
                            className="block"
                          >
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-primary">
                                  {clinic.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {clinic.city}
                                </p>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
