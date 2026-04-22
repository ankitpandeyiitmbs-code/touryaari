-- QUICK FIX: Add missing booking_reference column
-- Run this in Supabase SQL Editor

-- 1. Add the missing column
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

-- 2. Drop and recreate the trigger function (clean state)
DROP TRIGGER IF EXISTS set_booking_reference ON public.bookings;
DROP FUNCTION IF EXISTS generate_booking_reference();

-- 3. Create the fixed function (no NEW.id dependency)
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'TYT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger
CREATE TRIGGER set_booking_reference
    BEFORE INSERT ON public.bookings
    FOR EACH ROW 
    WHEN (NEW.booking_reference IS NULL)
    EXECUTE FUNCTION generate_booking_reference();

-- 5. Verify
SELECT 'booking_reference column added successfully!' as result;

-- Test it (optional - remove if you don't want test data)
-- INSERT INTO public.bookings (tour_title, tour_slug, customer_name, customer_email, customer_phone, travel_date, sharing_type, total_amount, advance_amount, balance_amount)
-- VALUES ('Test Tour', 'test-tour', 'Test User', 'test@test.com', '9999999999', '2025-06-01', 'double', 15000, 5000, 10000)
-- RETURNING id, booking_reference;
