-- =====================================================
-- TOURYAARI TRAVELS - COMPLETE SUPABASE SCHEMA
-- Run this entire file in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. USERS TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name', 
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 2. TOURS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    destination TEXT NOT NULL,
    location_detail TEXT,
    state TEXT,
    country TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'road-trip', 'spiritual', 'weekend', 'customised', 
        'international', 'trekking', 'adventure'
    )),
    sub_category TEXT,
    duration_days INTEGER NOT NULL DEFAULT 3,
    duration_nights INTEGER NOT NULL DEFAULT 2,
    price_single NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_double NUMERIC(10,2) DEFAULT 0,
    price_triple NUMERIC(10,2) DEFAULT 0,
    price_quad NUMERIC(10,2) DEFAULT 0,
    original_price NUMERIC(10,2) DEFAULT 0,
    discount_percent NUMERIC(5,2) DEFAULT 0,
    group_size_min INTEGER DEFAULT 1,
    group_size_max INTEGER DEFAULT 20,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Expert')),
    thumbnail_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    things_to_carry TEXT[] DEFAULT '{}',
    faqs JSONB DEFAULT '[]'::jsonb,
    activities TEXT[] DEFAULT '{}',
    best_time TEXT,
    pickup_point TEXT,
    departure_city TEXT,
    is_limited_seats BOOLEAN DEFAULT false,
    available_seats INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(2,1) DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    booking_policy TEXT,
    cancellation_policy TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON public.tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON public.tours(destination);
CREATE INDEX IF NOT EXISTS idx_tours_is_featured ON public.tours(is_featured);
CREATE INDEX IF NOT EXISTS idx_tours_is_popular ON public.tours(is_popular);
CREATE INDEX IF NOT EXISTS idx_tours_is_active ON public.tours(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_created_at ON public.tours(created_at);

-- =====================================================
-- 3. DESTINATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    region TEXT,
    state TEXT,
    country TEXT,
    description TEXT,
    short_description TEXT,
    image_url TEXT,
    banner_url TEXT,
    famous_for TEXT[] DEFAULT '{}',
    best_time TEXT,
    climate TEXT,
    tour_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_international BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_is_featured ON public.destinations(is_featured);
CREATE INDEX IF NOT EXISTS idx_destinations_is_international ON public.destinations(is_international);
CREATE INDEX IF NOT EXISTS idx_destinations_is_active ON public.destinations(is_active);
CREATE INDEX IF NOT EXISTS idx_destinations_sort_order ON public.destinations(sort_order);

-- =====================================================
-- 4. BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE,
    tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
    tour_title TEXT NOT NULL,
    tour_slug TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    travel_date DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    sharing_type TEXT NOT NULL CHECK (sharing_type IN ('single', 'double', 'triple', 'quad')),
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    advance_amount NUMERIC(10,2) DEFAULT 0,
    balance_amount NUMERIC(10,2) DEFAULT 0,
    gst_amount NUMERIC(10,2) DEFAULT 0,
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- FIXED: Auto-generate booking_reference using random + timestamp
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'TYT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_reference ON public.bookings;
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON public.bookings
    FOR EACH ROW 
    WHEN (NEW.booking_reference IS NULL)
    EXECUTE FUNCTION generate_booking_reference();

-- =====================================================
-- 5. INQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT,
    travel_date DATE,
    travellers INTEGER DEFAULT 1,
    budget TEXT,
    message TEXT,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'contact-page', 'tour-page', 'popup')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_source ON public.inquiries(source);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at);

-- =====================================================
-- 6. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    avatar_url TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT NOT NULL,
    tour_name TEXT,
    platform TEXT CHECK (platform IN ('google', 'facebook', 'website', 'instagram', 'tripadvisor')),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_platform ON public.testimonials(platform);

-- =====================================================
-- 7. BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    author_name TEXT,
    author_avatar TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    read_time INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON public.blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);

