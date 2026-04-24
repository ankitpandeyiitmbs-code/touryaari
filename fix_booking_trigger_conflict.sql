-- Step 1: Drop conflicting triggers and functions
DROP TRIGGER IF EXISTS set_booking_ref ON public.bookings;
DROP TRIGGER IF EXISTS set_booking_reference ON public.bookings;
DROP FUNCTION IF EXISTS generate_booking_ref();
DROP FUNCTION IF EXISTS generate_booking_reference();

-- Step 2: Add booking_ref and booking_reference columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'bookings'
    AND column_name = 'booking_ref'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN booking_ref TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'bookings'
    AND column_name = 'booking_reference'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN booking_reference TEXT;
  END IF;
END $$;

-- Make booking_ref nullable (only if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'bookings'
    AND column_name = 'booking_ref'
  ) THEN
    ALTER TABLE public.bookings
      ALTER COLUMN booking_ref DROP NOT NULL;
  END IF;
END $$;

-- Step 3: Create one reliable trigger that populates BOTH columns
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_ref := 'TYT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(MD5(random()::text || clock_timestamp()::text), 1, 6));
  NEW.booking_reference := NEW.booking_ref;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_ref
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_ref();

-- Step 4: Add confirmation_email_sent column (needed by verify route)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS confirmation_email_sent BOOLEAN DEFAULT false;

-- Step 5: Fix RLS — ensure service role and guest inserts work
-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Auth insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role full access" ON public.bookings;
DROP POLICY IF EXISTS "Anon insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Auth read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;

CREATE POLICY "Service role full access" ON public.bookings
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth read own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

SELECT 'Bookings table fully fixed!' as result;
