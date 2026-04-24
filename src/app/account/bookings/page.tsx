'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Loader2, Calendar, Users, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  tour_title: string;
  tour_slug: string;
  travel_date: string;
  adults: number;
  children: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function MyBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };
    fetchBookings();
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

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card">
            <Package className="w-16 h-16 text-gold/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-pine-dark mb-2">No bookings yet</h3>
            <p className="text-stone mb-6">Start exploring amazing tours and book your next adventure!</p>
            <Link href="/tours" className="inline-flex items-center gap-2 bg-gold text-pine-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold-light transition-colors">
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link href={`/tour/${booking.tour_slug}`} className="font-serif text-lg font-semibold text-pine-dark hover:text-gold transition-colors">
                      {booking.tour_title}
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-stone mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {booking.adults} adult{booking.adults > 1 ? 's' : ''}{booking.children > 0 && `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-cream-dark">
                  <div className="text-sm text-stone">
                    Total: <span className="font-semibold text-pine-dark">₹{booking.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={`text-xs font-semibold ${
                    booking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
