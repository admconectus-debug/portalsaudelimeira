-- Criar tabela de planos/operadoras de saúde
CREATE TABLE public.health_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_particular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de relacionamento entre profissionais e planos
CREATE TABLE public.professional_health_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  health_plan_id UUID NOT NULL REFERENCES public.health_plans(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, health_plan_id)
);

-- Habilitar RLS
ALTER TABLE public.health_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_health_plans ENABLE ROW LEVEL SECURITY;

-- Políticas para health_plans
CREATE POLICY "Health plans are viewable by everyone" 
ON public.health_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can insert health plans" 
ON public.health_plans 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update health plans" 
ON public.health_plans 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete health plans" 
ON public.health_plans 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para professional_health_plans
CREATE POLICY "Professional health plans are viewable by everyone" 
ON public.professional_health_plans 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can insert professional health plans" 
ON public.professional_health_plans 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete professional health plans" 
ON public.professional_health_plans 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_health_plans_updated_at
BEFORE UPDATE ON public.health_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir planos iniciais
INSERT INTO public.health_plans (name, is_particular) VALUES
('Particular', true),
('Unimed', false),
('Padre Pio', false),
('Hapvida', false);