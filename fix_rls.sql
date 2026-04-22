-- Fix RLS policy to allow public read access to tours
-- This allows unauthenticated users to read active tours

DROP POLICY IF EXISTS "Public read tours" ON public.tours;

CREATE POLICY "Public read tours" ON public.tours
    FOR SELECT
    USING (is_active = true);

-- Verify the policy exists
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'tours';
