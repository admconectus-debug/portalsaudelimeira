-- Add is_featured column to clinics table
ALTER TABLE public.clinics 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

-- Create index for featured clinics queries
CREATE INDEX idx_clinics_featured ON public.clinics(is_featured) WHERE is_featured = true;

-- Add comment
COMMENT ON COLUMN public.clinics.is_featured IS 'Indicates if clinic should be featured on homepage';