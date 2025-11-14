-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  image_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Active news are viewable by everyone"
ON public.news
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can insert news"
ON public.news
FOR INSERT
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can update news"
ON public.news
FOR UPDATE
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Admin can delete news"
ON public.news
FOR DELETE
USING (auth.role() = 'authenticated'::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on slug for faster lookups
CREATE INDEX idx_news_slug ON public.news(slug);

-- Create index on published_at for sorting
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);

COMMENT ON TABLE public.news IS 'Stores news articles for the portal';