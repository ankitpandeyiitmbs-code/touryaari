-- Drop existing RLS policies on bookings table
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role can manage bookings" ON public.bookings;

-- Create new RLS policies
-- Allow service role to do everything
CREATE POLICY "Service role full access" ON public.bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert bookings
CREATE POLICY "Users can insert bookings" ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
