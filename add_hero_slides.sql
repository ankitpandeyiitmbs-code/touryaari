-- Insert sample hero slides
INSERT INTO public.hero_slides (title, subtitle, badge_text, cta_text, cta_link, image_url, video_url, is_active, sort_order, created_at) VALUES
(
  'Discover India',
  'Experience the beauty of India with our curated tours',
  'Popular',
  'Explore Tours',
  '/tours',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80',
  NULL,
  true,
  1,
  NOW()
),
(
  'Spiritual Journeys',
  'Embark on sacred pilgrimages to holy destinations',
  'Featured',
  'View Yatras',
  '/tours?category=spiritual',
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=80',
  NULL,
  true,
  2,
  NOW()
),
(
  'Adventure Awaits',
  'Thrilling road trips and mountain expeditions',
  'Adventure',
  'Start Journey',
  '/tours?category=road-trip',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  NULL,
  true,
  3,
  NOW()
);
