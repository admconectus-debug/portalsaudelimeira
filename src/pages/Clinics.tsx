import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Clinic {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  address: string | null;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  schedule: string | null;
  website: string | null;
  slug: string;
}

const Clinics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      
      setClinics(data || []);
    } catch (error) {
      console.error("Erro ao carregar clínicas:", error);
    } finally {
      setLoading(false);
    }
  };

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(clinics.map(c => c.city)));
    return uniqueCities.sort();
  }, [clinics]);

  const filteredClinics = useMemo(() => {
    return clinics.filter(clinic => {
      const matchesSearch = 
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (clinic.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity === "all" || clinic.city === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [searchTerm, selectedCity, clinics]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossas Clínicas
            </h1>
            <p className="text-xl opacity-90">
              Encontre a clínica de saúde mais próxima de você. 
              Atendimento de qualidade e profissionais qualificados.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Carregando clínicas...</div>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg shadow-soft p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou cidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full lg:w-[200px]">
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as cidades</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  Limpar
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {filteredClinics.length} clínica{filteredClinics.length !== 1 ? 's' : ''} encontrada{filteredClinics.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {filteredClinics.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClinics.map((clinic) => (
                  <Card key={clinic.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gradient-subtle">
                      {clinic.image_url ? (
                        <img 
                          src={clinic.image_url} 
                          alt={clinic.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl text-muted-foreground/20">🏥</div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{clinic.name}</h3>
                      
                      {clinic.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {clinic.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm">
                        {(clinic.city || clinic.state) && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">
                              {clinic.city}{clinic.state ? ` - ${clinic.state}` : ""}
                              {clinic.address && (
                                <>
                                  <br />
                                  <span className="text-xs">{clinic.address}</span>
                                </>
                              )}
                            </span>
                          </div>
                        )}

                        {clinic.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{clinic.phone}</span>
                          </div>
                        )}

                        {clinic.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{clinic.email}</span>
                          </div>
                        )}

                        {clinic.schedule && (
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-xs">{clinic.schedule}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to={`/clinicas/${clinic.slug}`}>
                          Ver Clínica
                        </Link>
                      </Button>
                      {clinic.website && (
                        <Button asChild variant="outline" size="icon">
                          <a href={clinic.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Nenhuma clínica encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros para encontrar o que você procura.
                </p>
                <Button onClick={clearFilters}>
                  Limpar filtros e ver todas
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

export default Clinics;
