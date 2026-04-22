-- Add extra_km_charge column to transport_bookings table
ALTER TABLE public.transport_bookings
ADD COLUMN IF NOT EXISTS extra_km_charge NUMERIC(10,2) DEFAULT 0;
