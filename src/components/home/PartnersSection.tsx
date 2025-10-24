import { Hospital, Activity, Microscope, Video, Stethoscope, Pill, Phone, Syringe, Users, Database } from "lucide-react";

const partners = [
  { name: "MedPrime Laboratórios", icon: Microscope },
  { name: "Vida+ Diagnósticos", icon: Activity },
  { name: "BioCare Clínicas Integradas", icon: Hospital },
  { name: "HealthLink Telessaúde", icon: Video },
  { name: "ClinLife Exames Avançados", icon: Stethoscope },
  { name: "PharmaVita Distribuidora", icon: Pill },
  { name: "DoctorOne Consultas Online", icon: Phone },
  { name: "Sanitá Vacinas & Prevenção", icon: Syringe },
  { name: "CareGroup Saúde Familiar", icon: Users },
  { name: "Hospidata Tecnologia Médica", icon: Database },
];

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-[#E9F2FB]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#3569B2' }}>
          Nossos Parceiros
        </h2>
        
        <div className="relative overflow-x-auto md:overflow-visible">
          <div className="flex gap-8 md:flex-wrap md:justify-center pb-4 md:pb-0">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 group"
              >
                <div className="w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-110">
                  <partner.icon className="w-12 h-12 text-[#3569B2]" strokeWidth={1.5} />
                </div>
                <p className="text-center mt-3 text-sm font-medium text-gray-700 w-32">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
