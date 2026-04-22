-- Fix duplicate transport vehicles

-- 1. Delete all duplicate rows, keeping only the first (lowest id) for each name
DELETE FROM public.transport_vehicles a
USING public.transport_vehicles b
WHERE a.id > b.id AND a.name = b.name;

-- 2. Add unique constraint on name to prevent future duplicates
ALTER TABLE public.transport_vehicles
ADD CONSTRAINT transport_vehicles_name_unique UNIQUE (name);
