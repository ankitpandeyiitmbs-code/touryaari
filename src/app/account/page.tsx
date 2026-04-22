'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Package, Heart, Settings, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout');
      setLoggingOut(false);
      return;
    }
    toast.success('Logged out successfully');
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: 'My Bookings', href: '/account/bookings', desc: 'View your tour bookings' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist', desc: 'Saved tours and destinations' },
    { icon: Settings, label: 'Settings', href: '/account/settings', desc: 'Update your profile' },
  ];

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            My Account
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-pine-dark mb-2">
            Welcome back, <em className="text-pine-light">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler'}</em>
          </h1>
          <p className="text-text-mid">{user?.email}</p>
        </div>

        {/* Account Menu */}
        <div className="space-y-3 mb-10">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow group"
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
                <item.icon className="w-5 h-5 text-gold group-hover:text-pine-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold text-pine-dark">{item.label}</h3>
                <p className="text-stone text-sm">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone group-hover:text-gold transition-colors" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-3 bg-pine-dark text-white rounded-xl p-5 hover:bg-pine transition-colors disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="font-semibold">{loggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
}
