import { useEffect, useState } from "react";
import { Hospital, Activity, Microscope, Video, Stethoscope, Pill, Phone, Syringe, Users, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  company_name: string;
  description: string | null;
  business_area: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
}

const iconMap: Record<string, any> = {
  "Laboratório": Microscope,
  "Clínica": Hospital,
  "Telessaúde": Video,
  "Distribuidora": Pill,
  "Farmácia": Pill,
  "Diagnóstico": Activity,
  "Hospital": Hospital,
  "Tecnologia Médica": Database,
  "Vacinas": Syringe,
  "Outros": Users,
};

export const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("company_name");

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-[#E9F2FB]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#3569B2' }}>
            Nossos Parceiros
          </h2>
          <div className="text-center py-8">
            <div className="animate-pulse">Carregando parceiros...</div>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="py-16 bg-[#E9F2FB]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#3569B2' }}>
            Nossos Parceiros
          </h2>
          <p className="text-center text-gray-600">
            Nenhum parceiro cadastrado no momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white border-t">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-medium text-center mb-8 uppercase tracking-wide text-muted-foreground">
          Parceiros
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {partners.map((partner) => {
            const IconComponent = iconMap[partner.business_area] || Users;
            
            return (
              <a
                key={partner.id}
                href={partner.website_url || undefined}
                target={partner.website_url ? "_blank" : undefined}
                rel={partner.website_url ? "noopener noreferrer" : undefined}
                className="group"
                title={partner.description || partner.company_name}
              >
                <div className="w-28 h-16 md:w-36 md:h-20 bg-white border rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md hover:border-primary/30 overflow-hidden px-3">
                  {partner.logo_url ? (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.company_name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent className="w-6 h-6 text-primary" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-muted-foreground truncate max-w-full">
                        {partner.company_name}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
