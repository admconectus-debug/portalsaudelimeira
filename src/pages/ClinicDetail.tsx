import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Building2,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo_url: string | null;
  slug: string;
}

export default function ClinicDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchClinicData();
    }
  }, [slug]);

  const fetchClinicData = async () => {
    try {
      // Fetch clinic data
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (clinicError) throw clinicError;
      if (!clinicData) {
        navigate("/404");
        return;
      }

      setClinic(clinicData);

      // Fetch doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("clinic_doctors")
        .select(
          `
          doctor_id,
          doctors!inner (
            id,
            name,
            specialty,
            photo_url,
            slug,
            is_active
          )
        `
        )
        .eq("clinic_id", clinicData.id);

      if (doctorsError) throw doctorsError;

      const activeDoctors = doctorsData
        ?.map((item: any) => item.doctors)
        .filter((doctor: any) => doctor.is_active) || [];

      setDoctors(activeDoctors);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
      navigate("/clinicas");
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

  if (!clinic) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="aspect-[21/9] relative bg-muted">
            {clinic.image_url ? (
              <img
                src={clinic.image_url}
                alt={clinic.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-32 h-32 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {clinic.name}
                </h1>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {clinic.city}
                    {clinic.state && `, ${clinic.state}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {clinic.description && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">
                        Sobre a Clínica
                      </h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {clinic.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {doctors.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">
                        Médicos desta Clínica
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctors.map((doctor) => (
                          <Link
                            key={doctor.id}
                            to={`/medicos/${doctor.slug}`}
                            className="block"
                          >
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4 flex items-center space-x-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={doctor.photo_url || ""} />
                                  <AvatarFallback>
                                    <User className="w-8 h-8" />
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold">
                                    {doctor.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {doctor.specialty}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold mb-4">
                      Informações de Contato
                    </h3>

                    {clinic.address && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Endereço</p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {clinic.phone && (
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Telefone</p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {clinic.email && (
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">E-mail</p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {clinic.schedule && (
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Horário de Funcionamento</p>
                          <p className="text-sm text-muted-foreground">
                            {clinic.schedule}
                          </p>
                        </div>
                      </div>
                    )}

                    {clinic.website && (
                      <a
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visitar Website
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
