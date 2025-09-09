import { Link } from "react-router-dom";
import { Stethoscope, MapPin, Phone, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Portal Saúde Limeira</h1>
                <p className="text-xs text-muted-foreground">Portal de Profissionais</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Conectando você com os melhores profissionais de saúde de Limeira.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/profissionais" className="text-muted-foreground hover:text-primary transition-colors">
                  Profissionais
                </Link>
              </li>
              <li>
                <Link to="/especialidades" className="text-muted-foreground hover:text-primary transition-colors">
                  Especialidades
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-semibold mb-4">Especialidades</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Cardiologia</span>
              </li>
              <li>
                <span className="text-muted-foreground">Odontologia</span>
              </li>
              <li>
                <span className="text-muted-foreground">Psicologia</span>
              </li>
              <li>
                <span className="text-muted-foreground">Fisioterapia</span>
              </li>
              <li>
                <span className="text-muted-foreground">Dermatologia</span>
              </li>
              <li>
                <span className="text-muted-foreground">Pediatria</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Rua das Flores, 123<br />
                  Centro, Limeira - SP
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">(11) 3000-0000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">contato@portalsaudelimeira.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Portal Saúde Limeira. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>para sua saúde</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;