-- Create clinic_professionals table to associate clinics with professionals
CREATE TABLE IF NOT EXISTS public.clinic_professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, professional_id)
);

-- Enable RLS
ALTER TABLE public.clinic_professionals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clinic-professional relationships are viewable by everyone"
ON public.clinic_professionals
FOR SELECT
USING (true);

CREATE POLICY "Admin can insert clinic-professional relationships"
ON public.clinic_professionals
FOR INSERT
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete clinic-professional relationships"
ON public.clinic_professionals
FOR DELETE
USING (auth.role() = 'authenticated'::text);

-- Create index for better query performance
CREATE INDEX idx_clinic_professionals_clinic_id ON public.clinic_professionals(clinic_id);
CREATE INDEX idx_clinic_professionals_professional_id ON public.clinic_professionals(professional_id);