-- =====================================================
-- 8. GALLERY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_is_active ON public.gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON public.gallery(sort_order);

-- =====================================================
-- 9. HERO SLIDES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    badge_text TEXT,
    cta_text TEXT DEFAULT 'Explore Now',
    cta_link TEXT DEFAULT '/tours',
    image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_is_active ON public.hero_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_sort_order ON public.hero_slides(sort_order);

-- =====================================================
-- 10. SITE SETTINGS TABLE (Single Row - 'global' ID)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    -- Branding
    site_name TEXT DEFAULT 'Touryaari Travels',
    tagline TEXT DEFAULT 'Your Journey, Our Passion',
    logo_url TEXT DEFAULT '',
    favicon_url TEXT DEFAULT '',
    -- Hero
    hero_title TEXT DEFAULT 'Discover Incredible India',
    hero_subtitle TEXT DEFAULT 'Explore amazing places at exclusive deals',
    -- Contact
    phone_primary TEXT,
    phone_secondary TEXT,
    email TEXT DEFAULT 'info@touryaari.com',
    whatsapp TEXT,
    address TEXT,
    -- Social
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    twitter_url TEXT,
    tripadvisor_url TEXT,
    -- About
    about_text TEXT,
    about_image_url TEXT,
    -- Footer
    footer_text TEXT DEFAULT 'Your trusted travel partner for incredible journeys',
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    google_analytics_id TEXT,
    facebook_pixel_id TEXT,
    -- Theme colors
    primary_color TEXT DEFAULT '#1B3A2D',
    secondary_color TEXT DEFAULT '#2D4A3D',
    accent_color TEXT DEFAULT '#C89033',
    -- Section headings
    popular_tours_heading TEXT DEFAULT 'Popular Tours',
    popular_tours_subtext TEXT,
    destinations_heading TEXT DEFAULT 'Top Destinations',
    destinations_subtext TEXT,
    why_choose_heading TEXT DEFAULT 'Why Choose Us',
    why_choose_subtext TEXT,
    testimonials_heading TEXT DEFAULT 'What Travelers Say',
    blog_heading TEXT DEFAULT 'Travel Stories',
    blog_subtext TEXT,
    newsletter_heading TEXT DEFAULT 'Join Our Travel Community',
    newsletter_subtext TEXT,
    -- Special offers banners
    offer1_title TEXT,
    offer1_subtitle TEXT,
    offer1_image TEXT,
    offer1_cta TEXT,
    offer1_link TEXT,
    offer2_title TEXT,
    offer2_subtitle TEXT,
    offer2_image TEXT,
    offer2_cta TEXT,
    offer2_link TEXT,
    offer3_title TEXT,
    offer3_subtitle TEXT,
    offer3_image TEXT,
    offer3_cta TEXT,
    offer3_link TEXT,
    -- Stats
    stat1_number TEXT DEFAULT '500+',
    stat1_label TEXT DEFAULT 'Happy Travelers',
    stat2_number TEXT DEFAULT '50+',
    stat2_label TEXT DEFAULT 'Destinations',
    stat3_number TEXT DEFAULT '100+',
    stat3_label TEXT DEFAULT 'Tours Completed',
    stat4_number TEXT DEFAULT '4.9',
    stat4_label TEXT DEFAULT 'Average Rating',
    -- Why choose us cards (8 cards)
    why1_icon TEXT DEFAULT '🏆',
    why1_title TEXT,
    why1_text TEXT,
    why2_icon TEXT DEFAULT '🛡️',
    why2_title TEXT,
    why2_text TEXT,
    why3_icon TEXT DEFAULT '💰',
    why3_title TEXT,
    why3_text TEXT,
    why4_icon TEXT DEFAULT '🎯',
    why4_title TEXT,
    why4_text TEXT,
    why5_icon TEXT DEFAULT '📞',
    why5_title TEXT,
    why5_text TEXT,
    why6_icon TEXT DEFAULT '🚌',
    why6_title TEXT,
    why6_text TEXT,
    why7_icon TEXT DEFAULT '🍽️',
    why7_title TEXT,
    why7_text TEXT,
    why8_icon TEXT DEFAULT '📸',
    why8_title TEXT,
    why8_text TEXT,
    -- Payment
    razorpay_key_id TEXT,
    currency TEXT DEFAULT 'INR',
    gst_percentage NUMERIC DEFAULT 5,
    booking_advance_percent NUMERIC DEFAULT 30,
    -- Widgets
    show_whatsapp_widget BOOLEAN DEFAULT true,
    show_call_widget BOOLEAN DEFAULT true,
    whatsapp_message_template TEXT DEFAULT 'Hi! I am interested in booking a tour.',
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT DEFAULT 'Site under maintenance. Back soon!',
    -- Policies (HTML content)
    privacy_policy_content TEXT,
    terms_content TEXT,
    refund_policy_content TEXT,
    -- Maps
    google_maps_embed_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default site settings (only if not exists)
