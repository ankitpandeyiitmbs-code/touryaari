import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/tours', label: 'All Tours' },
  { href: '/transport', label: 'Transport' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/blog', label: 'Travel Blog' },
  { href: '/contact', label: 'Contact Us' },
];

const tourCategories = [
  { href: '/tours?category=road-trip', label: 'Road Trips' },
  { href: '/tours?category=spiritual', label: 'Spiritual Yatra' },
  { href: '/weekend-trips', label: 'Weekend Trips' },
  { href: '/international', label: 'International' },
  { href: '/tours?category=trekking', label: 'Trekking' },
  { href: '/tours?category=adventure', label: 'Adventure' },
];

const destinations = [
  { href: '/destinations/leh-ladakh', label: 'Leh Ladakh' },
  { href: '/destinations/spiti-valley', label: 'Spiti Valley' },
  { href: '/destinations/kedarnath', label: 'Kedarnath' },
  { href: '/destinations/kasol', label: 'Kasol' },
  { href: '/destinations/bhutan', label: 'Bhutan' },
  { href: '/destinations/bali', label: 'Bali' },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const s = settings || {
    site_name: 'Touryaari Travels',
    logo_url: 'https://i.ibb.co/S48cvCy6/T-1-1.png',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    twitter_url: '',
    newsletter_heading: 'Join Our Travel Community',
    newsletter_subtext: 'Get exclusive deals and travel inspiration delivered to your inbox',
    footer_text: '',
    address: '',
    phone_primary: '',
    phone_secondary: '',
    email: '',
  };

  const socialLinks = {
    facebook: s.facebook_url || '#',
    instagram: s.instagram_url || '#',
    youtube: s.youtube_url || '#',
    twitter: s.twitter_url || '#',
  };

  return (
    <footer className="bg-pine-dark text-white/70">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-pine to-pine-light py-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 border border-gold/15 rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 border border-gold/10 rounded-full" />
        
        <div className="max-w-[700px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 text-gold-light text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Stay Updated
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">
            {s.newsletter_heading || 'Join Our Travel Community'}
          </h3>
          <p className="text-white/65 mb-8 max-w-md mx-auto">
            {s.newsletter_subtext || 'Get exclusive deals and travel inspiration delivered to your inbox'}
          </p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto bg-white/10 border border-white/20 rounded overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-5 py-3.5 text-white placeholder:text-white/45 outline-none text-sm"
            />
            <button 
              type="submit" 
              className="bg-gold text-pine-dark px-6 py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              {s.logo_url ? (
                <Image src={s.logo_url} alt={s.site_name || 'Touryaari'} width={120} height={120} className="h-12 w-auto object-contain" quality={95} />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center font-display text-[15px] font-semibold text-pine-dark">
                  {s.site_name?.charAt(0) || 'T'}
                </div>
              )}
              <span className="font-display text-lg font-semibold text-white tracking-wide">
                {(s.site_name || 'Touryaari').split(' ')[0]}<span className="text-gold-light">{(s.site_name || 'Touryaari').split(' ').slice(1).join(' ') || ' Travels'}</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              {s.footer_text || `Experience a hassle-free journey with ${s.site_name || 'Touryaari Travels'}. We specialize in Himalayan adventures, spiritual yatras, and international tours. Your journey, our passion.`}
            </p>
            <div className="flex gap-2.5">
              {socialLinks.facebook && socialLinks.facebook !== '#' && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/7 border border-white/12 rounded flex items-center justify-center hover:bg-gold/15 hover:border-gold/30 transition-all"
                >
                  <Facebook className="w-4 h-4 text-white/60" />
                </a>
              )}
              {socialLinks.instagram && socialLinks.instagram !== '#' && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/7 border border-white/12 rounded flex items-center justify-center hover:bg-gold/15 hover:border-gold/30 transition-all"
                >
                  <Instagram className="w-4 h-4 text-white/60" />
                </a>
              )}
              {socialLinks.youtube && socialLinks.youtube !== '#' && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/7 border border-white/12 rounded flex items-center justify-center hover:bg-gold/15 hover:border-gold/30 transition-all"
                >
                  <Youtube className="w-4 h-4 text-white/60" />
                </a>
              )}
              {socialLinks.twitter && socialLinks.twitter !== '#' && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/7 border border-white/12 rounded flex items-center justify-center hover:bg-gold/15 hover:border-gold/30 transition-all"
                >
                  <Twitter className="w-4 h-4 text-white/60" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 text-sm hover:text-gold-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Categories */}
          <div>
            <h4 className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase mb-6">
              Tour Categories
            </h4>
            <ul className="space-y-2.5">
              {tourCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 text-sm hover:text-gold-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[11px] font-bold text-gold tracking-[0.12em] uppercase mb-6">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {s.address && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-1" />
                  <span className="text-white/55">
                    {s.address}
                  </span>
                </li>
              )}
              {(s.phone_primary || s.phone_secondary) && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                  <div className="flex flex-col">
                    {s.phone_primary && (
                      <a href={`tel:${s.phone_primary.replace(/\s/g, '')}`} className="text-white/55 text-sm hover:text-gold-light transition-colors">
                        {s.phone_primary}
                      </a>
                    )}
                    {s.phone_secondary && (
                      <a href={`tel:${s.phone_secondary.replace(/\s/g, '')}`} className="text-white/55 text-sm hover:text-gold-light transition-colors">
                        {s.phone_secondary}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {s.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  <a href={`mailto:${s.email}`} className="text-white/55 text-sm hover:text-gold-light transition-colors">
                    {s.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/35 text-sm">
              &copy; {new Date().getFullYear()} {s.site_name || 'Touryaari Travels'}. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy-policy" className="text-white/45 hover:text-gold-light transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/45 hover:text-gold-light transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="text-white/45 hover:text-gold-light transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
