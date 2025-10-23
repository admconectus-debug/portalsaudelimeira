import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {modalities.map((modality) => (
            <Link
              key={modality.id}
              to={modality.link}
              className="group"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
};
