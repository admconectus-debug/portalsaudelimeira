import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Hospital,
  Shield,
  Clock,
  Stethoscope,
  SmilePlus,
  FlaskConical,
  Pill,
  Sparkles,
  PawPrint,
  ChevronDown,
} from "lucide-react";

// Import modality images
import hospitalsImg from "@/assets/modality-hospitals.jpg";
import healthPlansImg from "@/assets/modality-health-plans.jpg";
import service24hImg from "@/assets/modality-24h.jpg";
import medicineImg from "@/assets/modality-medicine.jpg";
import dentistryImg from "@/assets/modality-dentistry.jpg";
import laboratoryImg from "@/assets/modality-laboratory.jpg";
import pharmacyImg from "@/assets/modality-pharmacy-new.jpg";
import beautyImg from "@/assets/modality-beauty.jpg";
import petsImg from "@/assets/modality-pets.jpg";

interface Modality {
  id: number;
  title: string;
  image: string;
  link: string;
  icon: React.ComponentType<any>;
  specialties: string[];
}

const modalities: Modality[] = [
  { id: 1, title: "Hospitais", image: hospitalsImg, link: "/profissionais", icon: Hospital, specialties: ["Emergência", "UTI", "Centro Cirúrgico", "Internação"] },
  { id: 2, title: "Planos Médicos", image: healthPlansImg, link: "/profissionais", icon: Shield, specialties: ["Unimed", "Amil", "SulAmérica", "Particular"] },
  { id: 3, title: "Serviços 24 Horas", image: service24hImg, link: "/profissionais", icon: Clock, specialties: ["Pronto Socorro", "Farmácia", "Laboratório"] },
  { id: 4, title: "Medicina", image: medicineImg, link: "/profissionais", icon: Stethoscope, specialties: ["Cardiologia", "Neurologia", "Ortopedia", "Pediatria", "Dermatologia"] },
  { id: 5, title: "Odontologia", image: dentistryImg, link: "/profissionais", icon: SmilePlus, specialties: ["Ortodontia", "Implantes", "Clínico Geral", "Endodontia"] },
  { id: 6, title: "Laboratório", image: laboratoryImg, link: "/profissionais", icon: FlaskConical, specialties: ["Análises Clínicas", "Imagem", "Patologia"] },
  { id: 7, title: "Farmácia", image: pharmacyImg, link: "/profissionais", icon: Pill, specialties: ["Manipulação", "Drogaria", "Homeopatia"] },
  { id: 8, title: "Saúde & Beleza", image: beautyImg, link: "/profissionais", icon: Sparkles, specialties: ["Estética", "Nutrição", "Fisioterapia", "Pilates"] },
  { id: 9, title: "Saúde Pets", image: petsImg, link: "/profissionais", icon: PawPrint, specialties: ["Veterinário", "Pet Shop", "Banho e Tosa"] },
];

export const ModalitiesSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-2 uppercase tracking-wider text-primary">
          Modalidades
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wide">Carrossel</p>
        
        <div className="max-w-7xl mx-auto overflow-visible">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full [&>div]:overflow-visible"
          >
            <CarouselContent className="-ml-4">
              {modalities.map((modality) => {
                const Icon = modality.icon;
                const isExpanded = expandedId === modality.id;

                return (
                  <CarouselItem key={modality.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <div className="group block">
                      <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                        <CardContent className="p-0">
                          <Link to={modality.link}>
                            <div className="aspect-[4/3] overflow-hidden relative">
                              <img
                                src={modality.image}
                                alt={modality.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm rounded-full p-1.5">
                                <Icon className="h-3.5 w-3.5 text-primary-foreground" />
                              </div>
                            </div>
                          </Link>
                          <div
                            className="p-4 flex items-center justify-between cursor-pointer select-none"
                            onClick={(e) => toggleExpand(modality.id, e)}
                          >
                            <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                              {modality.title}
                            </h3>
                            <ChevronDown
                              className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          {/* Specialties dropdown */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="px-4 pb-4 space-y-1.5 border-t border-border pt-3">
                              {modality.specialties.map((spec, i) => (
                                <Link
                                  key={i}
                                  to={modality.link}
                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                                  <span>{spec}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
