import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  hero_title: string;
  hero_subtitle: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  tripadvisor_url: string;
  about_text: string;
  about_image_url: string;
  footer_text: string;
  meta_title: string;
  meta_description: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  popular_tours_heading: string;
  popular_tours_subtext: string;
  destinations_heading: string;
  destinations_subtext: string;
  why_choose_heading: string;
  why_choose_subtext: string;
  testimonials_heading: string;
  blog_heading: string;
  blog_subtext: string;
  newsletter_heading: string;
  newsletter_subtext: string;
  offer1_title: string;
  offer1_subtitle: string;
  offer1_image: string;
  offer1_cta: string;
  offer1_link: string;
  offer2_title: string;
  offer2_subtitle: string;
  offer2_image: string;
  offer2_cta: string;
  offer2_link: string;
  offer3_title: string;
  offer3_subtitle: string;
  offer3_image: string;
  offer3_cta: string;
  offer3_link: string;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  stat4_number: string;
  stat4_label: string;
  why1_icon: string;
  why1_title: string;
  why1_text: string;
  why2_icon: string;
  why2_title: string;
  why2_text: string;
  why3_icon: string;
  why3_title: string;
  why3_text: string;
  why4_icon: string;
  why4_title: string;
  why4_text: string;
  why5_icon: string;
  why5_title: string;
  why5_text: string;
  why6_icon: string;
  why6_title: string;
  why6_text: string;
  why7_icon: string;
  why7_title: string;
  why7_text: string;
  why8_icon: string;
  why8_title: string;
  why8_text: string;
  razorpay_key_id: string;
  currency: string;
  gst_percentage: number;
  booking_advance_percent: number;
  show_whatsapp_widget: boolean;
  show_call_widget: boolean;
  whatsapp_message_template: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  privacy_policy_content: string;
  terms_content: string;
  refund_policy_content: string;
  google_maps_embed_url: string;
  updated_at: string;
}

// Default settings as fallback when DB is unavailable
export const defaultSettings: Partial<SiteSettings> = {
  site_name: 'Touryaari Travels',
  logo_url: 'https://i.ibb.co/HLJJ976C/T-1-1-Photoroom.png',
  tagline: 'Explore India Your Way',
  hero_title: "Discover India's Hidden Wonders",
  hero_subtitle: 'Handcrafted tours for the curious traveler',
  phone_primary: '+91 85956 89569',
  whatsapp: '+91 85956 89569',
  email: 'info@touryaaritravels.com',
  currency: 'INR',
  gst_percentage: 5,
  booking_advance_percent: 30,
  show_whatsapp_widget: true,
  show_call_widget: true,
  whatsapp_message_template: 'Hi! I am interested in booking a tour.',
  maintenance_mode: false,
  maintenance_message: 'Site under maintenance. Back soon!',
  popular_tours_heading: 'Popular Tours',
  popular_tours_subtext: 'Explore our most loved journeys',
  destinations_heading: 'Top Destinations',
  destinations_subtext: 'Discover India\'s most beautiful places',
  why_choose_heading: 'Why Choose Us',
  why_choose_subtext: 'We make every journey extraordinary',
  testimonials_heading: 'What Travelers Say',
  blog_heading: 'Travel Stories',
  blog_subtext: 'Inspiration for your next adventure',
  newsletter_heading: 'Get Travel Updates',
  newsletter_subtext: 'Subscribe for exclusive deals and travel tips',
  stat1_number: '500+',
  stat1_label: 'Happy Travelers',
  stat2_number: '50+',
  stat2_label: 'Destinations',
  stat3_number: '100+',
  stat3_label: 'Tours Completed',
  stat4_number: '4.9',
  stat4_label: 'Average Rating',
  primary_color: '#1B3A2D',
  secondary_color: '#2D4A3D',
  accent_color: '#C89033',
  privacy_policy_content: '',
  terms_content: '',
  refund_policy_content: '',
};

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) {
      console.error('Error fetching site settings:', error.message);
      return { ...defaultSettings } as SiteSettings;
    }

    if (!data) {
      // No row yet — return defaults so the site still renders
      return { ...defaultSettings } as SiteSettings;
    }

    return { ...defaultSettings, ...data } as SiteSettings;
  } catch (err) {
    console.error('getSiteSettings threw:', err);
    return { ...defaultSettings } as SiteSettings;
  }
});

export async function getHeroSlides() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero slides:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('getHeroSlides threw:', err);
    return [];
  }
}
