-- Add All 16 Tour Packages
-- Run this after deleting all existing tours

-- Short Getaways & Treks (3 Days)

-- 1. Kasol and Kheerganga Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'kasol-kheerganga-tour-3-days',
  'Kasol and Kheerganga Tour Package',
  'trekking',
  'Kasol',
  3,
  2,
  7875,
  9500,
  'Experience the magical journey through the Parvati Valley with this 3-day trek to Kheerganga. Explore the hippie paradise of Kasol, trek through lush forests, and relax in the natural hot springs of Kheerganga.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Arrival in Kasol", "description": "Arrive in Kasol, check into your hotel, explore the local market, and enjoy the riverside cafes. Evening bonfire and dinner.", "activities": ["Check-in", "Market Exploration", "Bonfire"]},
    {"day": 2, "title": "Trek to Kheerganga", "description": "Start early morning trek from Kasol to Kheerganga (12km). Enjoy scenic views of Parvati Valley. Reach Kheerganga by evening, relax in natural hot springs.", "activities": ["Trekking", "Hot Springs", "Camping"]},
    {"day": 3, "title": "Return to Kasol & Departure", "description": "Morning breakfast at Kheerganga, trek back to Kasol. Freshen up and depart with beautiful memories.", "activities": ["Trekking", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals (breakfast, lunch, dinner)', 'Trek guide', 'Hot springs access', 'Bonfire'],
  ARRAY['Personal expenses', 'Transport to/from Kasol', 'Any personal gear'],
  ARRAY['Natural hot springs', 'Parvati Valley views', 'Hippie culture experience', 'Scenic trek'],
  ARRAY['Comfortable trekking shoes', 'Warm clothes', 'Rain jacket', 'Water bottle', 'Personal medication'],
  ARRAY['Trekking', 'Camping', 'Bonfire', 'Nature Photography'],
  'March to June, September to November',
  true,
  true,
  true
);

-- 2. Mcleodganj and Triund Trek
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'mcleodganj-triund-trek-3-days',
  'Mcleodganj and Triund Trek',
  'trekking',
  'Mcleodganj',
  3,
  2,
  7875,
  9500,
  'A perfect 3-day getaway to the Himalayas. Explore the spiritual town of Mcleodganj, visit the Dalai Lama Temple, and trek to the stunning Triund peak for breathtaking views of the Dhauladhar range.',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
  ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'],
  '[
    {"day": 1, "title": "Arrival in Mcleodganj", "description": "Arrive in Mcleodganj, check into hotel. Visit Dalai Lama Temple, Bhagsu Waterfall, and explore the Tibetan market.", "activities": ["Temple Visit", "Waterfall Visit", "Market Exploration"]},
    {"day": 2, "title": "Triund Trek", "description": "Early morning trek to Triund (9km). Enjoy panoramic views of Dhauladhar range. Overnight camping at Triund with stargazing.", "activities": ["Trekking", "Camping", "Stargazing"]},
    {"day": 3, "title": "Return & Departure", "description": "Sunrise view from Triund, trek back to Mcleodganj. Breakfast and departure.", "activities": ["Sunrise View", "Trekking", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Trek guide', 'Camping equipment', 'Bonfire'],
  ARRAY['Personal expenses', 'Transport to/from Mcleodganj', 'Personal gear'],
  ARRAY['Dhauladhar mountain views', 'Tibetan culture', 'Triund summit', 'Bhagsu Waterfall'],
  ARRAY['Trekking shoes', 'Warm layers', 'Rain gear', 'Sunscreen', 'Water bottle'],
  ARRAY['Trekking', 'Camping', 'Sightseeing', 'Photography'],
  'March to June, September to November',
  true,
  true,
  true
);

-- 3. Manali & Lahaul Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'manali-lahaul-tour-3-days',
  'Manali & Lahaul Tour Package',
  'road-trip',
  'Manali',
  3,
  2,
  7875,
  9500,
  'Explore the breathtaking beauty of Manali and the stunning Lahaul Valley. Visit Rohtang Pass, Solang Valley, and experience the adventure of a lifetime in the Himalayas.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Arrival in Manali", "description": "Arrive in Manali, check into hotel. Visit Hadimba Temple, Manu Temple, and Old Manali. Evening at Mall Road.", "activities": ["Temple Visit", "Mall Road", "Local Exploration"]},
    {"day": 2, "title": "Rohtang Pass & Solang Valley", "description": "Full day excursion to Rohtang Pass (subject to weather) and Solang Valley. Enjoy adventure activities like paragliding, zorbing.", "activities": ["Sightseeing", "Adventure Activities", "Snow Point"]},
    {"day": 3, "title": "Lahaul Valley & Departure", "description": "Drive to Lahaul Valley, visit Keylong and Sissu. Return to Manali and depart.", "activities": ["Valley Exploration", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotel', 'All meals', 'Transportation', 'Driver', 'Sightseeing'],
  ARRAY['Personal expenses', 'Adventure activities cost', 'Monument entry fees'],
  ARRAY['Rohtang Pass', 'Solang Valley', 'Lahaul Valley', 'Adventure activities'],
  ARRAY['Warm clothes', 'Sunscreen', 'Sunglasses', 'Camera', 'Personal medication'],
  ARRAY['Sightseeing', 'Adventure Activities', 'Road Trip', 'Photography'],
  'May to October',
  true,
  false,
  true
);

-- 4. Jibhi & Tirthan Valley Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'jibhi-tirthan-valley-tour-3-days',
  'Jibhi & Tirthan Valley Tour Package',
  'road-trip',
  'Jibhi',
  3,
  2,
  7875,
  9500,
  'Discover the hidden gem of Himachal - Jibhi and Tirthan Valley. Experience pristine rivers, ancient temples, waterfalls, and the peaceful Himalayan life.',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
  ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'],
  '[
    {"day": 1, "title": "Arrival in Jibhi", "description": "Arrive in Jibhi, check into riverside camp. Explore Jibhi village, visit the famous Jibhi Waterfall. Evening bonfire by the river.", "activities": ["Check-in", "Waterfall Visit", "Bonfire"]},
    {"day": 2, "title": "Tirthan Valley Exploration", "description": "Drive to Tirthan Valley, visit Great Himalayan National Park gateway. Trout fishing, Jalori Pass visit, and Serolsar Lake trek.", "activities": ["Valley Exploration", "Trekking", "Fishing"]},
    {"day": 3, "title": "Local Temples & Departure", "description": "Visit ancient temples in the area, explore local culture. Check out and depart with memories.", "activities": ["Temple Visit", "Local Exploration", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Guide', 'Bonfire'],
  ARRAY['Personal expenses', 'Fishing gear cost', 'Transport to/from Jibhi'],
  ARRAY['Jibhi Waterfall', 'Tirthan Valley', 'Jalori Pass', 'Serolsar Lake', 'Trout fishing'],
  ARRAY['Comfortable shoes', 'Warm clothes', 'Rain jacket', 'Swimwear', 'Camera'],
  ARRAY['Trekking', 'Fishing', 'Sightseeing', 'Camping'],
  'April to June, September to November',
  false,
  true,
  true
);

-- Mid-Range Explorations (5-7 Days)

-- 5. Mcleodganj Bir Tirthan Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'mcleodganj-bir-tirthan-tour-5-days',
  'Mcleodganj Bir Tirthan Tour Package',
  'road-trip',
  'Mcleodganj',
  5,
  4,
  21000,
  25000,
  'A comprehensive 5-day journey covering the spiritual town of Mcleodganj, adventure paradise Bir Billing (paragliding capital), and the serene Tirthan Valley.',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
  ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'],
  '[
    {"day": 1, "title": "Arrival in Mcleodganj", "description": "Arrive in Mcleodganj, check into hotel. Visit Dalai Lama Temple and Tibetan Market.", "activities": ["Temple Visit", "Market Exploration"]},
    {"day": 2, "title": "Triund Trek", "description": "Full day trek to Triund peak. Enjoy panoramic Dhauladhar views and camping overnight.", "activities": ["Trekking", "Camping", "Photography"]},
    {"day": 3, "title": "Drive to Bir Billing", "description": "Drive to Bir Billing, the paragliding capital. Evening explore the Tibetan colony.", "activities": ["Road Trip", "Paragliding", "Exploration"]},
    {"day": 4, "title": "Paragliding & Tirthan Valley", "description": "Morning paragliding at Bir Billing. Drive to Tirthan Valley in evening.", "activities": ["Paragliding", "Road Trip", "Nature Walk"]},
    {"day": 5, "title": "Tirthan Valley & Departure", "description": "Explore Tirthan Valley, visit waterfalls and Great Himalayan National Park. Depart from Tirthan.", "activities": ["Valley Exploration", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Paragliding cost', 'Guide'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Personal gear'],
  ARRAY['Triund Trek', 'Bir Billing Paragliding', 'Tirthan Valley', 'Dhauladhar views'],
  ARRAY['Trekking shoes', 'Warm clothes', 'Comfortable clothes', 'Sunscreen', 'Camera'],
  ARRAY['Trekking', 'Paragliding', 'Road Trip', 'Sightseeing'],
  'March to June, September to November',
  true,
  true,
  true
);

-- 6. Spiti Valley Short Escape
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'spiti-valley-short-escape-6-days',
  'Spiti Valley Short Escape',
  'road-trip',
  'Spiti Valley',
  6,
  5,
  17325,
  21000,
  'A thrilling 6-day expedition to the cold desert of Spiti Valley. Visit ancient monasteries, high-altitude villages, and experience the unique culture of this Himalayan region.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Manali to Kaza", "description": "Drive from Manali to Kaza via Rohtang Pass and Kunzum Pass. Overnight in Kaza.", "activities": ["Road Trip", "High Pass Crossing"]},
    {"day": 2, "title": "Kaza Local Sightseeing", "description": "Visit Key Monastery, Kibber Village (highest motorable village), and Gette Village.", "activities": ["Monastery Visit", "Village Exploration"]},
    {"day": 3, "title": "Kaza to Chandratal", "description": "Drive to Chandratal Lake. Camping near the lake under the stars.", "activities": ["Lake Visit", "Camping", "Photography"]},
    {"day": 4, "title": "Chandratal to Losar", "description": "Morning at Chandratal, drive to Losar village. Explore local culture.", "activities": ["Village Exploration", "Cultural Experience"]},
    {"day": 5, "title": "Losar to Manali", "description": "Drive back to Manali via Kunzum Pass and Rohtang Pass. Overnight in Manali.", "activities": ["Road Trip", "Scenic Views"]},
    {"day": 6, "title": "Manali Departure", "description": "Morning sightseeing in Manali, then departure.", "activities": ["Sightseeing", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Driver', 'Camping equipment'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Personal gear'],
  ARRAY['Chandratal Lake', 'Key Monastery', 'Kibber Village', 'Kunzum Pass'],
  ARRAY['Warm clothes (layers)', 'Sunscreen', 'Sunglasses', 'Lip balm', 'Water bottle'],
  ARRAY['Road Trip', 'Camping', 'Sightseeing', 'Photography'],
  'June to September',
  true,
  true,
  true
);

-- 7. Manali Kasol Jibhi Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'manali-kasol-jibhi-tour-6-days',
  'Manali Kasol Jibhi Tour Package',
  'road-trip',
  'Manali',
  6,
  5,
  14175,
  17000,
  'Experience the best of Himachal in 6 days - from the adventure hub Manali, to the hippie paradise Kasol, to the hidden gem Jibhi.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Arrival in Manali", "description": "Arrive in Manali, check into hotel. Visit Hadimba Temple and Mall Road.", "activities": ["Temple Visit", "Mall Road"]},
    {"day": 2, "title": "Manali Local & Solang", "description": "Full day sightseeing in Manali including Solang Valley, Vashisht Hot Springs.", "activities": ["Sightseeing", "Hot Springs", "Adventure Activities"]},
    {"day": 3, "title": "Manali to Kasol", "description": "Drive to Kasol. Explore the hippie village and riverside cafes.", "activities": ["Road Trip", "Village Exploration"]},
    {"day": 4, "title": "Kasol to Kheerganga Trek", "description": "Trek to Kheerganga, enjoy hot springs and camping overnight.", "activities": ["Trekking", "Hot Springs", "Camping"]},
    {"day": 5, "title": "Kheerganga to Jibhi", "description": "Trek back to Kasol, drive to Jibhi. Explore Jibhi Waterfall.", "activities": ["Trekking", "Road Trip", "Waterfall Visit"]},
    {"day": 6, "title": "Jibhi to Manali & Departure", "description": "Morning in Jibhi, drive to Manali for departure.", "activities": ["Nature Walk", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Trek guide', 'Bonfire'],
  ARRAY['Personal expenses', 'Adventure activities cost', 'Personal gear'],
  ARRAY['Kheerganga Trek', 'Kasol Hippie Culture', 'Jibhi Waterfall', 'Solang Valley'],
  ARRAY['Trekking shoes', 'Warm clothes', 'Rain jacket', 'Swimwear', 'Camera'],
  ARRAY['Trekking', 'Road Trip', 'Camping', 'Sightseeing'],
  'April to June, September to November',
  false,
  true,
  true
);

-- 8. Dalhousie Dharamshala Amritsar Tour
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'dalhousie-dharamshala-amritsar-tour-6-days',
  'Dalhousie Dharamshala Amritsar Tour',
  'road-trip',
  'Dalhousie',
  6,
  5,
  23625,
  28000,
  'A perfect blend of hill stations and spiritual destinations. Explore the colonial charm of Dalhousie, the spiritual town of Dharamshala, and the holy city of Amritsar.',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
  ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'],
  '[
    {"day": 1, "title": "Arrival in Dalhousie", "description": "Arrive in Dalhousie, check into hotel. Explore Mall Road and Gandhi Chowk.", "activities": ["Check-in", "Mall Road", "Local Exploration"]},
    {"day": 2, "title": "Dalhousie Sightseeing", "description": "Visit Khajjiar (Mini Switzerland), Panchpula, and Dainkund Peak.", "activities": ["Sightseeing", "Nature Walk", "Photography"]},
    {"day": 3, "title": "Dalhousie to Dharamshala", "description": "Drive to Dharamshala/Mcleodganj. Visit Dalai Lama Temple and Bhagsu Nag.", "activities": ["Road Trip", "Temple Visit"]},
    {"day": 4, "title": "Dharamshala to Amritsar", "description": "Drive to Amritsar. Evening visit to Golden Temple for Wagah Border ceremony.", "activities": ["Road Trip", "Golden Temple", "Wagah Border"]},
    {"day": 5, "title": "Amritsar Sightseeing", "description": "Visit Jallianwala Bagh, Durgiana Temple, and local markets. Evening at Golden Temple.", "activities": ["Sightseeing", "Temple Visit", "Market Exploration"]},
    {"day": 6, "title": "Departure", "description": "Morning breakfast and departure from Amritsar.", "activities": ["Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotels', 'All meals', 'Transportation', 'Driver', 'Guide'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Shopping'],
  ARRAY['Khajjiar (Mini Switzerland)', 'Golden Temple', 'Wagah Border', 'Dalai Lama Temple'],
  ARRAY['Comfortable clothes', 'Modest clothing for temples', 'Camera', 'Sunscreen'],
  ARRAY['Sightseeing', 'Temple Visit', 'Road Trip', 'Photography'],
  'March to June, September to November',
  true,
  true,
  true
);

-- 9. Spiti Valley Family Escape
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'spiti-valley-family-escape-6-days',
  'Spiti Valley Family Escape',
  'road-trip',
  'Spiti Valley',
  6,
  5,
  31500,
  38000,
  'A family-friendly Spiti Valley tour with comfortable accommodations and moderate pace. Perfect for families wanting to experience the magic of Spiti without extreme adventure.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Manali to Kaza", "description": "Drive from Manali to Kaza via Rohtang Pass. Comfortable overnight stay in Kaza hotel.", "activities": ["Road Trip", "Hotel Stay"]},
    {"day": 2, "title": "Kaza Local Exploration", "description": "Visit Key Monastery, Kibber Village, and local markets. Easy-paced sightseeing.", "activities": ["Monastery Visit", "Village Visit", "Shopping"]},
    {"day": 3, "title": "Kaza to Chandratal", "description": "Drive to Chandratal Lake with comfortable stay options nearby.", "activities": ["Lake Visit", "Photography"]},
    {"day": 4, "title": "Chandratal to Losar", "description": "Morning at Chandratal, drive to Losar. Experience local homestay culture.", "activities": ["Cultural Experience", "Village Stay"]},
    {"day": 5, "title": "Losar to Manali", "description": "Scenic drive back to Manali with stops at beautiful viewpoints.", "activities": ["Road Trip", "Photography"]},
    {"day": 6, "title": "Manali Departure", "description": "Morning leisure in Manali, departure.", "activities": ["Leisure Time", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotels/homestays', 'All meals', 'Transportation', 'Driver', 'Guide'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Personal gear'],
  ARRAY['Chandratal Lake', 'Key Monastery', 'Kibber Village', 'Spiti Culture'],
  ARRAY['Warm clothes', 'Comfortable shoes', 'Sunscreen', 'Medication', 'Water bottle'],
  ARRAY['Road Trip', 'Sightseeing', 'Cultural Experience', 'Photography'],
  'June to September',
  true,
  false,
  true
);

-- 10. Spiti Valley Circuit Group Trip
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'spiti-valley-circuit-group-trip-7-days',
  'Spiti Valley Circuit Group Trip',
  'road-trip',
  'Spiti Valley',
  7,
  6,
  25200,
  30000,
  'Join a group adventure to explore the complete Spiti Valley circuit. Perfect for solo travelers and those looking to make new friends while exploring the Himalayas.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Manali to Kaza", "description": "Group departure from Manali to Kaza. Team bonding activities en route.", "activities": ["Road Trip", "Group Activities"]},
    {"day": 2, "title": "Kaza Local", "description": "Explore Kaza town, Key Monastery, and Kibber Village together.", "activities": ["Group Sightseeing", "Monastery Visit"]},
    {"day": 3, "title": "Kaza to Chandratal", "description": "Drive to Chandratal Lake. Group camping and bonfire night.", "activities": ["Lake Visit", "Group Camping", "Bonfire"]},
    {"day": 4, "title": "Chandratal to Losar", "description": "Morning at lake, drive to Losar. Village exploration with group.", "activities": ["Village Exploration", "Group Activities"]},
    {"day": 5, "title": "Losar to Pin Valley", "description": "Explore Pin Valley National Park and Mud Village.", "activities": ["National Park Visit", "Village Exploration"]},
    {"day": 6, "title": "Pin Valley to Manali", "description": "Drive back to Manali via scenic route. Group dinner in Manali.", "activities": ["Road Trip", "Group Dinner"]},
    {"day": 7, "title": "Departure", "description": "Morning group breakfast, farewells, and departure.", "activities": ["Group Breakfast", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Group leader', 'Bonfire'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Personal gear'],
  ARRAY['Chandratal Lake', 'Pin Valley', 'Group Experience', 'Complete Spiti Circuit'],
  ARRAY['Warm clothes', 'Sleeping bag', 'Torch', 'Personal medication', 'Water bottle'],
  ARRAY['Road Trip', 'Camping', 'Group Activities', 'Sightseeing'],
  'June to September',
  true,
  true,
  true
);

-- 11. Spiti Valley Winter Expeditions
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'spiti-valley-winter-expeditions-7-days',
  'Spiti Valley Winter Expeditions',
  'adventure',
  'Spiti Valley',
  7,
  6,
  23100,
  28000,
  'Experience the frozen magic of Spiti Valley in winter. Drive through snow-covered landscapes, visit frozen Chandratal Lake, and witness the unique winter culture of the region.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Manali to Kaza (Winter Route)", "description": "Drive via Atal Tunnel to Kaza. Experience winter roads and snow walls.", "activities": ["Winter Road Trip", "Snow Views"]},
    {"day": 2, "title": "Kaza Local in Winter", "description": "Explore frozen Kaza, Key Monastery in snow, and winter village life.", "activities": ["Winter Exploration", "Monastery Visit"]},
    {"day": 3, "title": "Kaza to Chandratal", "description": "Drive to frozen Chandratal Lake. Winter camping experience.", "activities": ["Frozen Lake Visit", "Winter Camping"]},
    {"day": 4, "title": "Chandratal to Losar", "description": "Winter village experience in Losar. Try local winter activities.", "activities": ["Village Life", "Winter Activities"]},
    {"day": 5, "title": "Losar to Kibber", "description": "Visit Kibber Village in winter, experience high-altitude winter life.", "activities": ["High Altitude Visit", "Winter Photography"]},
    {"day": 6, "title": "Kibber to Manali", "description": "Drive back to Manali via winter route. Enjoy snow activities.", "activities": ["Winter Road Trip", "Snow Activities"]},
    {"day": 7, "title": "Departure", "description": "Morning in Manali, departure.", "activities": ["Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotels/homestays', 'All meals', 'Transportation (4x4)', 'Driver', 'Winter gear'],
  ARRAY['Personal expenses', 'Emergency evacuation', 'Personal gear'],
  ARRAY['Frozen Chandratal', 'Winter Spiti', 'Snow Walls', 'Winter Culture'],
  ARRAY['Heavy winter gear', 'Thermal wear', 'Snow boots', 'Gloves, hat', 'Lip balm'],
  ARRAY['Winter Road Trip', 'Winter Camping', 'Photography', 'Snow Activities'],
  'December to February',
  true,
  true,
  true
);

-- Long Expeditions (10 Days)

-- 12. Manali Leh Backpacking Trip
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'manali-leh-backpacking-trip-10-days',
  'Manali Leh Backpacking Trip',
  'road-trip',
  'Leh',
  10,
  9,
  36749,
  45000,
  'A comprehensive journey covering the transition from the lush valleys of Manali to the high-altitude desert of Leh. Cross high mountain passes, visit ancient monasteries, and experience the unique culture of Ladakh.',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
  ARRAY['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
  '[
    {"day": 1, "title": "Manali to Jispa", "description": "Drive from Manali to Jispa via Rohtang Pass. Overnight in Jispa.", "activities": ["Road Trip", "High Pass Crossing"]},
    {"day": 2, "title": "Jispa to Sarchu", "description": "Drive to Sarchu via Baralacha Pass. Camping at Sarchu.", "activities": ["Road Trip", "Camping", "High Altitude"]},
    {"day": 3, "title": "Sarchu to Leh", "description": "Drive to Leh via Nakee La and Lachulung La passes. Arrive in Leh evening.", "activities": ["Road Trip", "High Pass Crossing", "Arrival"]},
    {"day": 4, "title": "Leh Acclimatization", "description": "Rest day in Leh for acclimatization. Visit Shanti Stupa and Leh Palace.", "activities": ["Acclimatization", "Sightseeing"]},
    {"day": 5, "title": "Leh to Nubra Valley", "description": "Drive to Nubra Valley via Khardung La Pass (highest motorable road). Visit Diskit Monastery.", "activities": ["Road Trip", "Khardung La", "Monastery Visit"]},
    {"day": 6, "title": "Nubra Valley Exploration", "description": "Visit Hunder sand dunes, enjoy double-humped camel ride. Explore Turtuk village.", "activities": ["Sand Dunes", "Camel Ride", "Village Visit"]},
    {"day": 7, "title": "Nubra to Pangong Lake", "description": "Drive to Pangong Lake via Shyok route. Overnight camping at Pangong.", "activities": ["Road Trip", "Lake Visit", "Camping"]},
    {"day": 8, "title": "Pangong to Leh", "description": "Morning at Pangong Lake, drive back to Leh via Chang La Pass.", "activities": ["Lake Visit", "Road Trip", "High Pass Crossing"]},
    {"day": 9, "title": "Leh Local", "description": "Visit Thiksey Monastery, Hemis Monastery, and local markets.", "activities": ["Monastery Visit", "Shopping", "Sightseeing"]},
    {"day": 10, "title": "Departure", "description": "Morning breakfast and departure from Leh.", "activities": ["Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in camps/hotels', 'All meals', 'Transportation', 'Driver', 'Camping equipment'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Camel ride cost', 'Personal gear'],
  ARRAY['Khardung La Pass', 'Pangong Lake', 'Nubra Valley', 'Double-humped camels', 'Thiksey Monastery'],
  ARRAY['Warm clothes (layers)', 'Sleeping bag', 'Torch', 'Sunscreen', 'Lip balm', 'Water bottle'],
  ARRAY['Road Trip', 'Camping', 'High Altitude Travel', 'Sightseeing', 'Photography'],
  'June to September',
  true,
  true,
  true
);

-- Religious & Cultural Tours

-- 13. Varanasi & Sarnath Religious Tour
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'varanasi-sarnath-religious-tour-3-days',
  'Varanasi & Sarnath Religious Tour',
  'spiritual',
  'Varanasi',
  3,
  2,
  14175,
  17000,
  'In-depth spiritual exploration of Varanasi''s ghats and the historic Buddhist site of Sarnath. Experience the divine energy of the Ganges and explore where Buddha gave his first sermon.',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
  ARRAY['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800', 'https://images.unsplash.com/photo-1599301239900-41e9b5b2c7d9?w=800'],
  '[
    {"day": 1, "title": "Arrival in Varanasi", "description": "Arrive in Varanasi, check into hotel. Evening Ganga Aarti at Dashashwamedh Ghat. Boat ride on Ganges.", "activities": ["Ganga Aarti", "Boat Ride", "Ghat Exploration"]},
    {"day": 2, "title": "Varanasi Temple Tour", "description": "Early morning boat ride for sunrise. Visit Kashi Vishwanath Temple, Sankat Mochan Hanuman Temple, and Banaras Hindu University.", "activities": ["Temple Visit", "Boat Ride", "Sightseeing"]},
    {"day": 3, "title": "Sarnath Excursion & Departure", "description": "Visit Sarnath - Dhamek Stupa, Mulagandha Kuti Vihar, and Sarnath Museum. Explore Ashoka Pillar. Depart in evening.", "activities": ["Buddhist Site Visit", "Museum", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotel', 'All meals', 'Transportation', 'Guide', 'Boat ride'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Shopping'],
  ARRAY['Ganga Aarti', 'Kashi Vishwanath Temple', 'Sarnath Buddhist Site', 'Ganges Boat Ride'],
  ARRAY['Modest clothing for temples', 'Comfortable walking shoes', 'Camera', 'Sunscreen'],
  ARRAY['Temple Visit', 'Spiritual Experience', 'Boat Ride', 'Sightseeing'],
  'October to March',
  true,
  true,
  true
);

-- 14. Varanasi Religious Weekend Tour
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'varanasi-religious-weekend-tour-2-days',
  'Varanasi Religious Weekend Tour',
  'spiritual',
  'Varanasi',
  2,
  1,
  7875,
  9500,
  'A concise spiritual getaway focused on the sacred Ganga ghats and Varanasi''s heritage. Perfect for a weekend of divine experience.',
  'https://images.unsplash.com/photo-1599301239900-41e9b5b2c7d9?w=800',
  ARRAY['https://images.unsplash.com/photo-1599301239900-41e9b5b2c7d9?w=800', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800'],
  '[
    {"day": 1, "title": "Arrival & Ganga Aarti", "description": "Arrive in Varanasi, check into hotel. Evening Ganga Aarti at Dashashwamedh Ghat. Explore the ghats.", "activities": ["Ganga Aarti", "Ghat Exploration", "Check-in"]},
    {"day": 2, "title": "Morning Rituals & Departure", "description": "Early morning boat ride for sunrise. Visit Kashi Vishwanath Temple. Explore local markets and depart.", "activities": ["Boat Ride", "Temple Visit", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotel', 'All meals', 'Transportation', 'Guide', 'Boat ride'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Shopping'],
  ARRAY['Ganga Aarti', 'Kashi Vishwanath Temple', 'Ganges Boat Ride', 'Weekend Spiritual Escape'],
  ARRAY['Modest clothing for temples', 'Comfortable walking shoes', 'Camera'],
  ARRAY['Temple Visit', 'Spiritual Experience', 'Boat Ride'],
  'October to March',
  false,
  true,
  true
);

-- 15. Agra Mathura Vrindavan Tour Package
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'agra-mathura-vrindavan-tour-4-days',
  'Agra Mathura Vrindavan Tour Package',
  'spiritual',
  'Agra',
  4,
  3,
  18375,
  22000,
  'Covers the iconic Taj Mahal in Agra alongside the Krishna pilgrimage sites of Mathura and Vrindavan. A perfect blend of Mughal architecture and Krishna devotion.',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
  ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 'https://images.unsplash.com/photo-1585138497938-94a5f0e1d8c0?w=800'],
  '[
    {"day": 1, "title": "Arrival in Agra", "description": "Arrive in Agra, check into hotel. Visit Agra Fort and Mehtab Bagh for sunset view of Taj Mahal.", "activities": ["Fort Visit", "Sunset View", "Check-in"]},
    {"day": 2, "title": "Taj Mahal & Drive to Mathura", "description": "Early morning visit to Taj Mahal at sunrise. Drive to Mathura (2 hours). Visit Krishna Janmabhoomi Temple.", "activities": ["Taj Mahal Visit", "Road Trip", "Temple Visit"]},
    {"day": 3, "title": "Mathura & Vrindavan", "description": "Explore Mathura temples. Drive to Vrindavan. Visit Banke Bihari Temple, ISKCON Temple, and Prem Mandir. Evening at Yamuna Ghat.", "activities": ["Temple Visit", "Spiritual Tour", "Ghat Visit"]},
    {"day": 4, "title": "Vrindavan & Departure", "description": "Morning visit to Govardhan Hill and Radha Kund. Depart from Vrindavan.", "activities": ["Pilgrimage Site", "Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotels', 'All meals', 'Transportation', 'Driver', 'Guide'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Camera fee at Taj Mahal'],
  ARRAY['Taj Mahal at Sunrise', 'Krishna Janmabhoomi', 'Banke Bihari Temple', 'ISKCON Temple'],
  ARRAY['Modest clothing for temples', 'Comfortable walking shoes', 'Camera', 'Sunscreen'],
  ARRAY['Sightseeing', 'Temple Visit', 'Spiritual Experience', 'Photography'],
  'October to March',
  true,
  true,
  true
);

-- 16. Golden Triangle Tour
INSERT INTO public.tours (
  slug, title, category, destination, duration_days, duration_nights, price_single, original_price, 
  description, thumbnail_url, gallery_images, itinerary, inclusions, exclusions, 
  highlights, things_to_carry, activities, best_time,
  is_featured, is_popular, is_active
) VALUES (
  'golden-triangle-tour-7-days',
  'Golden Triangle Tour',
  'road-trip',
  'Delhi',
  7,
  6,
  29925,
  36000,
  'A multi-state circuit including Delhi, Agra, and Jaipur (Rajasthan). Experience the rich cultural heritage of India''s most iconic cities.',
  'https://images.unsplash.com/photo-1585138497938-94a5f0e1d8c0?w=800',
  ARRAY['https://images.unsplash.com/photo-1585138497938-94a5f0e1d8c0?w=800', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'],
  '[
    {"day": 1, "title": "Arrival in Delhi", "description": "Arrive in Delhi, check into hotel. Visit India Gate, Raj Ghat, and Lotus Temple. Evening at Connaught Place.", "activities": ["Sightseeing", "Monument Visit", "Market Exploration"]},
    {"day": 2, "title": "Delhi City Tour", "description": "Visit Red Fort, Jama Masjid, Chandni Chowk, and Qutub Minar. Explore Humayun''s Tomb.", "activities": ["Historical Tour", "Market Visit", "Sightseeing"]},
    {"day": 3, "title": "Delhi to Agra", "description": "Drive to Agra (3 hours). Visit Agra Fort and Mehtab Bagh for sunset view of Taj Mahal.", "activities": ["Road Trip", "Fort Visit", "Sunset View"]},
    {"day": 4, "title": "Taj Mahal & Drive to Jaipur", "description": "Early morning visit to Taj Mahal at sunrise. Drive to Jaipur via Fatehpur Sikri. Overnight in Jaipur.", "activities": ["Taj Mahal Visit", "Road Trip", "Historical Site"]},
    {"day": 5, "title": "Jaipur Sightseeing", "description": "Visit Amber Fort, City Palace, Jantar Mantar, and Hawa Mahal. Evening at local markets.", "activities": ["Fort Visit", "Palace Tour", "Market Shopping"]},
    {"day": 6, "title": "Jaipur to Delhi", "description": "Morning visit to Nahargarh Fort. Drive back to Delhi. Evening farewell dinner.", "activities": ["Fort Visit", "Road Trip", "Farewell Dinner"]},
    {"day": 7, "title": "Departure", "description": "Morning breakfast and departure from Delhi.", "activities": ["Departure"]}
  ]'::jsonb,
  ARRAY['Accommodation in hotels', 'All meals', 'Transportation', 'Driver', 'Guide'],
  ARRAY['Personal expenses', 'Monument entry fees', 'Camera fee at Taj Mahal', 'Shopping'],
  ARRAY['Taj Mahal at Sunrise', 'Amber Fort', 'Hawa Mahal', 'Red Fort', 'Fatehpur Sikri'],
  ARRAY['Comfortable clothes', 'Walking shoes', 'Camera', 'Sunscreen', 'Modest clothing for temples'],
  ARRAY['Sightseeing', 'Historical Tour', 'Road Trip', 'Photography'],
  'October to March',
  true,
  true,
  true
);
