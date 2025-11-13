-- Add category column to clinics table
ALTER TABLE public.clinics 
ADD COLUMN category TEXT;

-- Create an index for better query performance
CREATE INDEX idx_clinics_category ON public.clinics(category);

-- Add a comment to document the column
COMMENT ON COLUMN public.clinics.category IS 'Category/type of clinic (e.g., pediatric, veterinary, beauty spa, etc.)';