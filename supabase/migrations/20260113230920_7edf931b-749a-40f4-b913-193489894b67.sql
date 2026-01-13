-- Atualizar banners das clínicas
UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop'
] WHERE id = 'b7ea47b4-ebf9-4b81-8871-2e3faba724f3'; -- Clínica Vida & Saúde

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=400&fit=crop'
] WHERE id = '05fa9a76-f35b-462f-b7cb-f18e0fbf551b'; -- OdontoCenter Limeira

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop'
] WHERE id = 'cb9890c0-70f4-4353-8adc-cca8c1392a1c'; -- Clínica Mulher

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop'
] WHERE id = '34650786-43ab-4dcf-b443-279ebedd831c'; -- FisioVida Reabilitação

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop'
] WHERE id = 'f8eadbb8-bca5-4caf-a26b-b88b6e26ffdd'; -- PediCenter Limeira

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=1200&h=400&fit=crop'
] WHERE id = '33a36aad-6474-4d9f-aed2-eb23e1db56b8'; -- Dermaclin Estética

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1666214280250-41f4c59c4b7d?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&h=400&fit=crop'
] WHERE id = '2aa0d5e4-2979-4f94-a2bd-084bec21bd4c'; -- OrtoTrauma Center

UPDATE public.clinics SET banners = ARRAY[
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=400&fit=crop'
] WHERE id = 'f02e1492-e4d6-438b-a573-cc02ec2a9349'; -- Espaço Mente Saudável

-- Atualizar banners dos profissionais (Cardiologia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=1200&h=400&fit=crop'
] WHERE id = '5f9070f3-643f-4b95-b7a7-94fb5f04c9a1'; -- Dr. Ricardo Mendes Silva

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop'
] WHERE id = 'a04a5be7-e9f1-4729-ad52-2f4a09889719'; -- Dra. Carolina Ferreira

-- Atualizar banners dos profissionais (Dermatologia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=1200&h=400&fit=crop'
] WHERE id = 'd9f247bf-1758-4458-b6de-7b305f5b604d'; -- Dra. Beatriz Costa Santos

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop'
] WHERE id = '01fe7681-bf27-4d45-9dcf-b302b72fdda2'; -- Dr. Thiago Almeida

-- Atualizar banners dos profissionais (Fisioterapia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop'
] WHERE id = 'f493f6a3-75e1-48d8-97f1-3ee46be382b6'; -- Dr. Fernando Oliveira

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1200&h=400&fit=crop'
] WHERE id = '9abb70f2-bdd0-45be-9936-51cd411754d0'; -- Dra. Juliana Martins

-- Atualizar banners dos profissionais (Ginecologia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=400&fit=crop'
] WHERE id = 'ab9bb92c-e188-42bb-a632-3ba3082a604b'; -- Dra. Mariana Souza Lima

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1200&h=400&fit=crop'
] WHERE id = 'bd0510c9-98a0-4151-bee7-03ebd081f0ad'; -- Dra. Patrícia Rodrigues

-- Atualizar banners dos profissionais (Odontologia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=400&fit=crop'
] WHERE id = '54d6767a-cf02-4521-a321-91ac1ec99344'; -- Dr. Lucas Pereira

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=400&fit=crop'
] WHERE id = '817dba96-8190-4334-9eba-149263c73f2e'; -- Dra. Amanda Gomes

-- Atualizar banners dos profissionais (Ortopedia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1666214280250-41f4c59c4b7d?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop'
] WHERE id = 'f2b63873-48df-4f51-ae31-5a7c7e480d7c'; -- Dr. Marcos Antônio Ribeiro

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop'
] WHERE id = '34292470-ca67-4518-a1de-01dd5921fbc1'; -- Dr. Rafael Cardoso

-- Atualizar banners dos profissionais (Pediatria)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576676511229-13d5b5b99a84?w=1200&h=400&fit=crop'
] WHERE id = 'a0953177-d351-4cd3-b0c5-b8d490dd9ebc'; -- Dra. Renata Vieira

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop'
] WHERE id = '4b34135d-9751-4fc5-96d7-17b0d57b88a4'; -- Dr. Bruno Teixeira

-- Atualizar banners dos profissionais (Psicologia)
UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=400&fit=crop'
] WHERE id = '0db7912c-679e-4127-8b18-f30c05a20b87'; -- Dra. Camila Nascimento

UPDATE public.professionals SET banners = ARRAY[
  'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=400&fit=crop'
] WHERE id = '3db93088-cf10-47ee-99a5-b1a4568d89f1'; -- Dr. Gabriel Santos