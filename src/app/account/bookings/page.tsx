'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setLoading(false);
    };
    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-stone hover:text-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="mb-10">
          <h1 className="font-serif text-4xl font-semibold text-pine-dark mb-2">My Bookings</h1>
          <p className="text-text-mid">View and manage your tour bookings</p>
        </div>

        <div className="bg-white rounded-xl p-12 text-center shadow-card">
          <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-pine-dark mb-2">No bookings yet</h3>
          <p className="text-stone mb-6">Start exploring amazing tours and book your next adventure!</p>
          <Link href="/tours" className="inline-flex items-center gap-2 bg-gold text-pine-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors">
            Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
