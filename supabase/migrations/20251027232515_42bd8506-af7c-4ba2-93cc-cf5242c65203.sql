-- Create clinics table
CREATE TABLE public.clinics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  phone TEXT,
  email TEXT,
  schedule TEXT,
  website TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  crm TEXT,
  bio TEXT,
  photo_url TEXT,
  schedule TEXT,
  appointment_link TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinic_doctors junction table
CREATE TABLE public.clinic_doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, doctor_id)
);

-- Enable RLS on all tables
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_doctors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clinics (public read for active, admin write)
CREATE POLICY "Active clinics are viewable by everyone"
  ON public.clinics
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can insert clinics"
  ON public.clinics
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can update clinics"
  ON public.clinics
  FOR UPDATE
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete clinics"
  ON public.clinics
  FOR DELETE
  USING (auth.role() = 'authenticated'::text);

-- RLS Policies for doctors (public read for active, admin write)
CREATE POLICY "Active doctors are viewable by everyone"
  ON public.doctors
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can insert doctors"
  ON public.doctors
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can update doctors"
  ON public.doctors
  FOR UPDATE
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete doctors"
  ON public.doctors
  FOR DELETE
  USING (auth.role() = 'authenticated'::text);

-- RLS Policies for clinic_doctors (public read, admin write)
CREATE POLICY "Clinic-doctor relationships are viewable by everyone"
  ON public.clinic_doctors
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert clinic-doctor relationships"
  ON public.clinic_doctors
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete clinic-doctor relationships"
  ON public.clinic_doctors
  FOR DELETE
  USING (auth.role() = 'authenticated'::text);

-- Create triggers for updated_at
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON public.clinics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for clinic images
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinics', 'clinics', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for clinic images
CREATE POLICY "Clinic images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'clinics');

CREATE POLICY "Authenticated users can upload clinic images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'clinics' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clinic images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'clinics' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clinic images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'clinics' AND auth.role() = 'authenticated');

-- Create storage bucket for doctor photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctors', 'doctors', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for doctor photos
CREATE POLICY "Doctor photos are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'doctors');

CREATE POLICY "Authenticated users can upload doctor photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'doctors' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update doctor photos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'doctors' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete doctor photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'doctors' AND auth.role() = 'authenticated');