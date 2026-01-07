import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ScheduleSection = () => {
  const [activeTab, setActiveTab] = useState<"local" | "teleconsulta">("local");

  return (
    <section className="py-16 bg-[#1a6b6b] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Agende agora sua consulta
          </h2>
          <p className="text-white/80 mb-8">
            Mais de 950 mil especialistas de saúde estão prontos para te ajudar
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("local")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "local"
                  ? "bg-white text-[#1a6b6b]"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              📍 No local
            </button>
            <button
              onClick={() => setActiveTab("teleconsulta")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "teleconsulta"
                  ? "bg-white text-[#1a6b6b]"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              💻 Teleconsulta
            </button>
          </div>

          {/* Search Form */}
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <Input
              placeholder="especialidade, doença ou nome"
              className="flex-1 h-12 bg-white text-foreground border-0 rounded-lg"
            />
            <Input
              placeholder="São Paulo"
              className="md:w-48 h-12 bg-white text-foreground border-0 rounded-lg"
            />
            <Button 
              size="lg" 
              className="h-12 px-8 bg-[#0d9488] hover:bg-[#0d8579] text-white rounded-lg"
              asChild
            >
              <Link to="/profissionais">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};