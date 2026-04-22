-- Update tour pricing to add missing price tiers
-- This ensures the booking form works correctly

UPDATE tours SET 
  price_double = price_single * 0.9,
  price_triple = price_single * 0.85,
  price_quad = price_single * 0.8
WHERE price_double IS NULL OR price_triple IS NULL OR price_quad IS NULL;
