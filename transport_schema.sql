-- Transport Vehicles and Bookings Schema for Touryaari Travels

-- =====================================================
-- 1. TRANSPORT VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('sedan', 'suv', 'tempo_traveler', 'bus')),
    capacity INTEGER NOT NULL,
    
    -- Local (Same Day) Pricing
    local_base_price NUMERIC(10,2) NOT NULL,
    local_parking_included BOOLEAN DEFAULT true,
    
    -- Outstation Pricing (Per KM)
    outstation_price_per_km NUMERIC(10,2) NOT NULL,
    minimum_km_per_day INTEGER DEFAULT 250,
    
    -- Additional Charges
    driver_da_per_day NUMERIC(10,2) DEFAULT 500,
    night_halt_charge NUMERIC(10,2) DEFAULT 0,
    
    features TEXT[] DEFAULT '{}',
    image_url TEXT,
    luggage_capacity INTEGER,
    fuel_type TEXT DEFAULT 'diesel',
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transport_vehicles_type ON public.transport_vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_transport_vehicles_is_active ON public.transport_vehicles(is_active);

-- =====================================================
-- 2. TRANSPORT BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transport_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE,
    vehicle_id UUID REFERENCES public.transport_vehicles(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Booking Type: local (same day) or outstation
    booking_type TEXT NOT NULL CHECK (booking_type IN ('local', 'outstation')),
    
    -- Pickup Details
    pickup_location TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    
    -- Drop Details
    drop_location TEXT NOT NULL,
    drop_date DATE NOT NULL,
    drop_time TIME NOT NULL,
    
    -- Distance and Duration
    estimated_distance_km NUMERIC(10,2),
    estimated_duration_hours NUMERIC(10,2),
    
    -- Pricing
    base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    driver_da NUMERIC(10,2) DEFAULT 0,
    extra_km_charge NUMERIC(10,2) DEFAULT 0,
    toll_charges NUMERIC(10,2) DEFAULT 0,
    parking_charges NUMERIC(10,2) DEFAULT 0,
    state_tax NUMERIC(10,2) DEFAULT 0,
    night_halt_charges NUMERIC(10,2) DEFAULT 0,
    gst_amount NUMERIC(10,2) DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    advance_amount NUMERIC(10,2) DEFAULT 0,
    balance_amount NUMERIC(10,2) DEFAULT 0,
    
    -- Customer Details
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    
    -- Additional Requirements
    special_requests TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
    
    -- Payment Details
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    
    -- Admin Notes
    admin_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transport_bookings_reference ON public.transport_bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_user_id ON public.transport_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_vehicle_id ON public.transport_bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_status ON public.transport_bookings(status);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_pickup_date ON public.transport_bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_created_at ON public.transport_bookings(created_at);

-- =====================================================
-- 3. AUTO-GENERATE BOOKING REFERENCE
-- =====================================================
CREATE OR REPLACE FUNCTION generate_transport_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference := 'TYT-TR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::text || NOW()::text), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_transport_booking_reference ON public.transport_bookings;
CREATE TRIGGER set_transport_booking_reference
    BEFORE INSERT ON public.transport_bookings
    FOR EACH ROW 
    WHEN (NEW.booking_reference IS NULL)
    EXECUTE FUNCTION generate_transport_booking_reference();

-- =====================================================
-- 4. ENABLE RLS
-- =====================================================
ALTER TABLE public.transport_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_bookings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- Transport Vehicles - Public read active vehicles
DROP POLICY IF EXISTS "Public read transport vehicles" ON public.transport_vehicles;
CREATE POLICY "Public read transport vehicles" ON public.transport_vehicles
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all transport vehicles" ON public.transport_vehicles;
CREATE POLICY "Admin all transport vehicles" ON public.transport_vehicles
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Transport Bookings - Auth read own bookings
DROP POLICY IF EXISTS "Auth read own transport bookings" ON public.transport_bookings;
CREATE POLICY "Auth read own transport bookings" ON public.transport_bookings
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Public insert transport bookings" ON public.transport_bookings;
CREATE POLICY "Public insert transport bookings" ON public.transport_bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all transport bookings" ON public.transport_bookings;
CREATE POLICY "Admin all transport bookings" ON public.transport_bookings
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =====================================================
-- 6. INSERT DEMO VEHICLES
-- =====================================================
INSERT INTO public.transport_vehicles (name, vehicle_type, capacity, local_base_price, local_parking_included, outstation_price_per_km, minimum_km_per_day, driver_da_per_day, night_halt_charge, features, luggage_capacity, is_popular, sort_order) VALUES
('Sedan (Dzire/Etios)', 'sedan', 4, 1900.00, true, 13.00, 250, 500, 300, ARRAY['AC', 'Music System', 'Comfortable Seating'], 2, true, 1),
('SUV (Ertiga/Innova)', 'suv', 6, 2600.00, true, 17.00, 250, 500, 400, ARRAY['AC', 'Music System', 'Spacious', 'Luggage Space'], 4, true, 2),
('Tempo Traveller (12 Seater)', 'tempo_traveler', 12, 6500.00, true, 27.00, 300, 500, 500, ARRAY['AC', 'Pushback Seats', 'Music System', 'First Aid Kit'], 8, true, 3),
('Tempo Traveller (16 Seater)', 'tempo_traveler', 16, 7500.00, true, 32.00, 300, 500, 500, ARRAY['AC', 'Pushback Seats', 'Music System', 'First Aid Kit'], 10, false, 4),
('Tempo Traveller (24 Seater)', 'tempo_traveler', 24, 9000.00, true, 38.00, 300, 500, 600, ARRAY['AC', 'Pushback Seats', 'Music System', 'First Aid Kit', 'LED TV'], 15, false, 5),
('Bus (50 Seater)', 'bus', 50, 15000.00, true, 45.00, 300, 1000, 800, ARRAY['AC', 'Pushback Seats', 'Music System', 'First Aid Kit', 'LED TV', 'Microphone'], 30, false, 6)
ON CONFLICT DO NOTHING;
