-- Remove authentication requirement from get_professional_contact function
-- to make contact information publicly accessible
CREATE OR REPLACE FUNCTION public.get_professional_contact(professional_id uuid)
 RETURNS TABLE(id uuid, email text, phone text, whatsapp text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT 
    professionals.id,
    professionals.email,
    professionals.phone, 
    professionals.whatsapp
  FROM professionals 
  WHERE professionals.id = professional_id;
$function$