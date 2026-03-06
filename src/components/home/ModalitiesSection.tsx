import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
  {
    id: 1,
    title: "Hospitais",
    image: hospitalsImg,
    link: "/profissionais",
    icon: Hospital,
    specialties: ["Emergência", "UTI", "Centro Cirúrgico", "Internação"],
  },
  {
    id: 2,
    title: "Planos Médicos",
    image: healthPlansImg,
    link: "/profissionais",
    icon: Shield,
    specialties: ["Unimed", "Amil", "SulAmérica", "Particular"],
  },
  {
    id: 3,
    title: "Serviços 24 Horas",
    image: service24hImg,
    link: "/profissionais",
    icon: Clock,
    specialties: ["Pronto Socorro", "Farmácia", "Laboratório"],
  },
  {
    id: 4,
    title: "Medicina",
    image: medicineImg,
    link: "/profissionais",
    icon: Stethoscope,
    specialties: ["Cardiologia", "Neurologia", "Ortopedia", "Pediatria", "Dermatologia"],
  },
  {
    id: 5,
    title: "Odontologia",
    image: dentistryImg,
    link: "/profissionais",
    icon: SmilePlus,
    specialties: ["Ortodontia", "Implantes", "Clínico Geral", "Endodontia"],
  },
  {
    id: 6,
    title: "Laboratório",
    image: laboratoryImg,
    link: "/profissionais",
    icon: FlaskConical,
    specialties: ["Análises Clínicas", "Imagem", "Patologia"],
  },
  {
    id: 7,
    title: "Farmácia",
    image: pharmacyImg,
    link: "/profissionais",
    icon: Pill,
    specialties: ["Manipulação", "Drogaria", "Homeopatia"],
  },
  {
    id: 8,
    title: "Saúde & Beleza",
    image: beautyImg,
    link: "/profissionais",
    icon: Sparkles,
    specialties: ["Estética", "Nutrição", "Fisioterapia", "Pilates"],
  },
  {
    id: 9,
    title: "Saúde Pets",
    image: petsImg,
    link: "/profissionais",
    icon: PawPrint,
    specialties: ["Veterinário", "Pet Shop", "Banho e Tosa"],
  },
];

export const ModalitiesSection = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-2 uppercase tracking-wider text-primary">
          Modalidades
        </h2>
        <p className="text-center text-muted-foreground mb-10 text-sm uppercase tracking-wide">
          Especialidades por categoria
        </p>

        {/* Waterfall / Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 max-w-7xl mx-auto">
          {modalities.map((modality, index) => {
            const Icon = modality.icon;
            // Alternate heights for waterfall effect
            const isLarge = index % 3 === 0;

            return (
              <Link
                key={modality.id}
                to={modality.link}
                className="group block mb-4 break-inside-avoid"
              >
                <Card className="bg-card border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div
                      className={`relative overflow-hidden ${
                        isLarge ? "h-48 md:h-56" : "h-32 md:h-40"
                      }`}
                    >
                      <img
                        src={modality.image}
                        alt={modality.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                      {/* Icon badge */}
                      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <Icon className="h-4 w-4 text-primary-foreground" />
                      </div>

                      {/* Title on image */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white drop-shadow-md">
                          {modality.title}
                        </h3>
                      </div>
                    </div>

                    {/* Specialties cascade list */}
                    <div className="p-3 space-y-1.5">
                      {modality.specialties.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                          style={{
                            paddingLeft: `${i * 6}px`,
                          }}
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0"
                            style={{
                              opacity: 1 - i * 0.15,
                            }}
                          />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
