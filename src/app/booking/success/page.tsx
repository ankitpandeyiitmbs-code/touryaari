'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Users, MapPin, CreditCard, ArrowRight, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  booking_ref: string;
  booking_reference: string;
  tour_title: string;
  travel_date: string;
  adults: number;
  children: number;
  sharing_type: string;
  total_amount: number;
  advance_amount: number;
  balance_amount: number;
  status: string;
  payment_status: string;
  razorpay_payment_id: string;
  customer_name: string;
  customer_email: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('id');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) { router.push('/'); return; }

    const fetchBooking = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!error && data) setBooking(data);
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const ref = booking?.booking_reference || booking?.booking_ref || bookingId?.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-[640px] mx-auto px-6">

        {/* Success header */}
        <div className="text-center mb-10">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-pine-dark mb-2">Booking Confirmed!</h1>
          <p className="text-stone text-lg">
            Your booking ref is <span className="font-bold text-gold">#{ref}</span>
          </p>
          <p className="text-stone text-sm mt-1">
            A confirmation email has been sent to {booking?.customer_email || 'your email'}.
          </p>
        </div>

        {/* Booking details card */}
        {booking && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-pine-dark border-b border-cream-dark pb-3">
              Booking Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone flex items-center gap-2"><MapPin className="w-4 h-4" /> Tour</span>
                <span className="font-medium text-pine-dark text-right max-w-[60%]">{booking.tour_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone flex items-center gap-2"><Calendar className="w-4 h-4" /> Travel Date</span>
                <span className="font-medium text-pine-dark">
                  {new Date(booking.travel_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone flex items-center gap-2"><Users className="w-4 h-4" /> Travellers</span>
                <span className="font-medium text-pine-dark">
                  {booking.adults} adult{booking.adults > 1 ? 's' : ''}
                  {booking.children > 0 ? `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Sharing Type</span>
                <span className="font-medium text-pine-dark capitalize">{booking.sharing_type}</span>
              </div>
              <div className="border-t border-cream-dark pt-3">
                <div className="flex justify-between">
                  <span className="text-stone">Total Trip Cost</span>
                  <span className="font-medium">₹{Number(booking.total_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-green-700 font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Advance Paid (30%)
                  </span>
                  <span className="font-bold text-green-700">₹{Number(booking.advance_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-stone text-xs">Balance due before departure</span>
                  <span className="text-stone text-xs">₹{Number(booking.balance_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {booking.razorpay_payment_id && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                <strong>Payment ID:</strong> {booking.razorpay_payment_id}
              </div>
            )}
          </div>
        )}

        {/* What's next */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h3 className="font-semibold text-pine-dark mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-stone">
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold mt-0.5">1.</span>
              Our team will call you within 24 hours to confirm your itinerary.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold mt-0.5">2.</span>
              You'll receive a detailed travel document before departure.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold font-bold mt-0.5">3.</span>
              Pay the remaining balance 7 days before your trip date.
            </li>
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4">
          <Link
            href="/account/bookings"
            className="flex-1 flex items-center justify-center gap-2 bg-gold text-pine-dark font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            My Bookings <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-cream-dark text-stone py-3 rounded-lg hover:bg-cream transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
