'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SiteSettings {
  site_name: string;
  logo_url: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  show_whatsapp_widget: boolean;
  show_call_widget: boolean;
  whatsapp_message_template: string;
  popular_tours_heading: string;
  popular_tours_subtext: string;
  destinations_heading: string;
  destinations_subtext: string;
  why_choose_heading: string;
  why_choose_subtext: string;
  why1_title: string; why1_text: string;
  why2_title: string; why2_text: string;
  why3_title: string; why3_text: string;
  why4_title: string; why4_text: string;
  why5_title: string; why5_text: string;
  why6_title: string; why6_text: string;
  why7_title: string; why7_text: string;
  why8_title: string; why8_text: string;
  stat1_number: string; stat1_label: string;
  stat2_number: string; stat2_label: string;
  stat3_number: string; stat3_label: string;
  stat4_number: string; stat4_label: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'Touryaari Travels',
  logo_url: 'https://i.ibb.co/HLJJ976C/T-1-1-Photoroom.png',
  tagline: 'Your Journey, Our Passion',
  phone_primary: '+91 85956 89569',
  phone_secondary: '',
  email: 'info@touryaaritravels.com',
  whatsapp: '+91 85956 89569',
  address: 'Manali, Himachal Pradesh',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  twitter_url: '',
  show_whatsapp_widget: true,
  show_call_widget: true,
  whatsapp_message_template: 'Hi! I am interested in booking a tour.',
  popular_tours_heading: 'Popular Tours',
  popular_tours_subtext: 'Handpicked adventures loved by thousands of travelers',
  destinations_heading: 'Perfect Destinations',
  destinations_subtext: 'From the snow-capped peaks of the Himalayas to pristine beaches',
  why_choose_heading: 'Why Choose Us',
  why_choose_subtext: 'We make your travel dreams come true',
  why1_title: 'Safe & Secure', why1_text: 'Your safety is our priority.',
  why2_title: 'Expert Guides', why2_text: 'Our local guides are experienced professionals.',
  why3_title: 'Best Prices', why3_text: 'Get the best value for your money.',
  why4_title: 'Comfortable Transport', why4_text: 'Travel in well-maintained vehicles.',
  why5_title: 'Quality Stay', why5_text: 'Handpicked accommodations.',
  why6_title: 'Small Groups', why6_text: 'Intimate group sizes for personalized attention.',
  why7_title: 'Award Winning', why7_text: 'Recognized for excellence in travel.',
  why8_title: '24/7 Support', why8_text: 'Our team is always available.',
  stat1_number: '500+', stat1_label: 'Happy Travelers',
  stat2_number: '50+', stat2_label: 'Destinations',
  stat3_number: '100+', stat3_label: 'Tours Completed',
  stat4_number: '4.9', stat4_label: 'Average Rating',
};

const SettingsContext = createContext<SiteSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .maybeSingle();

        if (data && !error) {
          const merged = { ...defaultSettings };
          for (const key of Object.keys(data) as Array<keyof SiteSettings>) {
            const value = data[key];
            if (value !== null && value !== undefined && value !== '') {
              (merged as any)[key] = value;
            }
          }
          setSettings(merged);
        }
      } catch (err) {
        console.error('SettingsProvider: failed to fetch settings', err);
        // Keep defaultSettings — site still renders
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
