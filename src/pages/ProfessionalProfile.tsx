import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Star, Calendar, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContactInfo } from "@/components/auth/ContactInfo";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  name: string;
  location: string;
  description: string | null;
  photo_url: string | null;
  specialties: { name: string } | null;
}

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState({
    avatar: false
  });

  useEffect(() => {
    if (id) {
      fetchProfessional(id);
    }
  }, [id]);

  const fetchProfessional = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select(`
          id,
          name,
          location,
          description,
          photo_url,
          specialty_id,
          specialties (name)
        `)
        .eq("id", professionalId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        console.log('Dados do profissional:', data);
        console.log('Photo URL:', data.photo_url);
        setProfessional(data);
      } else {
        setError("Profissional não encontrado");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-pulse">Carregando perfil...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || "Profissional não encontrado"}
            </h1>
            <Button asChild>
              <Link to="/profissionais">Voltar para a lista</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/profissionais">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para profissionais
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative mx-auto md:mx-0">
                    <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-lg">
                      {imageLoading.avatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-full">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                      <AvatarImage 
                        src={professional.photo_url && professional.photo_url.trim() !== '' ? professional.photo_url : undefined} 
                        alt={professional.name}
                        className="object-cover"
                        onLoad={() => setImageLoading(prev => ({ ...prev, avatar: false }))}
                        onLoadStart={() => setImageLoading(prev => ({ ...prev, avatar: true }))}
                        onError={(e) => {
                          console.log('Erro ao carregar foto:', professional.photo_url);
                          e.currentTarget.style.display = 'none';
                          setImageLoading(prev => ({ ...prev, avatar: false }));
                        }}
                      />
                      <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    {professional.photo_url && professional.photo_url.trim() !== '' && !imageLoading.avatar && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                 <div className="flex-1 text-center md:text-left">
                   <h1 className="text-3xl font-bold mb-2">{professional.name}</h1>
                   <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                     {professional.specialties?.name || "Sem especialidade"}
                   </Badge>

                   {/* Location */}
                   <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-6">
                     <MapPin className="h-5 w-5 mr-2" />
                     <span>{professional.location}</span>
                   </div>
                 </div>
                </div>

                {/* Enhanced About Section */}
                {professional.description && (
                  <>
                    <Separator className="my-8" />
                    <div>
                      <div className="flex items-center mb-6">
                        <Award className="h-6 w-6 mr-3 text-primary" />
                        <h3 className="text-2xl font-semibold">Sobre o Profissional</h3>
                      </div>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                          {professional.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div>
            <div className="sticky top-24">
              <ContactInfo 
                professionalId={professional.id} 
                professionalName={professional.name}
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-muted-foreground">Especialidade</h4>
                <p className="font-semibold">{professional.specialties?.name || "Não informada"}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Região de Atendimento</h4>
                <p className="font-semibold">{professional.location}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Como Agendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">1</div>
                  <p className="text-sm">Entre em contato via WhatsApp ou telefone</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">2</div>
                  <p className="text-sm">Informe seus dados e necessidade</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">3</div>
                  <p className="text-sm">Confirme data e horário disponível</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfessionalProfile;