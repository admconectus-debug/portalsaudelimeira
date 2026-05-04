
-- Tabela genérica para estabelecimentos por modalidade (planos, farmácias, laboratórios, 24h, beleza, pets)
CREATE TABLE IF NOT EXISTS public.establishments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Limeira',
  state TEXT DEFAULT 'SP',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  schedule TEXT,
  is_24h BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category, slug)
);

CREATE INDEX IF NOT EXISTS idx_establishments_category ON public.establishments(category);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active establishments are viewable by everyone"
ON public.establishments FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can insert establishments"
ON public.establishments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update establishments"
ON public.establishments FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete establishments"
ON public.establishments FOR DELETE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_establishments_updated_at
BEFORE UPDATE ON public.establishments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed fictício (4 por categoria)
INSERT INTO public.establishments (category, name, slug, description, address, city, state, phone, whatsapp, email, website, schedule, is_24h, is_featured) VALUES
-- Planos Médicos
('planos-medicos','Unimed Limeira','unimed-limeira','Operadora de plano de saúde com ampla rede credenciada na região.','Rua Boa Morte, 850 - Centro','Limeira','SP','(19) 3404-4000','(19) 99999-1001','contato@unimedlimeira.com.br','https://www.unimedlimeira.com.br','Seg a Sex 8h-18h',false,true),
('planos-medicos','Amil Saúde','amil-saude','Plano de saúde nacional com cobertura completa em Limeira.','Av. Antônio Ometto, 1200 - Vila Claudia','Limeira','SP','(19) 3441-2200','(19) 99999-1002','atendimento@amil.com.br','https://www.amil.com.br','Seg a Sex 8h-17h',false,false),
('planos-medicos','SulAmérica','sulamerica','Cobertura ampla com hospitais e laboratórios parceiros.','Rua São João, 450 - Centro','Limeira','SP','(19) 3451-7700','(19) 99999-1003','contato@sulamerica.com.br','https://www.sulamerica.com.br','Seg a Sex 9h-18h',false,false),
('planos-medicos','Hapvida NotreDame','hapvida','Plano de saúde com rede própria e atendimento humanizado.','Rua XV de Novembro, 300 - Centro','Limeira','SP','(19) 3422-5500','(19) 99999-1004','contato@hapvida.com.br','https://www.hapvida.com.br','Seg a Sex 8h-18h',false,false),

-- Serviços 24 Horas
('servicos-24h','Pronto Socorro Central','ps-central','Atendimento de urgência e emergência 24 horas por dia.','Rua Senador Vergueiro, 520 - Centro','Limeira','SP','(19) 3404-9000','(19) 99999-2001','urgencia@pscentral.com.br',NULL,'24 horas',true,true),
('servicos-24h','Drogaria 24h Limeira','drogaria-24h','Farmácia aberta 24h com entrega rápida.','Av. Campinas, 1500 - Vila Industrial','Limeira','SP','(19) 3441-0000','(19) 99999-2002',NULL,'https://drogaria24h.com.br','24 horas',true,false),
('servicos-24h','Lab Express 24h','lab-express-24h','Coletas e exames laboratoriais 24 horas.','Rua Barão de Cascalho, 700 - Centro','Limeira','SP','(19) 3451-0011','(19) 99999-2003','contato@labexpress.com.br',NULL,'24 horas',true,false),
('servicos-24h','UPA Vila Queiroz 24h','upa-24h','Unidade de Pronto Atendimento - SUS, atendimento contínuo.','Av. Bélgica, 1100 - Vila Queiroz','Limeira','SP','(19) 3404-5500',NULL,NULL,NULL,'24 horas',true,false),

-- Laboratórios
('laboratorios','Laboratório São Lucas','lab-sao-lucas','Análises clínicas e exames de imagem com tecnologia avançada.','Rua Boa Morte, 1020 - Centro','Limeira','SP','(19) 3441-1212','(19) 99999-3001','contato@saolucas.com.br','https://labsaolucas.com.br','Seg a Sáb 6h-18h',false,true),
('laboratorios','Lab Diagnose','lab-diagnose','Exames laboratoriais com coleta domiciliar.','Av. Antônio Ometto, 800','Limeira','SP','(19) 3442-3030','(19) 99999-3002','contato@diagnose.com.br','https://diagnose.com.br','Seg a Sex 6h30-17h',false,false),
('laboratorios','CEDIL Centro Diagnóstico','cedil','Exames de imagem: ultrassom, ressonância e tomografia.','Rua São João, 980','Limeira','SP','(19) 3451-4040','(19) 99999-3003','contato@cedil.com.br','https://cedil.com.br','Seg a Sex 7h-19h',false,false),
('laboratorios','Bioanalises Limeira','bioanalises','Laboratório de análises clínicas e patologia.','Rua Senador Vergueiro, 250','Limeira','SP','(19) 3422-2020','(19) 99999-3004','contato@bioanalises.com.br',NULL,'Seg a Sáb 7h-17h',false,false),

