# 🚀 Como Configurar o Upload de Imagens

## Passo 1: Configurar o Supabase Storage

### 1.1 Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Acesse o projeto: `lsjjhavnjrllvbvovyjb`

### 1.2 Execute o SQL de Configuração
- Vá para **SQL Editor** no menu lateral
- Copie e cole o conteúdo do arquivo `SUPABASE_STORAGE_SETUP.sql`
- Clique em **Run** para executar

### 1.3 Verificar se Funcionou
- Vá para **Storage** no menu lateral
- Você deve ver o bucket `professionals` listado
- O bucket deve estar marcado como "Public"

## Passo 2: Testar o Upload

### 2.1 Acesse a Página de Admin
- Vá para `http://localhost:8080/admin`
- Faça login se necessário

### 2.2 Use a Aba de Debug
- Clique na aba **"Debug Storage"**
- Clique em **"1. Configurar Storage"**
- Clique em **"2. Testar Upload Básico"**
- Clique em **"3. Testar Upload de Imagem"**

### 2.3 Teste o Upload Real
- Vá para a aba **"Profissionais"**
- Clique em **"Adicionar Profissional"**
- Use os campos de upload de imagem
- Arraste e solte uma imagem ou clique para selecionar

## Passo 3: Verificar se Está Funcionando

### ✅ Sinais de Sucesso:
- Preview da imagem aparece imediatamente
- Upload não mostra erros
- Imagem é salva no banco de dados
- Imagem aparece na listagem de profissionais

### ❌ Problemas Comuns:

**Erro: "Bucket not found"**
- Execute o SQL de configuração no Supabase

**Erro: "Permission denied"**
- Verifique se as políticas RLS foram criadas corretamente

**Erro: "File too large"**
- Reduza o tamanho da imagem (máx 5MB para fotos, 10MB para banners)

**Erro: "Invalid file type"**
- Use apenas imagens (JPG, PNG, WebP, GIF)

## 🔧 Solução de Problemas

### Se o upload não funcionar:

1. **Abra o Console do Navegador** (F12)
2. **Verifique os erros** na aba Console
3. **Execute os testes** na aba Debug Storage
4. **Verifique as políticas** no Supabase Dashboard

### Comandos Úteis:

```sql
-- Verificar buckets
SELECT * FROM storage.buckets;

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Testar upload manual
SELECT * FROM storage.objects WHERE bucket_id = 'professionals';
```

## 📱 Funcionalidades do Upload

- **Drag & Drop**: Arraste imagens diretamente na área
- **Preview Imediato**: Vê a imagem antes de salvar
- **Validação Automática**: Apenas imagens, tamanho limitado
- **Redimensionamento**: Imagens são otimizadas automaticamente
- **Organização**: Pastas separadas para fotos e banners

## 🎯 Próximos Passos

Após configurar o storage:
1. Teste adicionando um profissional com foto
2. Verifique se a foto aparece na página pública
3. Teste editar e remover imagens
4. Configure backup das imagens se necessário
