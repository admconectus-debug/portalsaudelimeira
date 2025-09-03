import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string;
  description: string | null;
  photo_url: string | null;
  specialties: { name: string } | null;
}

interface Specialty {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

const SpecialtyProfessionals = () => {
  const { id } = useParams();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [specialtyProfessionals, setSpecialtyProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      const [specialtyResponse, professionalsResponse] = await Promise.all([
        supabase
          .from("specialties")
          .select("*")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("professionals")
          .select(`
            *,
            specialties (name)
          `)
          .eq("specialty_id", id)
          .order("name")
      ]);

      if (specialtyResponse.data) {
        setSpecialty(specialtyResponse.data);
      }

      if (professionalsResponse.data) {
        setSpecialtyProfessionals(professionalsResponse.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Especialidade não encontrada</h1>
            <Button asChild>
              <Link to="/especialidades">Voltar para especialidades</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/10">
            <Link to="/especialidades">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para especialidades
            </Link>
          </Button>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {specialty.name}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              {specialty.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-lg">
                <strong>{specialtyProfessionals.length}</strong> profissional{specialtyProfessionals.length !== 1 ? 'is' : ''} encontrado{specialtyProfessionals.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Professionals List */}
        {specialtyProfessionals.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {specialtyProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              Ainda não temos profissionais nesta especialidade
            </h3>
            <p className="text-muted-foreground mb-6">
              Estamos constantemente expandindo nossa rede. 
              Entre em contato para sugerir profissionais.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/contato">Sugerir Profissional</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/profissionais">Ver Todos os Profissionais</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialtyProfessionals;