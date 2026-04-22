-- =====================================================
-- ☢️ NUCLEAR FIX: Complete reset of bookings table
-- Run this if all else fails - will DELETE all booking data!
-- =====================================================

-- Step 1: Backup existing data (optional - comment out if no data to save)
-- CREATE TABLE IF NOT EXISTS bookings_backup AS SELECT * FROM public.bookings;

-- Step 2: Drop everything related to bookings
DROP TRIGGER IF EXISTS set_booking_reference ON public.bookings;
DROP FUNCTION IF EXISTS generate_booking_reference();
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Step 3: Recreate bookings table WITH the column from the start
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE,  -- This will definitely exist now!
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

-- Step 4: Create indexes
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at);

-- Step 5: Create the trigger function (using random instead of NEW.id)
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'TYT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create the trigger
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON public.bookings
    FOR EACH ROW 
    WHEN (NEW.booking_reference IS NULL)
    EXECUTE FUNCTION generate_booking_reference();

-- Step 7: Enable RLS and create policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own bookings
DROP POLICY IF EXISTS "Auth read own bookings" ON public.bookings;
CREATE POLICY "Auth read own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

-- Policy for inserting bookings
DROP POLICY IF EXISTS "Auth insert bookings" ON public.bookings;
CREATE POLICY "Auth insert bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for admin access
DROP POLICY IF EXISTS "Admin all bookings" ON public.bookings;
CREATE POLICY "Admin all bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Step 8: Verify
SELECT '✅ Bookings table recreated successfully with booking_reference column!' as result;

-- Test insert (uncomment to test)
-- INSERT INTO public.bookings (tour_title, tour_slug, customer_name, customer_email, customer_phone, travel_date, sharing_type, total_amount, advance_amount, balance_amount)
-- VALUES ('Test Tour', 'test-tour', 'Test User', 'test@test.com', '9999999999', '2025-06-01', 'double', 15000, 5000, 10000)
-- RETURNING id, booking_reference;
