export interface Professional {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  whatsapp: string;
  email?: string;
  description?: string;
  photo: string;
  rating?: number;
  experience?: string;
  clinic?: string;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  professionalsCount: number;
}

export const specialties: Specialty[] = [
  {
    id: "1",
    name: "Cardiologia",
    icon: "Heart",
    description: "Cuidados com o coração e sistema cardiovascular",
    professionalsCount: 12
  },
  {
    id: "2", 
    name: "Odontologia",
    icon: "Smile",
    description: "Saúde bucal e tratamentos dentários",
    professionalsCount: 18
  },
  {
    id: "3",
    name: "Psicologia", 
    icon: "Brain",
    description: "Saúde mental e bem-estar emocional",
    professionalsCount: 15
  },
  {
    id: "4",
    name: "Fisioterapia",
    icon: "Activity", 
    description: "Reabilitação e terapia física",
    professionalsCount: 10
  },
  {
    id: "5",
    name: "Dermatologia",
    icon: "Sun",
    description: "Cuidados com a pele, cabelo e unhas", 
    professionalsCount: 8
  },
  {
    id: "6",
    name: "Pediatria",
    icon: "Baby",
    description: "Cuidados médicos para crianças",
    professionalsCount: 14
  }
];

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Dr. João Silva",
    specialty: "Cardiologia", 
    location: "Centro, São Paulo - SP",
    phone: "(11) 3456-7890",
    whatsapp: "(11) 99876-5432",
    email: "joao.silva@email.com",
    description: "Cardiologista com mais de 15 anos de experiência em procedimentos cardíacos complexos. Especialista em cateterismo e cirurgia cardiovascular.",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    experience: "15 anos",
    clinic: "Hospital Sírio-Libanês"
  },
  {
    id: "2", 
    name: "Dra. Maria Santos",
    specialty: "Pediatria",
    location: "Jardins, São Paulo - SP", 
    phone: "(11) 3234-5678",
    whatsapp: "(11) 99123-4567",
    email: "maria.santos@email.com",
    description: "Pediatra especializada em desenvolvimento infantil e vacinação. Atendimento humanizado para crianças de 0 a 12 anos.",
    photo: "https://images.unsplash.com/photo-1594824475317-1c918c11fbdf?w=300&h=300&fit=crop&crop=face",
    rating: 4.8,
    experience: "12 anos",
    clinic: "Clínica Pediátrica Santos"
  },
  {
    id: "3",
    name: "Dr. Carlos Oliveira", 
    specialty: "Odontologia",
    location: "Vila Madalena, São Paulo - SP",
    phone: "(11) 3567-8901", 
    whatsapp: "(11) 99234-5678",
    email: "carlos.oliveira@email.com",
    description: "Dentista especializado em implantodontia e estética dental. Tratamentos modernos com tecnologia de ponta.",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    rating: 4.7,
    experience: "10 anos",
    clinic: "Consultório Dr. Carlos Oliveira"
  },
  {
    id: "4",
    name: "Dra. Ana Costa",
    specialty: "Psicologia",
    location: "Ipanema, Rio de Janeiro - RJ",
    phone: "(21) 3456-7890",
    whatsapp: "(21) 99876-5432", 
    email: "ana.costa@email.com",
    description: "Psicóloga clínica especializada em terapia cognitivo-comportamental e atendimento de adultos e adolescentes.",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    experience: "8 anos",
    clinic: "Consultório Particular"
  },
  {
    id: "5",
    name: "Dr. Rafael Lima",
    specialty: "Fisioterapia", 
    location: "Barra da Tijuca, Rio de Janeiro - RJ",
    phone: "(21) 3234-5678",
    whatsapp: "(21) 99123-4567",
    email: "rafael.lima@email.com",
    description: "Fisioterapeuta especializado em reabilitação esportiva e RPG. Atendimento personalizado para atletas e pacientes em geral.",
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
    rating: 4.8,
    experience: "7 anos", 
    clinic: "Clínica de Fisioterapia Movimento"
  },
  {
    id: "6",
    name: "Dra. Luciana Ferreira",
    specialty: "Dermatologia",
    location: "Leblon, Rio de Janeiro - RJ",
    phone: "(21) 3567-8901",
    whatsapp: "(21) 99234-5678",
    email: "luciana.ferreira@email.com", 
    description: "Dermatologista especializada em dermatologia estética e cirurgia dermatológica. Tratamentos para todas as idades.",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face",
    rating: 4.9,
    experience: "11 anos",
    clinic: "Clínica Dermatológica Leblon"
  }
];