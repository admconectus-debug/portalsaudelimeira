-- Remove doctor-related tables since we're only using professionals
DROP TABLE IF EXISTS public.clinic_doctors CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;