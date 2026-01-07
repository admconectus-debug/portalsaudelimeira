import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const VideosSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-12 uppercase tracking-wider text-primary">
          Sobre Nós
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          {/* Video */}
          <Card className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="aspect-video flex items-center justify-center bg-muted/30">
                <span className="text-lg font-medium text-muted-foreground uppercase tracking-wide">
                  Vídeo Institucional
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Text Content */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Portal Saúde Limeira
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Somos o maior portal de saúde da região de Limeira, conectando pacientes 
              aos melhores profissionais de saúde. Nossa missão é facilitar o acesso 
              a cuidados médicos de qualidade, oferecendo uma plataforma completa 
              para encontrar médicos, dentistas, psicólogos e outros especialistas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Com mais de 950 profissionais cadastrados, oferecemos uma ampla variedade 
              de especialidades para atender todas as suas necessidades de saúde.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/contato">
                Saiba mais
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
