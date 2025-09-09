-- Create storage buckets for professional photos and banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('professionals', 'professionals', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Set up RLS policies for the professionals bucket
CREATE POLICY "Public read access for professionals bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'professionals');

CREATE POLICY "Authenticated users can upload to professionals bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update professionals bucket" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete from professionals bucket" ON storage.objects
FOR DELETE USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);
