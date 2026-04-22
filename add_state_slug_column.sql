-- Add state_slug column to tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS state_slug TEXT;

-- Update tours to have state_slug so they connect to state cards
UPDATE public.tours 
SET state_slug = 'ladakh'
WHERE slug = 'manali-leh-road-trip';

UPDATE public.tours 
SET state_slug = 'uttarakhand'
WHERE slug = 'kedarnath-yatra';

UPDATE public.tours 
SET state_slug = 'himachal-pradesh'
WHERE slug = 'kasol-manikaran-weekend';

UPDATE public.tours 
SET state_slug = 'bhutan'
WHERE slug = 'bhutan-happiness-tour';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tours_state_slug ON public.tours(state_slug);

-- Verify the updates
SELECT slug, title, state, state_slug, destination FROM public.tours;
