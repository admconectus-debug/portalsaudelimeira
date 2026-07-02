import { Link } from "react-router-dom";
import {
  Shield,
  Stethoscope,
  SmilePlus,
  FlaskConical,
  Pill,
  Sparkles,
  PawPrint,
  Dumbbell,
  Hospital,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import medicineImg from "@/assets/modality-medicine.jpg";
import dentistryImg from "@/assets/modality-dentistry.jpg";
import laboratoryImg from "@/assets/modality-laboratory.jpg";
import pharmacyImg from "@/assets/modality-pharmacy-new.jpg";
import beautyImg from "@/assets/modality-beauty.jpg";
import petsImg from "@/assets/modality-pets.jpg";
import fitnessImg from "@/assets/modality-fitness.jpg";
import hospitalsImg from "@/assets/modality-hospitals.jpg";

const categories = [
  { title: "Medicina", link: "/profissionais", icon: Stethoscope, image: medicineImg },
  { title: "Odontologia", link: "/profissionais", icon: SmilePlus, image: dentistryImg },
  { title: "Laboratórios", link: "/laboratorios", icon: FlaskConical, image: laboratoryImg },
  { title: "Farmácias", link: "/farmacias", icon: Pill, image: pharmacyImg },
  { title: "Saúde & Beleza", link: "/saude-beleza", icon: Sparkles, image: beautyImg },
  { title: "Saúde Pets", link: "/saude-pets", icon: PawPrint, image: petsImg },
  { title: "Fitness", link: "/fitness", icon: Dumbbell, image: fitnessImg },
  { title: "Hospitais", link: "/hospitais", icon: Hospital, image: hospitalsImg },
];

export const HomeCategoriesSection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Explore por Categoria
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escolha a área que você precisa e encontre os melhores profissionais e serviços de saúde de Limeira.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className={cn(
                  "group relative overflow-hidden rounded-xl shadow-sm",
                  "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
                  "aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur mb-2 self-start">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{cat.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Link to="/categorias">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
