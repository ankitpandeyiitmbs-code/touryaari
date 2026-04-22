-- Update states to replace Uttarakhand with Himachal Pradesh

-- Delete Uttarakhand state
DELETE FROM states WHERE slug = 'uttarakhand';

-- Insert Himachal Pradesh state
INSERT INTO states (name, slug, description, image_url, hero_image, sort_order)
VALUES
  ('Himachal Pradesh', 'himachal-pradesh',
   'Snow-capped Himalayas, valley treks, ancient temples and spiritual journeys',
   'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
   'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
   2)
ON CONFLICT (slug) DO NOTHING;
