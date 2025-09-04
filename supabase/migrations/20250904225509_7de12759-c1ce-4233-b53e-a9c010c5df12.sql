-- Remove the security definer view that's causing the warning
DROP VIEW IF EXISTS public.professionals_public;

-- The public can still access the professionals table through RLS, 
-- but we'll handle contact information filtering in the application layer