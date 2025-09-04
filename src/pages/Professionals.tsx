import { useState, useMemo, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfessionalCard from "@/components/cards/ProfessionalCard";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  name: string;
  location: string;
  description: string | null;
  photo_url: string | null;
  specialties: { name: string } | null;
}

interface Specialty {
  id: string;
  name: string;
}

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [professionalsResponse, specialtiesResponse] = await Promise.all([
        supabase
          .from("professionals")
          .select(`
            id,
            name,
            location,
            description,
            photo_url,
            specialty_id,
            specialties (name)
          `)
          .order("name"),
        supabase
          .from("specialties")
          .select("*")
          .order("name")
      ]);

      if (professionalsResponse.data) {
        setProfessionals(professionalsResponse.data);
      }

      if (specialtiesResponse.data) {
        setSpecialties(specialtiesResponse.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(professionals.map(p => p.location.split(", ")[1] || p.location)));
    return uniqueLocations.sort();
  }, [professionals]);

  // Filter professionals
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(professional => {
      const matchesSearch = 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (professional.specialties?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = selectedSpecialty === "all" || professional.specialties?.name === selectedSpecialty;

      const matchesLocation = selectedLocation === "all" || professional.location.includes(selectedLocation);

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [searchTerm, selectedSpecialty, selectedLocation, professionals]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("all");
    setSelectedLocation("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossos Profissionais
            </h1>
            <p className="text-xl opacity-90">
              Encontre o profissional de saúde ideal para suas necessidades. 
              Todos são verificados e qualificados.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Carregando profissionais...</div>
          </div>
        ) : (
          <>
            {/* ... rest of content */}
          </>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, especialidade ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {!loading && (
          <>
            {/* Results */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {filteredProfessionals.length} profissional{filteredProfessionals.length !== 1 ? 'is' : ''} encontrado{filteredProfessionals.length !== 1 ? 's' : ''}
              </h2>
              {(searchTerm || selectedSpecialty !== "all" || selectedLocation !== "all") && (
                <p className="text-muted-foreground">
                  {searchTerm && `Buscando por: "${searchTerm}" • `}
                  {selectedSpecialty !== "all" && `Especialidade: ${selectedSpecialty} • `}
                  {selectedLocation !== "all" && `Localização: ${selectedLocation} • `}
                  <Button variant="link" onClick={clearFilters} className="h-auto p-0 text-primary">
                    Limpar filtros
                  </Button>
                </p>
              )}
            </div>

            {/* Professionals Grid */}
            {filteredProfessionals.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredProfessionals.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Nenhum profissional encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros para encontrar o que você procura.
                </p>
                <Button onClick={clearFilters}>
                  Limpar filtros e ver todos
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Professionals;