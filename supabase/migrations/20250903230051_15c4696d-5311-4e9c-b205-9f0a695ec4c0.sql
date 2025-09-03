-- Create specialties table
CREATE TABLE public.specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create professionals table
CREATE TABLE public.professionals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  specialty_id uuid REFERENCES public.specialties(id) ON DELETE SET NULL,
  email text,
  phone text,
  whatsapp text,
  location text NOT NULL,
  description text,
  photo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Specialties are viewable by everyone" 
ON public.specialties 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals are viewable by everyone" 
ON public.professionals 
FOR SELECT 
USING (true);

-- Admin-only policies (will be restricted to authenticated admin users)
CREATE POLICY "Admin can insert specialties" 
ON public.specialties 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update specialties" 
ON public.specialties 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete specialties" 
ON public.specialties 
FOR DELETE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert professionals" 
ON public.professionals 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update professionals" 
ON public.professionals 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete professionals" 
ON public.professionals 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_specialties_updated_at
  BEFORE UPDATE ON public.specialties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial specialties
INSERT INTO public.specialties (name, description, icon) VALUES
  ('Cardiologia', 'Cuidados com o coração e sistema cardiovascular', 'Heart'),
  ('Dermatologia', 'Cuidados com a pele, cabelo e unhas', 'Stethoscope'),
  ('Odontologia', 'Cuidados com dentes e saúde bucal', 'Smile'),
  ('Psicologia', 'Cuidados com a saúde mental e bem-estar', 'Brain'),
  ('Fisioterapia', 'Reabilitação e cuidados com movimentos', 'Activity'),
  ('Pediatria', 'Cuidados médicos para crianças', 'Baby'),
  ('Ginecologia', 'Saúde da mulher e sistema reprodutivo', 'User'),
  ('Ortopedia', 'Cuidados com ossos, músculos e articulações', 'Bone');