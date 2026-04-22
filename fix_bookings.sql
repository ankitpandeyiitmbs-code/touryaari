-- FIX FOR BOOKINGS TABLE ERROR
-- Run this in Supabase SQL Editor

-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS set_booking_reference ON public.bookings;

-- Drop the function
DROP FUNCTION IF EXISTS generate_booking_reference();

-- Recreate the bookings table with correct column name (if needed)
-- If your table already exists, this will be skipped
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
    total_amount NUMERIC(10,2) NOT NULL,
    advance_amount NUMERIC(10,2) NOT NULL,
    balance_amount NUMERIC(10,2) NOT NULL,
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

-- Add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'booking_reference'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN booking_reference TEXT UNIQUE;
    END IF;
END $$;

-- Create the fixed trigger function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate reference using timestamp and random string (not relying on id)
    NEW.booking_reference := 'TYT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger (runs BEFORE INSERT)
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON public.bookings
    FOR EACH ROW 
    WHEN (NEW.booking_reference IS NULL)
    EXECUTE FUNCTION generate_booking_reference();

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Auth read own bookings" ON public.bookings;
CREATE POLICY "Auth read own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- Test insert (optional - remove after testing)
-- INSERT INTO public.bookings (tour_title, tour_slug, customer_name, customer_email, customer_phone, travel_date, sharing_type, total_amount, advance_amount, balance_amount)
-- VALUES ('Test Tour', 'test-tour', 'Test User', 'test@test.com', '1234567890', '2025-01-01', 'double', 10000, 3000, 7000);

SELECT 'Bookings table fixed successfully!' as result;
