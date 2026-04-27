-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active hospitals are viewable by everyone"
ON public.hospitals FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can insert hospitals"
ON public.hospitals FOR INSERT
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can update hospitals"
ON public.hospitals FOR UPDATE
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete hospitals"
ON public.hospitals FOR DELETE
USING (auth.role() = 'authenticated'::text);

CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create hospitals storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hospitals', 'hospitals', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Hospital images publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'hospitals');

CREATE POLICY "Authenticated can upload hospital images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hospitals' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update hospital images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'hospitals' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete hospital images"
ON storage.objects FOR DELETE
USING (bucket_id = 'hospitals' AND auth.role() = 'authenticated');