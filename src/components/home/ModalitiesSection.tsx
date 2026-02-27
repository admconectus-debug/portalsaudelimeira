import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
}

const modalities: Modality[] = [
  { id: 1, title: "Hospitais", image: hospitalsImg, link: "/profissionais" },
  { id: 2, title: "Planos Médicos", image: healthPlansImg, link: "/profissionais" },
  { id: 3, title: "Serviços 24 Horas", image: service24hImg, link: "/profissionais" },
  { id: 4, title: "Medicina", image: medicineImg, link: "/profissionais" },
  { id: 5, title: "Odontologia", image: dentistryImg, link: "/profissionais" },
  { id: 6, title: "Laboratório", image: laboratoryImg, link: "/profissionais" },
  { id: 7, title: "Farmácia", image: pharmacyImg, link: "/profissionais" },
  { id: 8, title: "Saúde & Beleza", image: beautyImg, link: "/profissionais" },
  { id: 9, title: "Saúde Pets", image: petsImg, link: "/profissionais" },
];

export const ModalitiesSection = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium text-center mb-2 uppercase tracking-wider text-primary">
          Modalidades
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wide">Carrossel</p>
        
        <div className="max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {modalities.map((modality) => (
                <CarouselItem key={modality.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <Link to={modality.link} className="group block">
                    <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={modality.image}
                            alt={modality.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                            {modality.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
