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
  Clock,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import healthPlansImg from "@/assets/modality-health-plans.jpg";
import medicineImg from "@/assets/modality-medicine.jpg";
import dentistryImg from "@/assets/modality-dentistry.jpg";
import laboratoryImg from "@/assets/modality-laboratory.jpg";
import pharmacyImg from "@/assets/modality-pharmacy-new.jpg";
import beautyImg from "@/assets/modality-beauty.jpg";
import petsImg from "@/assets/modality-pets.jpg";
import fitnessImg from "@/assets/modality-fitness.jpg";
import hospitalsImg from "@/assets/modality-hospitals.jpg";

const categories = [
  { title: "Planos Médicos", link: "/planos-medicos", icon: Shield, image: healthPlansImg },
  { title: "Medicina", link: "/profissionais", icon: Stethoscope, image: medicineImg },
  { title: "Odontologia", link: "/profissionais", icon: SmilePlus, image: dentistryImg },
  { title: "Laboratórios", link: "/laboratorios", icon: FlaskConical, image: laboratoryImg },
  { title: "Farmácias", link: "/farmacias", icon: Pill, image: pharmacyImg },
  { title: "Saúde & Beleza", link: "/saude-beleza", icon: Sparkles, image: beautyImg },
  { title: "Saúde Pets", link: "/saude-pets", icon: PawPrint, image: petsImg },
  { title: "Fitness", link: "/fitness", icon: Dumbbell, image: fitnessImg },
  { title: "Hospitais", link: "/hospitais", icon: Hospital, image: hospitalsImg },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Categorias</h1>
            <p className="text-white/90 max-w-2xl mx-auto">
              Navegue por todas as categorias do Portal Saúde Limeira.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.title}
                    to={cat.link}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-[4/3]"
                  >
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur mb-3 self-start">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
