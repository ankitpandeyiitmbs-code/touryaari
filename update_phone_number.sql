-- Update phone numbers to +91 85956 89569
UPDATE public.site_settings
SET phone_primary = '+91 85956 89569',
    whatsapp = '+91 85956 89569'
WHERE id = 'global';
