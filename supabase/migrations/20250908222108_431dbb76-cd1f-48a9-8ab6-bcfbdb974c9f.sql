-- Add banner_url column to professionals table
ALTER TABLE public.professionals 
ADD COLUMN banner_url TEXT;

-- Create storage bucket for professional banners
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true);

-- Create policies for banner uploads
CREATE POLICY "Banner images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can upload banners" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update banners" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete banners" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'banners' AND auth.role() = 'authenticated');