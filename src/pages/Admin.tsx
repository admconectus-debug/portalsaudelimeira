import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { ProfessionalsTab } from "@/components/admin/ProfessionalsTab";
import { SpecialtiesTab } from "@/components/admin/SpecialtiesTab";
import { PartnersTab } from "@/components/admin/PartnersTab";
import { ClinicsTab } from "@/components/admin/ClinicsTab";
import { NewsTab } from "@/components/admin/NewsTab";

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background border-b shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie profissionais e especialidades</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento do Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clinics" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="clinics">Clínicas</TabsTrigger>
                <TabsTrigger value="professionals">Profissionais</TabsTrigger>
                <TabsTrigger value="specialties">Especialidades</TabsTrigger>
                <TabsTrigger value="partners">Parceiros</TabsTrigger>
                <TabsTrigger value="news">Notícias</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clinics">
                <ClinicsTab />
              </TabsContent>
              
              <TabsContent value="professionals">
                <ProfessionalsTab />
              </TabsContent>
              
              <TabsContent value="specialties">
                <SpecialtiesTab />
              </TabsContent>
              
              <TabsContent value="partners">
                <PartnersTab />
              </TabsContent>
              
              <TabsContent value="news">
                <NewsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}