-- Execute este SQL no Supabase Dashboard > SQL Editor
-- para configurar o storage para upload de imagens

-- 1. Criar o bucket 'professionals' se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('professionals', 'professionals', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 2. Remover políticas existentes se houver
DROP POLICY IF EXISTS "Public read access for professionals bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to professionals bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update professionals bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from professionals bucket" ON storage.objects;

-- 3. Criar políticas RLS para o bucket 'professionals'

-- Política para leitura pública
CREATE POLICY "Public read access for professionals bucket" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'professionals');

-- Política para upload (usuários autenticados)
CREATE POLICY "Authenticated users can upload to professionals bucket" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

-- Política para atualização (usuários autenticados)
CREATE POLICY "Authenticated users can update professionals bucket" 
ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

-- Política para exclusão (usuários autenticados)
CREATE POLICY "Authenticated users can delete from professionals bucket" 
ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

-- 4. Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'professionals';

-- 5. Verificar as políticas criadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
