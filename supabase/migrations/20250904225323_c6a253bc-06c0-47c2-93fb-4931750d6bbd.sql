-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Professionals are viewable by everyone" ON public.professionals;

-- Create separate policies for public and private data
-- Public information policy - allows everyone to see basic professional info
CREATE POLICY "Public professional info viewable by everyone" 
ON public.professionals 
FOR SELECT 
USING (true);

-- However, we need to implement column-level security since PostgreSQL RLS doesn't support column-level restrictions directly
-- We'll create a view for public data and update the frontend to use it

-- Create a public view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.professionals_public AS
SELECT 
  id,
  name,
  location,
  description,
  photo_url,
  specialty_id,
  created_at,
  updated_at
FROM public.professionals;

-- Create a function to get professional contact info (authenticated users only)
CREATE OR REPLACE FUNCTION public.get_professional_contact(professional_id uuid)
RETURNS TABLE (
  email text,
  phone text,
  whatsapp text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    professionals.email,
    professionals.phone, 
    professionals.whatsapp
  FROM professionals 
  WHERE professionals.id = professional_id
  AND auth.role() = 'authenticated';
$$;

-- Grant permissions on the public view
GRANT SELECT ON public.professionals_public TO anon, authenticated;

-- Grant execute permission on the contact function to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_professional_contact(uuid) TO authenticated;