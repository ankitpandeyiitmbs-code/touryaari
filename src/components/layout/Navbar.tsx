'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, User, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useSettings } from '@/components/providers/SettingsProvider';
import toast from 'react-hot-toast';

// Logout Button Component
function LogoutButton({ onClick }: { onClick?: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout');
      setLoading(false);
      return;
    }
    toast.success('Logged out successfully');
    onClick?.();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      <span>{loading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}

const navLinks = [
  { href: '/about', label: 'About' },
  {
    href: '#',
    label: 'Tours',
    dropdown: [
      { href: '/tours?category=road-trip', label: 'Road Trips' },
      { href: '/tours?category=spiritual', label: 'Spiritual Yatra' },
      { href: '/weekend-trips', label: 'Weekend Trips' },
      { href: '/tours?category=customised', label: 'Custom Tours' },
      { href: '/international', label: 'International' },
    ],
  },
  { href: '/transport', label: 'Transport' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const pathname = usePathname();
  const settings = useSettings();

  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const isTransparent = !isScrolled && pathname === '/';

  const isHomePage = pathname === '/';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#2D5A3D] shadow-[0_1px_0_rgba(200,144,51,0.2)] transition-all duration-400"
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-20">
          {/* Logo - Luxury Design */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={settings.site_name} width={320} height={320} className="h-48 w-auto object-contain" quality={95} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center font-display text-[15px] font-semibold text-pine-dark">
                {settings.site_name.charAt(0)}
              </div>
            )}
            <span className="font-display text-lg font-semibold text-white tracking-wide">
              {settings.site_name.split(' ')[0]}<span className="text-gold-light">{settings.site_name.split(' ').slice(1).join(' ')}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <>
                    <button
                      className={`flex items-center gap-1 text-sm font-medium tracking-wide text-white/85 hover:text-gold-light transition-colors relative group ${
                        pathname.startsWith(link.href) ? 'text-gold-light' : ''
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-card-hover py-2 z-50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-pine-dark hover:bg-gold/10 hover:text-gold transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-sm font-medium tracking-wide text-white/85 hover:text-gold-light transition-colors relative group ${
                      pathname === link.href ? 'text-gold-light' : ''
                    }`}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Phone & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {settings.phone_primary && (
              <a
                href={`tel:${settings.phone_primary.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm font-medium text-white/85 hover:text-gold-light transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{settings.phone_primary}</span>
              </a>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-pine-dark rounded text-sm font-semibold tracking-wide uppercase hover:bg-gold-light hover:-translate-y-px transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </button>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-card-hover py-2 z-50"
                    >
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-pine-dark hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/account/bookings"
                        className="block px-4 py-2 text-sm text-pine-dark hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/account/settings"
                        className="block px-4 py-2 text-sm text-pine-dark hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Settings
                      </Link>
                      <div className="border-t border-cream-dark my-1" />
                      <LogoutButton onClick={() => setActiveDropdown(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-white/85 hover:text-gold-light transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 bg-gold text-pine-dark rounded text-xs font-semibold tracking-wider uppercase hover:bg-gold-light hover:-translate-y-px transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-gold-light transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

          {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-0 bg-[#2D5A3D] z-50 lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  {settings.logo_url ? (
                    <Image src={settings.logo_url} alt={settings.site_name} width={320} height={320} className="h-48 w-auto object-contain" quality={95} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center font-cinzel text-[15px] font-semibold text-pine-dark">
                      {settings.site_name.charAt(0)}
                    </div>
                  )}
                  <span className="font-cinzel text-lg font-semibold text-white tracking-wide">
                    {settings.site_name.split(' ')[0]}<span className="text-gold-light">{settings.site_name.split(' ').slice(1).join(' ')}</span>
                  </span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gold-light p-2 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.label} className="mb-4">
                    {link.dropdown ? (
                      <>
                        <span className="text-white/80 text-base font-medium block mb-2">{link.label}</span>
                        <div className="pl-4 border-l-2 border-gold/30">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 text-white/70 hover:text-gold-light transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white text-base font-medium hover:text-gold-light transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-white/20 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 bg-gold text-pine-dark text-center rounded font-semibold tracking-wide uppercase hover:bg-gold-light transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Trigger logout via a custom event or directly
                        const supabase = createClient();
                        supabase.auth.signOut().then(() => {
                          toast.success('Logged out successfully');
                          window.location.href = '/';
                        });
                      }}
                      className="block w-full py-3 border border-white/30 text-white text-center rounded font-medium hover:border-gold/50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 text-white text-center border border-white/30 rounded font-medium hover:border-gold/50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 bg-gold text-pine-dark text-center rounded font-semibold tracking-wide uppercase hover:bg-gold-light transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
