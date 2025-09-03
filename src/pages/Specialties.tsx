import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpecialtyCard from "@/components/cards/SpecialtyCard";
import { specialties } from "@/data/mockData";

const Specialties = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Especialidades Médicas
            </h1>
            <p className="text-xl opacity-90">
              Explore todas as especialidades disponíveis e encontre o profissional 
              mais adequado para suas necessidades específicas de saúde.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-card rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">
              {specialties.length}
            </h3>
            <p className="text-muted-foreground">Especialidades</p>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">
              {specialties.reduce((sum, s) => sum + s.professionalsCount, 0)}
            </h3>
            <p className="text-muted-foreground">Profissionais</p>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">24h</h3>
            <p className="text-muted-foreground">Suporte</p>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
            <p className="text-muted-foreground">Verificados</p>
          </div>
        </div>

        {/* Specialties Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Todas as Especialidades</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-primary text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Não encontrou a especialidade que procura?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Entre em contato conosco! Estamos sempre expandindo nossa rede de profissionais 
            para atender melhor às suas necessidades.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contato">
                Fale Conosco
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/profissionais">
                Ver Todos os Profissionais
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Specialties;