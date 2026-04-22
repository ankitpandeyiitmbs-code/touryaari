    -- =====================================================
    -- FILTER OPTIONS TABLE
    -- Allows admin to manage filter options dynamically
    -- =====================================================

    CREATE TABLE IF NOT EXISTS public.filter_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL CHECK (type IN ('category', 'duration', 'price_range')),
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(type, value)
    );

    -- Insert default filter options
    INSERT INTO public.filter_options (type, value, label, sort_order) VALUES
    -- Categories
    ('category', 'road-trip', 'Road Trips', 1),
    ('category', 'spiritual', 'Spiritual Yatra', 2),
    ('category', 'weekend', 'Weekend Trips', 3),
    ('category', 'customised', 'Customised', 4),
    ('category', 'international', 'International', 5),
    ('category', 'trekking', 'Trekking', 6),
    ('category', 'adventure', 'Adventure', 7),
    -- Durations
    ('duration', '1-3', '1-3 Days', 1),
    ('duration', '4-7', '4-7 Days', 2),
    ('duration', '8-14', '8-14 Days', 3),
    ('duration', '15+', '15+ Days', 4),
    -- Price Ranges
    ('price_range', '0-10000', 'Under ₹10,000', 1),
    ('price_range', '10000-25000', '₹10,000 - ₹25,000', 2),
    ('price_range', '25000-50000', '₹25,000 - ₹50,000', 3),
    ('price_range', '50000+', 'Above ₹50,000', 4)
    ON CONFLICT (type, value) DO NOTHING;

    -- RLS Policies
    ALTER TABLE public.filter_options ENABLE ROW LEVEL SECURITY;

    -- Public can read filter options
    CREATE POLICY "Public read filter options" ON public.filter_options
        FOR SELECT USING (true);

    -- Admin can manage filter options
    CREATE POLICY "Admin manage filter options" ON public.filter_options
        FOR ALL USING (is_admin()) WITH CHECK (is_admin());

    -- Index for faster queries
    CREATE INDEX IF NOT EXISTS idx_filter_options_type ON public.filter_options(type);
    CREATE INDEX IF NOT EXISTS idx_filter_options_active ON public.filter_options(is_active);