-- Farmácias
('farmacias','Drogaria São Paulo','drogaria-sp','Rede de farmácias com ampla variedade de medicamentos.','Av. Campinas, 2100','Limeira','SP','(19) 3441-7070','(19) 99999-4001',NULL,'https://drogariasaopaulo.com.br','Seg a Dom 7h-23h',false,true),
('farmacias','Drogasil Limeira','drogasil','Medicamentos, perfumaria e conveniência.','Rua Boa Morte, 540','Limeira','SP','(19) 3442-8080','(19) 99999-4002',NULL,'https://drogasil.com.br','Seg a Dom 7h-22h',false,false),
('farmacias','Farmácia Manipulação Vida','farmacia-vida','Farmácia de manipulação - fórmulas personalizadas.','Rua XV de Novembro, 410','Limeira','SP','(19) 3451-9090','(19) 99999-4003','contato@farmaciavida.com.br',NULL,'Seg a Sex 8h-18h, Sáb 8h-12h',false,false),
('farmacias','Pague Menos','pague-menos','Medicamentos com os melhores preços da região.','Av. Bélgica, 700','Limeira','SP','(19) 3404-6060','(19) 99999-4004',NULL,'https://paguemenos.com.br','Seg a Dom 7h-22h',false,false),

-- Saúde & Beleza
('saude-beleza','Espaço Bem-Estar','espaco-bem-estar','Estética facial, corporal e tratamentos relaxantes.','Rua Boa Morte, 1500','Limeira','SP','(19) 3441-5050','(19) 99999-5001','contato@bemestar.com.br',NULL,'Seg a Sáb 9h-19h',false,true),
('saude-beleza','Studio Pilates Limeira','studio-pilates','Pilates, fisioterapia e reabilitação postural.','Av. Antônio Ometto, 1500','Limeira','SP','(19) 3442-6060','(19) 99999-5002','studio@pilates.com.br',NULL,'Seg a Sex 6h-21h',false,false),
('saude-beleza','Nutri Saudável','nutri-saudavel','Consultoria nutricional personalizada e reeducação alimentar.','Rua São João, 670','Limeira','SP','(19) 3451-7070','(19) 99999-5003','contato@nutrisaudavel.com.br',NULL,'Seg a Sex 8h-18h',false,false),
('saude-beleza','Clínica Estética Renova','renova','Procedimentos estéticos avançados com tecnologia de ponta.','Rua XV de Novembro, 880','Limeira','SP','(19) 3422-8080','(19) 99999-5004','contato@renova.com.br',NULL,'Seg a Sáb 9h-19h',false,false),

-- Saúde Pets
('saude-pets','Clínica Vet Amigo Fiel','vet-amigo-fiel','Clínica veterinária 24h com cirurgia e internação.','Av. Bélgica, 1300','Limeira','SP','(19) 3441-9090','(19) 99999-6001','contato@amigofiel.com.br',NULL,'24 horas',true,true),
('saude-pets','Pet Shop Mundo Animal','mundo-animal','Banho, tosa e produtos para pets.','Rua Boa Morte, 1700','Limeira','SP','(19) 3442-1010','(19) 99999-6002','contato@mundoanimal.com.br',NULL,'Seg a Sáb 8h-19h',false,false),
('saude-pets','Hospital Veterinário São Francisco','vet-sao-francisco','Hospital veterinário completo com exames e cirurgias.','Av. Campinas, 900','Limeira','SP','(19) 3451-2020','(19) 99999-6003','contato@vetsaofrancisco.com.br',NULL,'Seg a Sáb 8h-20h',false,false),
('saude-pets','Banho & Tosa Pet Style','pet-style','Estética animal com profissionais qualificados.','Rua Senador Vergueiro, 880','Limeira','SP','(19) 3404-3030','(19) 99999-6004',NULL,NULL,'Ter a Sáb 9h-18h',false,false);
