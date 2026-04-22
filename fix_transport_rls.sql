-- Fix RLS policies for transport bookings to allow anonymous inserts

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Auth insert transport bookings" ON public.transport_bookings;

-- Allow anyone to insert transport bookings (guests can book too)
DROP POLICY IF EXISTS "Public insert transport bookings" ON public.transport_bookings;
CREATE POLICY "Public insert transport bookings" ON public.transport_bookings
    FOR INSERT WITH CHECK (true);

-- Allow reading own bookings (including NULL user_id for guest bookings)
DROP POLICY IF EXISTS "Auth read own transport bookings" ON public.transport_bookings;
CREATE POLICY "Auth read own transport bookings" ON public.transport_bookings
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
