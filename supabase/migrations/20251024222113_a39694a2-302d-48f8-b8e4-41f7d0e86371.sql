-- Create partners table
CREATE TABLE public.partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  company_name text NOT NULL,
  description text,
  business_area text NOT NULL,
  logo_url text,
  website_url text,
  is_active boolean NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Partners are viewable by everyone"
  ON public.partners
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can insert partners"
  ON public.partners
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can update partners"
  ON public.partners
  FOR UPDATE
  USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete partners"
  ON public.partners
  FOR DELETE
  USING (auth.role() = 'authenticated'::text);

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('partners', 'partners', true);

-- Storage policies for partner logos
CREATE POLICY "Partner logos are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'partners');

CREATE POLICY "Authenticated users can upload partner logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'partners' 
    AND auth.role() = 'authenticated'::text
  );

CREATE POLICY "Authenticated users can update partner logos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'partners' 
    AND auth.role() = 'authenticated'::text
  );

CREATE POLICY "Authenticated users can delete partner logos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'partners' 
    AND auth.role() = 'authenticated'::text
  );