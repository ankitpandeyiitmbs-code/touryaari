import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Cinzel } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import { getSiteSettings } from '@/lib/settings';
import '@/styles/globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const s = settings || {
    site_name: 'Touryaari Travels',
    tagline: 'Your Journey, Our Passion',
    meta_title: '',
    meta_description: '',
  };
  
  return {
    title: s.meta_title || `${s.site_name} - ${s.tagline}`,
    description: s.meta_description || 'Discover amazing places at exclusive deals. Touryaari Travels offers curated Himalayan adventures, spiritual yatras, weekend getaways, and international tours.',
    keywords: 'travel, tours, India, Himalayas, Leh Ladakh, Kedarnath, road trips, adventure travel',
    openGraph: {
      title: s.meta_title || `${s.site_name} - ${s.tagline}`,
      description: s.meta_description || 'Discover amazing places at exclusive deals. Book your next adventure with Touryaari Travels.',
      url: 'https://touryaaritravels.com',
      siteName: s.site_name,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.meta_title || `${s.site_name} - ${s.tagline}`,
      description: s.meta_description || 'Discover amazing places at exclusive deals.',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable}`}>
      <body className="font-sans antialiased">
        <SettingsProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SettingsProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1B3A2D',
              color: '#fff',
              padding: '16px',
              borderRadius: '4px',
            },
            success: {
              iconTheme: {
                primary: '#C89033',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#E8B055',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
