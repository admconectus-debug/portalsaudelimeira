# 🚀 Configuração Rápida do Storage

## ⚡ Solução em 3 Passos

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Acesse o projeto: `lsjjhavnjrllvbvovyjb`

### 2. Execute o SQL de Configuração
- Vá para **SQL Editor** (menu lateral)
- Copie e cole o código abaixo:

```sql
-- Criar bucket professionals
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('professionals', 'professionals', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso
CREATE POLICY "Public read access for professionals bucket" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'professionals');

CREATE POLICY "Authenticated users can upload to professionals bucket" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update professionals bucket" 
ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete from professionals bucket" 
ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'professionals' 
  AND auth.role() = 'authenticated'
);
```

- Clique em **Run** para executar

### 3. Teste no Site
- Acesse: `http://localhost:8080/admin`
- Vá para a aba **"Diagnóstico"**
- Clique em **"🔍 Testar Storage"**
- Verifique os resultados

## ✅ Verificações

### Se aparecer "✅ Bucket 'professionals' encontrado!"
- O storage está configurado corretamente
- Pode fazer upload de imagens

### Se aparecer "❌ Bucket 'professionals' não encontrado!"
- Execute o SQL novamente
- Verifique se não há erros no console

### Se aparecer "❌ Erro ao listar arquivos"
- As políticas RLS podem estar incorretas
- Execute o SQL das políticas novamente

## 🔧 Problemas Comuns

**Erro: "permission denied"**
- Execute as políticas RLS novamente

**Erro: "bucket not found"**
- Execute a criação do bucket novamente

**Erro: "file too large"**
- Reduza o tamanho da imagem (máx 10MB)

**Erro: "invalid file type"**
- Use apenas imagens (JPG, PNG, WebP, GIF)

## 📱 Teste Final

1. Vá para **"Profissionais"** → **"Adicionar Profissional"**
2. Faça upload de uma imagem
3. Salve o profissional
4. Acesse a página pública do profissional
5. Verifique se a imagem aparece

## 🆘 Se Ainda Não Funcionar

1. Abra o Console do Navegador (F12)
2. Vá para a aba **"Diagnóstico"**
3. Clique em **"🔍 Testar Storage"**
4. Copie os logs e me envie
