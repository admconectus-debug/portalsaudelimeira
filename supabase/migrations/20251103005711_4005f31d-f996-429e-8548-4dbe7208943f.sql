-- Alterar campo banner_url para banners (array) nas tabelas clinics e professionals

-- Para clinics
ALTER TABLE public.clinics 
DROP COLUMN IF EXISTS banner_url;

ALTER TABLE public.clinics 
ADD COLUMN banners TEXT[] DEFAULT '{}';

-- Para professionals
ALTER TABLE public.professionals 
DROP COLUMN IF EXISTS banner_url;

ALTER TABLE public.professionals 
ADD COLUMN banners TEXT[] DEFAULT '{}';