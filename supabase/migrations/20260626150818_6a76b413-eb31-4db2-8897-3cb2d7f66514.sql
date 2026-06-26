
-- Add gallery_images to clinics
ALTER TABLE public.clinics ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}'::text[];

-- Create gym_ads table for footer advertisement
CREATE TABLE IF NOT EXISTS public.gym_ads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  link_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gym_ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_ads TO authenticated;
GRANT ALL ON public.gym_ads TO service_role;

ALTER TABLE public.gym_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active gym ads"
  ON public.gym_ads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert gym ads"
  ON public.gym_ads FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update gym ads"
  ON public.gym_ads FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete gym ads"
  ON public.gym_ads FOR DELETE TO authenticated
  USING (true);

CREATE TRIGGER update_gym_ads_updated_at
  BEFORE UPDATE ON public.gym_ads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