INSERT INTO public.site_settings (id) 
VALUES ('global') 
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin') 
        AND is_active = true
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- USERS policies
DROP POLICY IF EXISTS "Public read own user" ON public.users;
CREATE POLICY "Public read own user" ON public.users
    FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin all users" ON public.users;
CREATE POLICY "Admin all users" ON public.users
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- TOURS policies
DROP POLICY IF EXISTS "Public read tours" ON public.tours;
CREATE POLICY "Public read tours" ON public.tours
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all tours" ON public.tours;
CREATE POLICY "Admin all tours" ON public.tours
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- DESTINATIONS policies
DROP POLICY IF EXISTS "Public read destinations" ON public.destinations;
CREATE POLICY "Public read destinations" ON public.destinations
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all destinations" ON public.destinations;
CREATE POLICY "Admin all destinations" ON public.destinations
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BOOKINGS policies
DROP POLICY IF EXISTS "Auth read own bookings" ON public.bookings;
CREATE POLICY "Auth read own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Auth insert bookings" ON public.bookings;
CREATE POLICY "Auth insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin all bookings" ON public.bookings;
CREATE POLICY "Admin all bookings" ON public.bookings
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- INQUIRIES policies
DROP POLICY IF EXISTS "Public insert inquiries" ON public.inquiries;
CREATE POLICY "Public insert inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all inquiries" ON public.inquiries;
CREATE POLICY "Admin all inquiries" ON public.inquiries
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- TESTIMONIALS policies
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all testimonials" ON public.testimonials;
CREATE POLICY "Admin all testimonials" ON public.testimonials
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BLOG POSTS policies
DROP POLICY IF EXISTS "Public read published blogs" ON public.blog_posts;
CREATE POLICY "Public read published blogs" ON public.blog_posts
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin all blogs" ON public.blog_posts;
CREATE POLICY "Admin all blogs" ON public.blog_posts
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- GALLERY policies
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all gallery" ON public.gallery;
CREATE POLICY "Admin all gallery" ON public.gallery
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- HERO SLIDES policies
DROP POLICY IF EXISTS "Public read hero slides" ON public.hero_slides;
CREATE POLICY "Public read hero slides" ON public.hero_slides
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all hero slides" ON public.hero_slides;
CREATE POLICY "Admin all hero slides" ON public.hero_slides
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- SITE SETTINGS policies
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
CREATE POLICY "Public read site settings" ON public.site_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update settings" ON public.site_settings;
CREATE POLICY "Admin update settings" ON public.site_settings
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- =====================================================
-- STORAGE BUCKET POLICIES
-- =====================================================

-- Create bucket if not exists (do this in Supabase UI first: Storage > New bucket > 'media')
-- Then run these policies:

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
CREATE POLICY "Admin upload media" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'media' 
        AND EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
CREATE POLICY "Admin delete media" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'media' 
        AND EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- END OF SCHEMA
-- =====================================================
SELECT 'Touryaari Travels Schema Created Successfully!' as status;
