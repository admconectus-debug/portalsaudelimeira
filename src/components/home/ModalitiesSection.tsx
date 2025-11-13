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
import covidImg from "@/assets/modality-covid.jpg";
import clinicalImg from "@/assets/modality-clinical.jpg";
import pharmacyImg from "@/assets/modality-pharmacy.jpg";
import telehealthImg from "@/assets/modality-telehealth.jpg";
import vaccinesImg from "@/assets/modality-vaccines.jpg";

interface Modality {
  id: number;
  title: string;
  image: string;
  link: string;
}

const modalities: Modality[] = [
  {
    id: 1,
    title: "Testes de COVID-19",
    image: covidImg,
    link: "/profissionais"
  },
  {
    id: 2,
    title: "Exames clínicos",
    image: clinicalImg,
    link: "/profissionais"
  },
  {
    id: 3,
    title: "Serviços farma",
    image: pharmacyImg,
    link: "/profissionais"
  },
  {
    id: 4,
    title: "Telessaúde",
    image: telehealthImg,
    link: "/profissionais"
  },
  {
    id: 5,
    title: "Vacinas",
    image: vaccinesImg,
    link: "/profissionais"
  }
];

export const ModalitiesSection = () => {
  return (
    <section className="py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 uppercase tracking-wide text-primary/80">
          Modalidades
        </h2>
        
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
