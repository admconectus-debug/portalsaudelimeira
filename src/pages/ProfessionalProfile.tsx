import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Star, Calendar, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { professionals } from "@/data/mockData";

const ProfessionalProfile = () => {
  const { id } = useParams();
  const professional = professionals.find(p => p.id === id);

  if (!professional) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
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

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá ${professional.name}, encontrei seu contato no portal Saúde Connect e gostaria de agendar uma consulta.`
    );
    const phoneNumber = professional.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${professional.phone}`, '_self');
  };

  const handleEmailClick = () => {
    if (professional.email) {
      window.open(`mailto:${professional.email}`, '_self');
    }
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
                  <Avatar className="h-32 w-32 border-4 border-primary/20 mx-auto md:mx-0">
                    <AvatarImage src={professional.photo} alt={professional.name} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{professional.name}</h1>
                    <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                      {professional.specialty}
                    </Badge>

                    {/* Rating & Experience */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                      {professional.rating && (
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{professional.rating}</span>
                          <span className="text-muted-foreground">de 5.0</span>
                        </div>
                      )}
                      {professional.experience && (
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-primary" />
                          <span className="font-medium">{professional.experience} de experiência</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-6">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{professional.location}</span>
                    </div>

                    {/* Clinic */}
                    {professional.clinic && (
                      <p className="text-muted-foreground mb-6">
                        <span className="font-medium">Atende em:</span> {professional.clinic}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {professional.description && (
                  <>
                    <Separator className="my-8" />
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Sobre o Profissional</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {professional.description}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* WhatsApp */}
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp: {professional.whatsapp}
                </Button>

                {/* Phone */}
                <Button
                  onClick={handlePhoneClick}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Telefone: {professional.phone}
                </Button>

                {/* Email */}
                {professional.email && (
                  <Button
                    onClick={handleEmailClick}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    E-mail
                  </Button>
                )}

                <Separator />

                {/* Contact Notes */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Entre em contato para agendar
                  </p>
                  <p className="text-xs">
                    * Horários de atendimento podem variar. 
                    Confirme disponibilidade diretamente com o profissional.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                <p className="font-semibold">{professional.specialty}</p>
              </div>
              {professional.experience && (
                <div>
                  <h4 className="font-medium text-muted-foreground">Experiência</h4>
                  <p className="font-semibold">{professional.experience}</p>
                </div>
              )}
              {professional.clinic && (
                <div>
                  <h4 className="font-medium text-muted-foreground">Local de Atendimento</h4>
                  <p className="font-semibold">{professional.clinic}</p>
                </div>
              )}
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