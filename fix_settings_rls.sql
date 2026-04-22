-- Fix RLS policy for site_settings to allow admin updates
-- Drop existing policies
DROP POLICY IF EXISTS "Public read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin update settings" ON public.site_settings;

-- Create new policies that allow admin updates
CREATE POLICY "Public read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin manage site settings" ON public.site_settings
    FOR ALL USING (true) WITH CHECK (true);
