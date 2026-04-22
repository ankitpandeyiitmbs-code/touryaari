import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Weekend Trips - Touryaari Travels',
  description: 'Short weekend getaways perfect for a quick break from city life.',
};

// Sample weekend trips
const sampleWeekendTrips = [
  {
    id: 'wk-1',
    slug: 'kasol-manikaran-weekend',
    title: 'Kasol & Manikaran Weekend',
    destination: 'Kasol, Himachal',
    duration_days: 2,
    duration_nights: 1,
    price_double: 5500,
    original_price: 6500,
    discount_percent: 15,
    rating: 4.6,
    reviews_count: 89,
    thumbnail_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    category: 'weekend',
    group_size_min: 4,
    group_size_max: 15,
  },
  {
    id: 'wk-2',
    slug: 'tirthan-valley-weekend',
    title: 'Tirthan Valley Escape',
    destination: 'Tirthan Valley, HP',
    duration_days: 2,
    duration_nights: 1,
    price_double: 6500,
    original_price: 7500,
    discount_percent: 13,
    rating: 4.7,
    reviews_count: 67,
    thumbnail_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    category: 'weekend',
    group_size_min: 4,
    group_size_max: 12,
  },
  {
    id: 'wk-3',
    slug: 'chail-weekend-retreat',
    title: 'Chail Weekend Retreat',
    destination: 'Chail, Himachal',
    duration_days: 2,
    duration_nights: 1,
    price_double: 4800,
    original_price: 5500,
    discount_percent: 12,
    rating: 4.5,
    reviews_count: 45,
    thumbnail_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    category: 'weekend',
    group_size_min: 4,
    group_size_max: 16,
  },
];

async function getWeekendTrips() {
  const supabase = createClient();
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('category', 'weekend')
    .eq('is_active', true)
    .order('duration_days', { ascending: true });
  return data || [];
}

export default async function WeekendTripsPage() {
  const tours = await getWeekendTrips();
  const displayTours = tours.length > 0 ? tours : sampleWeekendTrips;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Quick Escapes
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-4">
            Weekend Trips
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Short getaways perfect for a weekend break. Return refreshed and rejuvenated!
          </p>
        </div>

        {/* Tours Grid */}
        {displayTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTours.map((tour) => (
              <Link key={tour.id} href={`/tour/${tour.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-cream-dark">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={tour.thumbnail_url || '/placeholder.jpg'}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                    Weekend
                  </span>
                  {tour.discount_percent > 0 && (
                    <span className="absolute top-3 right-3 bg-gold text-pine-dark text-[10px] font-bold px-2.5 py-1 rounded-sm">
                      {tour.discount_percent}% OFF
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-stone text-xs mb-2">
                    <MapPin className="w-3 h-3" />
                    {tour.destination}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-pine-dark mb-2 line-clamp-1 group-hover:text-pine transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gold text-xs mb-3">
                    <span>★★★★★</span>
                    <span className="text-stone ml-1">({tour.reviews_count} reviews)</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-stone pb-3 border-b border-cream-dark mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(tour.duration_days, tour.duration_nights)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif text-xl font-semibold text-pine-dark">{formatPrice(tour.price_double)}</span>
                      <span className="text-xs text-stone ml-1">/person</span>
                    </div>
                    <span className="text-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-cream-dark">
            <p className="text-xl text-stone mb-4">No weekend trips available right now.</p>
            <Link href="/tours" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors">
              Browse All Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
