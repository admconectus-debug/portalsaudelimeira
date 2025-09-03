import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface SpecialtyCardProps {
  specialty: Specialty;
}

const SpecialtyCard = ({ specialty }: SpecialtyCardProps) => {
  // Dynamically get the icon component
  const IconComponent = Icons[specialty.icon as keyof typeof Icons] as React.ComponentType<any>;

  return (
    <Link to={`/especialidades/${specialty.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-card border-0 h-full">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary group-hover:bg-gradient-secondary transition-all duration-300">
              {IconComponent && (
                <IconComponent className="h-8 w-8 text-white" />
              )}
            </div>

            {/* Specialty Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {specialty.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {specialty.description || "Especialidade médica"}
              </p>
            </div>

            {/* Professionals Count */}
            <Badge variant="outline" className="mt-auto">
              Ver profissionais
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpecialtyCard;