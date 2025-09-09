# Configuração do Storage para Upload de Imagens

## Configuração do Supabase Storage

Para que o upload de imagens funcione corretamente, você precisa configurar o bucket de storage no Supabase:

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Acesse seu projeto

### 2. Configure o Storage
- Vá para a seção "Storage" no menu lateral
- Clique em "New bucket"
- Nome do bucket: `professionals`
- Marque como "Public bucket"
- File size limit: 10MB
- Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

### 3. Configure as Políticas RLS
Execute a migração SQL que está em `supabase/migrations/20250109000000_create_storage_buckets.sql` ou configure manualmente:

```sql
-- Política para leitura pública
CREATE POLICY "Public read access for professionals bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'professionals');

-- Política para upload (usuários autenticados)
CREATE POLICY "Authenticated users can upload to professionals bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

-- Política para atualização (usuários autenticados)
CREATE POLICY "Authenticated users can update professionals bucket" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

-- Política para exclusão (usuários autenticados)
CREATE POLICY "Authenticated users can delete from professionals bucket" ON storage.objects
FOR DELETE USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);
```

### 4. Teste o Upload
Após a configuração, você pode testar o upload de imagens na página de administração.

## Funcionalidades do Upload

- **Preview da imagem**: Visualização imediata após seleção
- **Validação de tipo**: Apenas arquivos de imagem são aceitos
- **Validação de tamanho**: Máximo 5MB para fotos de perfil, 10MB para banners
- **Redimensionamento automático**: Imagens são redimensionadas para otimizar o armazenamento
- **Drag & Drop**: Arraste e solte imagens diretamente na área de upload
- **Remoção**: Botão para remover a imagem selecionada

## Estrutura de Pastas

As imagens são organizadas automaticamente em:
- `photos/` - Fotos de perfil dos profissionais
- `banners/` - Banners dos profissionais

Cada arquivo recebe um nome único baseado em timestamp para evitar conflitos.
