import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export function ImageTest() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select(`
          id,
          name,
          photo_url,
          banner_url,
          specialties (name)
        `)
        .limit(5);

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Teste de Exibição de Imagens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={fetchProfessionals} disabled={loading}>
          {loading ? "Carregando..." : "Buscar Profissionais com Imagens"}
        </Button>

        {professionals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profissionais Encontrados:</h3>
            {professionals.map((professional) => (
              <div key={professional.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium">{professional.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {professional.specialties?.name || "Sem especialidade"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Foto de Perfil */}
                  <div>
                    <h5 className="font-medium mb-2">Foto de Perfil:</h5>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={professional.photo_url || undefined} 
                          alt={professional.name}
                          className="object-cover"
                          onError={(e) => {
                            console.log("Erro ao carregar foto:", professional.photo_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <AvatarFallback>
                          {getInitials(professional.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          URL: {professional.photo_url || "Não definida"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Status: {professional.photo_url ? "✅ Definida" : "❌ Não definida"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  <div>
                    <h5 className="font-medium mb-2">Banner:</h5>
                    <div className="space-y-2">
                      {professional.banner_url ? (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden">
                          <img 
                            src={professional.banner_url} 
                            alt={`Banner de ${professional.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log("Erro ao carregar banner:", professional.banner_url);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">Sem banner</span>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        URL: {professional.banner_url || "Não definida"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Status: {professional.banner_url ? "✅ Definida" : "❌ Não definida"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
