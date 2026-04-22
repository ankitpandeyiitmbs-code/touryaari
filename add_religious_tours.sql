-- Add Religious & Cultural Tours Only
-- These tours are not duplicates of the adventure/trekking tours

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
