import { Link } from "react-router-dom";
import { MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Professional {
  id: string;
  name: string;
  location: string;
  description: string | null;
  photo_url: string | null;
  specialties: { name: string } | null;
}

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
            <AvatarImage 
              src={professional.photo_url || undefined} 
              alt={professional.name}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              {getInitials(professional.name)}
            </AvatarFallback>
          </Avatar>

          {/* Professional Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {professional.name}
                </h3>
                <Badge variant="secondary" className="mt-1 mb-2">
                  {professional.specialties?.name || "Sem especialidade"}
                </Badge>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center text-muted-foreground mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{professional.location}</span>
            </div>

            {/* Description preview */}
            {professional.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {professional.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link to={`/profissionais/${professional.id}`}>
                  Ver Perfil e Contato
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;