'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Tour } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface BookingWidgetProps {
  tour: Tour;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const [hasBooking, setHasBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBooking = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('bookings')
        .select('id')
        .eq('tour_id', tour.id)
        .eq('user_id', user.id)
        .maybeSingle();

      setHasBooking(!!data);
      setLoading(false);
    };
    checkBooking();
  }, [tour.id]);

  const lowestPrice = Math.min(
    tour.price_single,
    tour.price_double || tour.price_single,
    tour.price_triple || tour.price_single,
    tour.price_quad || tour.price_single
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-card border border-cream-dark">
      <div className="mb-4">
        <span className="text-stone text-sm">Starting from</span>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl font-bold text-pine-dark">
            {formatPrice(lowestPrice)}
          </span>
          <span className="text-stone text-sm">/person</span>
        </div>
        {tour.original_price && (
          <span className="text-stone/60 line-through text-sm">
            {formatPrice(tour.original_price)}
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-stone">Duration</span>
          <span className="font-medium text-pine-dark">{formatDuration(tour.duration_days, tour.duration_nights)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone">Group Size</span>
          <span className="font-medium text-pine-dark">{tour.group_size_min}-{tour.group_size_max} people</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone">Departure</span>
          <span className="font-medium text-pine-dark">{tour.departure_city || 'Manali'}</span>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-3 text-center text-stone">Loading...</div>
      ) : hasBooking ? (
        <Link
          href="/account/bookings"
          className="w-full inline-flex items-center justify-center bg-green-600 text-white font-semibold tracking-wide py-3 rounded-lg hover:bg-green-700 transition-colors mb-3"
        >
          View Your Booking
        </Link>
      ) : (
        <Link
          href={`/tour/${tour.slug}/book`}
          className="w-full inline-flex items-center justify-center bg-gold text-pine-dark font-semibold tracking-wide py-3 rounded-lg hover:bg-gold-light transition-colors mb-3"
        >
          Book Now
        </Link>
      )}

      <p className="text-center text-xs text-stone">
        Only 30% advance payment required
      </p>

      <div className="mt-4 pt-4 border-t border-cream-dark">
        <p className="text-sm font-medium text-pine-dark mb-2">Price Includes:</p>
        <ul className="text-xs text-stone space-y-1">
          <li className="flex items-center gap-1.5"><span className="text-gold">✓</span> Accommodation</li>
          <li className="flex items-center gap-1.5"><span className="text-gold">✓</span> Meals (as per itinerary)</li>
          <li className="flex items-center gap-1.5"><span className="text-gold">✓</span> Transportation</li>
          <li className="flex items-center gap-1.5"><span className="text-gold">✓</span> Expert guide</li>
        </ul>
      </div>
    </div>
  );
}
