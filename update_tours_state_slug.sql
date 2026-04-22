-- Update tours to have state_slug so they connect to state cards
-- This will make tours visible when clicking on state cards

UPDATE public.tours 
SET state_slug = 'ladakh'
WHERE slug = 'manali-leh-road-trip';

UPDATE public.tours 
SET state_slug = 'uttarakhand'
WHERE slug = 'kedarnath-yatra';

UPDATE public.tours 
SET state_slug = 'himachal-pradesh'
WHERE slug = 'kasol-manikaran-weekend';

-- Verify the updates
SELECT slug, title, state, state_slug, destination FROM public.tours;
