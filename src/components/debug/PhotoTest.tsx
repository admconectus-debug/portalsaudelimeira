import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export function PhotoTest() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select(`
          id,
          name,
          photo_url,
          specialties (name)
        `)
        .order("name");

      if (error) throw error;
      
      console.log('Profissionais com fotos:', data);
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

  const testPhotoUrl = (url: string) => {
    if (!url) return;
    
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Foto carregada com sucesso: ${url}`);
      alert(`✅ Foto carregada com sucesso!\nURL: ${url}`);
    };
    img.onerror = () => {
      console.log(`❌ Erro ao carregar foto: ${url}`);
      alert(`❌ Erro ao carregar foto!\nURL: ${url}`);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Fotos de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchProfessionals} disabled={loading}>
            {loading ? "Carregando..." : "🔍 Buscar Profissionais com Fotos"}
          </Button>

          {professionals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Profissionais Encontrados: {professionals.length}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionals.map((professional) => (
                  <Card 
                    key={professional.id} 
                    className={`cursor-pointer transition-all ${
                      selectedProfessional?.id === professional.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedProfessional(professional)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        {/* Avatar Grande */}
                        <div className="flex justify-center">
                          <Avatar className="h-20 w-20 border-2 border-primary/20">
                            <AvatarImage 
                              src={professional.photo_url || undefined} 
                              alt={professional.name}
                              className="object-cover"
                              onError={(e) => {
                                console.log("❌ Erro ao carregar foto:", professional.photo_url);
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log("✅ Foto carregada:", professional.photo_url);
                              }}
                            />
                            <AvatarFallback className="bg-primary text-white text-lg">
                              {getInitials(professional.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Nome */}
                        <h4 className="font-medium text-sm">{professional.name}</h4>
                        
                        {/* Especialidade */}
                        <p className="text-xs text-muted-foreground">
                          {professional.specialties?.name || "Sem especialidade"}
                        </p>

                        {/* Status da Foto */}
                        <div className="text-xs">
                          {professional.photo_url ? (
                            <span className="text-green-600">✅ Com foto</span>
                          ) : (
                            <span className="text-gray-500">❌ Sem foto</span>
                          )}
                        </div>

                        {/* Botão de Teste */}
                        {professional.photo_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              testPhotoUrl(professional.photo_url);
                            }}
                          >
                            Testar URL
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Detalhes do Profissional Selecionado */}
          {selectedProfessional && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detalhes do Profissional Selecionado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={selectedProfessional.photo_url || undefined} 
                      alt={selectedProfessional.name}
                    />
                    <AvatarFallback>
                      {getInitials(selectedProfessional.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{selectedProfessional.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProfessional.specialties?.name || "Sem especialidade"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">URL da Foto:</h4>
                  <div className="bg-muted p-2 rounded text-sm font-mono break-all">
                    {selectedProfessional.photo_url || "Não definida"}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Status:</h4>
                  <div className="flex items-center space-x-2">
                    {selectedProfessional.photo_url ? (
                      <>
                        <span className="text-green-600">✅</span>
                        <span>Foto definida e carregando</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">❌</span>
                        <span>Nenhuma foto definida</span>
                      </>
                    )}
                  </div>
                </div>

                {selectedProfessional.photo_url && (
                  <Button 
                    onClick={() => testPhotoUrl(selectedProfessional.photo_url)}
                    className="w-full"
                  >
                    🧪 Testar Carregamento da Foto
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
