-- Setup states and connect tours to states
-- This will create sample states and connect tours to them

-- First, check if states table exists and create sample states if needed
INSERT INTO public.states (slug, name, description, image_url, hero_image, is_active, sort_order)
VALUES 
  ('ladakh', 'Ladakh', 'Land of high passes and stunning Himalayan landscapes', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', 'https://images.unsplash.com/photo-1519883361061-b09e8d2f279f?w=1200', true, 1),
  ('uttarakhand', 'Uttarakhand', 'Sacred temples, Himalayan treks and spiritual journeys', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?w=1200', true, 2),
  ('himachal-pradesh', 'Himachal Pradesh', 'Hill stations, valleys and adventure paradise', 'https://images.unsplash.com/photo-1626010448982-9d629c1eb465?w=800', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Update tours to connect to states via state_slug
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

-- Verify the setup
SELECT 'States:' as info, slug, name FROM public.states WHERE is_active = true;
SELECT 'Tours with state_slug:' as info, slug, title, state_slug FROM public.tours WHERE state_slug IS NOT NULL;
