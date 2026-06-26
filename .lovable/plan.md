# Plano de alterações

## 1. Carrossel de Modalidades (`ModalitiesSection.tsx`)
- Remover **Hospitais** e **Serviços 24 Horas**.
- Adicionar nova modalidade **Fitness** (ícone `Dumbbell`, link `/fitness`, especialidades: Academias, Personal Trainer, Pilates, Crossfit, Yoga).
- Gerar imagem `modality-fitness.jpg`.
- Criar rota `/fitness` no `App.tsx` usando `ModalityPage` + nova entrada em `MODALITY_CONFIGS`.

## 2. Footer / Propaganda de academia
- Remover a seção **"Sobre nós"** do `Footer.tsx`.
- No lugar, exibir um **banner de propaganda de academia** (imagem + título + descrição + link), buscado de uma nova tabela `gym_ads` do Supabase (pega o primeiro ativo).
- Criar nova aba **"Propaganda"** no Admin (`Admin.tsx`) com CRUD: imagem (upload), título, descrição, link, ativo.
- Tabela `gym_ads` com RLS (leitura pública, escrita admin) + GRANTs.

## 3. Página de Clínicas (`ClinicDetail.tsx`)
- Remover o campo de **e-mail** exibido.
- Abaixo do bloco **"Sobre a clínica"**, adicionar carrossel de fotos da clínica.
  - Clicar na foto abre em um Dialog (lightbox) em tamanho grande.
  - Usar campo existente `gallery_images` da clínica se já existir; caso contrário, adicionar `gallery_images text[]` à tabela `clinics` + UI no `ClinicsTab` para gerenciar.

## 4. Cards de Profissionais (`ProfessionalCard.tsx`)
- Remover borda (`border-0`, `shadow-none` ou similar).
- Exibir a **especialidade** do profissional de forma destacada no card (já vem via `specialties.name`).

## 5. Nova página de Categorias
- Criar `src/pages/Categories.tsx`: grid (bento/blocos) com cada modalidade (mesma lista do `ModalitiesSection`, agora sem Hospitais e Serviços 24h, com Fitness).
- Cada bloco com imagem de fundo, título, ícone e link para a modalidade.
- Adicionar rota `/categorias` no `App.tsx`.
- Adicionar link "Categorias" no `Header.tsx`.

## Detalhes técnicos
- Migration Supabase:
  - `gym_ads (id, image_url, title, description, link_url, active, created_at)` com GRANTs e policies.
  - Adicionar `gallery_images text[]` em `clinics` se ainda não houver.
- Lightbox: usar o `Dialog` shadcn existente.
- Geração de imagens: `modality-fitness.jpg` (fast).
- Sem mudanças de auth/lógica de negócio fora do escopo descrito.

Posso prosseguir?
