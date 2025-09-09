# 📸 Guia Completo - Foto de Perfil do Profissional

## ✅ Sistema Já Implementado!

O sistema de upload e exibição de fotos de perfil já está funcionando. Siga este guia para configurar e usar:

## 🚀 Configuração Inicial (Uma vez só)

### 1. Configure o Supabase Storage
1. Acesse: https://supabase.com/dashboard
2. Vá para **SQL Editor**
3. Execute este código:

```sql
-- Criar bucket para fotos de profissionais
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
```

## 📱 Como Usar o Sistema

### 1. Acesse o Admin
- Vá para: `http://localhost:8080/admin`
- Faça login se necessário

### 2. Adicionar/Editar Profissional
- Clique em **"Adicionar Profissional"** ou edite um existente
- Preencha os dados básicos (nome, especialidade, etc.)

### 3. Fazer Upload da Foto
- Na seção **"Foto de Perfil"**:
  - **Arraste e solte** uma imagem na área
  - Ou **clique** para selecionar um arquivo
  - A imagem aparecerá em preview imediatamente

### 4. Salvar
- Clique em **"Adicionar"** ou **"Atualizar"**
- A foto será salva automaticamente

### 5. Ver o Resultado
- Acesse a página pública do profissional
- A foto aparecerá no avatar do profissional

## 🎯 Funcionalidades do Sistema

### ✅ Upload de Imagem
- **Drag & Drop**: Arraste imagens diretamente
- **Clique para Selecionar**: Interface tradicional
- **Preview Imediato**: Vê a imagem antes de salvar
- **Validação**: Apenas imagens (JPG, PNG, WebP, GIF)
- **Tamanho Máximo**: 5MB por foto

### ✅ Exibição na Página
- **Avatar Grande**: 128x128px na página do profissional
- **Fallback Elegante**: Iniciais do nome se não houver foto
- **Indicador Verde**: Mostra quando há foto carregada
- **Loading State**: Indicador de carregamento
- **Error Handling**: Tratamento de erros

### ✅ Interface Responsiva
- **Mobile**: Avatar centralizado
- **Desktop**: Avatar à esquerda
- **Hover Effects**: Efeitos visuais
- **Sombras**: Design moderno

## 🔧 Solução de Problemas

### ❌ Foto não aparece na página
1. **Verifique o Console** (F12):
   - Procure por erros de carregamento
   - Verifique se a URL está correta

2. **Teste o Diagnóstico**:
   - Vá para Admin → "Diagnóstico"
   - Clique em "🔍 Testar Storage"
   - Verifique os resultados

3. **Verifique o Storage**:
   - Acesse Supabase → Storage
   - Veja se o bucket 'professionals' existe
   - Verifique se há arquivos na pasta 'photos'

### ❌ Erro no Upload
- **Arquivo muito grande**: Reduza para menos de 5MB
- **Tipo inválido**: Use apenas imagens
- **Sem permissão**: Execute o SQL de configuração

### ❌ Preview não funciona
- **JavaScript desabilitado**: Habilite no navegador
- **Arquivo corrompido**: Tente outra imagem
- **Problema de rede**: Verifique a conexão

## 📋 Checklist de Teste

- [ ] Bucket 'professionals' criado no Supabase
- [ ] Políticas RLS configuradas
- [ ] Upload de imagem funcionando
- [ ] Preview aparecendo
- [ ] Foto salva no banco de dados
- [ ] Foto aparece na página pública
- [ ] Fallback funciona quando não há foto
- [ ] Indicador verde aparece com foto

## 🎨 Personalização

### Alterar Tamanho do Avatar
No arquivo `ProfessionalProfile.tsx`, linha 132:
```tsx
<Avatar className="h-32 w-32 border-4 border-primary/20 shadow-lg">
```
Mude `h-32 w-32` para o tamanho desejado (ex: `h-24 w-24` para menor)

### Alterar Tamanho Máximo do Upload
No arquivo `ProfessionalsTab.tsx`, linha 306:
```tsx
maxSize={5} // 5MB
```

## 🚀 Próximos Passos

1. **Configure o Storage** (se ainda não fez)
2. **Teste o Upload** com uma imagem
3. **Verifique a Exibição** na página pública
4. **Personalize** conforme necessário

**O sistema está pronto para uso!** 🎉
