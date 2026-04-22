-- =====================================================
-- Touryaari V3 Migration: States + Email + Fixes
-- Run this in your Supabase SQL editor
-- =====================================================

-- 1. States table (replaces hard-coded destinations on homepage)
CREATE TABLE IF NOT EXISTS states (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  hero_image  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with the two default states
INSERT INTO states (name, slug, description, image_url, hero_image, sort_order)
VALUES
  ('Uttar Pradesh', 'uttar-pradesh',
   'Sacred ghats, ancient temples and spiritual journeys through the heart of India',
   'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800',
   'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1600',
   1),
  ('Uttarakhand', 'uttarakhand',
   'Snow-capped Himalayas, valley treks, and the abode of the gods',
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
   2)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS on states
ALTER TABLE states ENABLE ROW LEVEL SECURITY;

-- Public can read active states
DROP POLICY IF EXISTS "states_public_read" ON states;
CREATE POLICY "states_public_read"
  ON states FOR SELECT
  USING (is_active = true);

-- 2. Ensure tours.state column exists (it already does, but safe to confirm)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS state_slug TEXT;

-- 3. Add email_sent column to bookings so we don't double-send
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_email_sent BOOLEAN DEFAULT false;

-- 4. WhatsApp number in settings (add to site_settings table if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    -- Add whatsapp_number column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='site_settings' AND column_name='whatsapp_number'
    ) THEN
      ALTER TABLE site_settings ADD COLUMN whatsapp_number TEXT DEFAULT '';
    END IF;
  END IF;
END $$;

-- 5. Index for state-based tour filtering
CREATE INDEX IF NOT EXISTS idx_tours_state ON tours(state);
CREATE INDEX IF NOT EXISTS idx_tours_state_slug ON tours(state_slug);

-- 6. Updated_at trigger for states
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_states_updated_at ON states;
CREATE TRIGGER update_states_updated_at
  BEFORE UPDATE ON states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
