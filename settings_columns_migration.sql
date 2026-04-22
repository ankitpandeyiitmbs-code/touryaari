-- Add missing columns to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_message TEXT DEFAULT 'Site under maintenance. Back soon!';
