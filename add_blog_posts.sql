-- Insert sample blog posts
-- These are the blog posts shown on the blog page

INSERT INTO public.blog_posts (
  slug, title, excerpt, content, cover_image, author_name, category, tags, is_featured, is_published, read_time, published_at
) VALUES
  (
    'leh-ladakh-travel-guide-2024',
    '10 Essential Tips for Your First Leh Ladakh Trip',
    'Everything you need to know before embarking on your Himalayan adventure. From acclimatization to packing essentials.',
    '<h2>Acclimatization is Key</h2><p>Leh Ladakh is situated at high altitude, so acclimatization is crucial. Take it easy for the first 2-3 days, stay hydrated, and avoid alcohol.</p><h2>Get Your Permits</h2><p>You need Inner Line Permits for certain areas like Pangong Lake, Nubra Valley, and Tso Moriri. Get these from the DC office in Leh.</p><h2>Pack Smart</h2><p>Carry warm clothes even in summer - temperatures can drop below freezing at night. Don''t forget sunscreen and lip balm - UV is intense at high altitude.</p><h2>Carry Cash</h2><p>ATMs are limited in Ladakh. Carry enough cash, especially for remote areas like Pangong and Nubra Valley.</p><h2>Respect Local Culture</h2><p>Ladakh has a rich Buddhist culture. Dress modestly when visiting monasteries and always ask permission before photographing people.</p>',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Ladakh', 'Himalayas', 'Road Trip', 'Adventure'],
    true,
    true,
    8,
    '2024-01-15T00:00:00Z'
  ),
  (
    'kedarnath-trek-guide-2024',
    'Complete Kedarnath Trek Guide 2024',
    'A comprehensive guide to the sacred Kedarnath trek including route details, best time to visit, and accommodation options.',
    '<h2>Best Time to Visit</h2><p>The best time for Kedarnath trek is from May to June and September to October. Avoid monsoon season (July-August) due to landslides.</p><h2>Trek Route</h2><p>The trek starts from Gaurikund, which is 14 km from Kedarnath. You can either trek the entire distance or take a pony/palki.</p><h2>Registration</h2><p>Mandatory registration is required at the Rishikesh office. Carry your ID proof and medical certificate.</p><h2>Accommodation</h2><p>GMVN guest houses and private lodges are available at Gaurikund and Kedarnath. Book in advance during peak season.</p><h2>What to Carry</h2><p>Rain gear, warm clothes, trekking shoes, first aid kit, and water purification tablets are essential.</p>',
    'https://images.unsplash.com/photo-1568282850763-47d3e29c6a88?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Kedarnath', 'Trekking', 'Pilgrimage', 'Uttarakhand'],
    true,
    true,
    10,
    '2024-01-10T00:00:00Z'
  ),
  (
    'spiti-valley-road-trip-itinerary',
    'Ultimate Spiti Valley Road Trip Itinerary',
    'Discover the untouched beauty of Spiti Valley with our detailed 7-day road trip itinerary covering all major attractions.',
    '<h2>Day 1: Shimla to Sarahan</h2><p>Start early from Shimla, drive through Narkanda and reach Sarahan by evening. Visit Bhimakali Temple.</p><h2>Day 2: Sarahan to Kaza</h2><p>Drive via Sangla Valley and cross Sutlej River. Reach Kaza by evening - the heart of Spiti.</p><h2>Day 3: Kaza Local Sightseeing</h2><p>Visit Key Monastery, Kibber Village, and get your permits for Chandratal Lake.</p><h2>Day 4: Kaza to Chandratal Lake</h2><p>Drive to Chandratal Lake - the moon lake. Camp overnight by the lake for a magical experience.</p><h2>Day 5: Chandratal to Manali</h2><p>Drive via Kunzum Pass and Rohtang Pass. Reach Manali by evening.</p>',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Spiti', 'Road Trip', 'Himachal', 'Itinerary'],
    true,
    true,
    12,
    '2024-01-05T00:00:00Z'
  ),
  (
    'bhutan-travel-requirements',
    'Bhutan Travel Requirements & Visa Guide',
    'Planning a trip to the Kingdom of Happiness? Here''s everything about Bhutan''s visa policy, daily minimum tariff, and how to book your tour.',
    '<h2>Bhutan''s Unique Tourism Policy</h2><p>Bhutan follows a "High Value, Low Volume" tourism policy. All tourists (except Indian, Bangladeshi, and Maldivian nationals) must book their trip through a registered Bhutanese tour operator.</p><h2>Visa Requirements</h2><p>Visa applications must be submitted through your tour operator. The visa fee is $40 and processing takes about 7-10 working days.</p><h2>Daily Minimum Tariff</h2><p>The Sustainable Development Fee (SDF) is $200 per person per night for most tourists. Indian tourists pay ₹1,200 per person per night.</p><h2>What''s Included</h2><p>The tariff includes accommodation, all meals, licensed guide, transportation, and entry fees.</p>',
    'https://images.unsplash.com/photo-1572938546064-07c6a1d87066?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Bhutan', 'Visa', 'International', 'Himalayas'],
    true,
    true,
    6,
    '2024-02-20T00:00:00Z'
  ),
  (
    'kasol-travel-guide',
    'Kasol Travel Guide - Mini Israel of India',
    'Complete guide to Kasol - from best places to visit, cafes to try, trekking trails, and accommodation options.',
    '<h2>Why Visit Kasol</h2><p>Kasol is a paradise for backpackers, trekkers, and nature lovers. Known as "Mini Israel" for its Israeli influence and vibrant cafe culture.</p><h2>Best Places to Visit</h2><p>Manikaran (hot springs), Kheerganga Trek, Malana Village, and Tosh Village are must-visit places around Kasol.</p><h2>Best Cafes</h2><p>Try Evergreen Cafe, Little Italy, and German Bakery for authentic Israeli and continental food.</p><h2>Trekking Options</h2><p>Kheerganga (12 km), Sar Pass (48 km), and Pin Parvati Pass (100 km) are popular trekking trails starting from Kasol.</p><h2>Best Time</h2><p>March to June and September to November are ideal. Avoid monsoon due to landslides.</p>',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Kasol', 'Himachal', 'Trekking', 'Backpacking'],
    false,
    true,
    8,
    '2024-03-15T00:00:00Z'
  ),
  (
    'manali-leh-highway-guide',
    'Manali Leh Highway Complete Guide',
    'Everything you need to know about driving the Manali Leh Highway - road conditions, permits, fuel stops, and accommodation.',
    '<h2>Route Overview</h2><p>The Manali Leh Highway is 490 km long and takes 2-3 days to complete. It''s one of the most scenic and challenging road trips in India.</p><h2>Best Time</h2><p>Mid-June to mid-September is the only window when the highway is open. Rohtang Pass opens in June and closes by October.</h><h2>Permits Required</h2><p>You need Inner Line Permit for Pangong, Nubra Valley, and Tso Moriri. Get permits in Leh or Manali.</p><h2>Fuel Stops</h2><p>Fuel up in Manali, Tandi (last fuel before Leh), and Karu. Carry extra fuel in jerry cans.</p><h2>Accommodation</h2><p>Stay at Sarchu, Pang, or Jispa on the way. Book in advance during peak season.</p>',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'Touryaari Team',
    'Travel Tips',
    ARRAY['Ladakh', 'Road Trip', 'Manali', 'Highway'],
    false,
    true,
    15,
    '2024-04-01T00:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;
