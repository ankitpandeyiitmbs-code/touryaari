import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Destinations - Touryaari Travels',
  description: 'Explore amazing destinations with Touryaari Travels. From Himalayas to beaches, find your perfect getaway.',
};

async function getDestinations() {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Explore
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-4">
            Our Destinations
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            From the snow-capped peaks of the Himalayas to pristine beaches, 
            discover destinations that will take your breath away.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative h-80 rounded-xl overflow-hidden"
            >
              <Image
                src={dest.image_url || '/placeholder.jpg'}
                alt={dest.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-1 text-gold text-sm mb-2">
                  <MapPin className="w-4 h-4" />
                  {dest.tour_count} {dest.tour_count === 1 ? 'Tour' : 'Tours'}
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {dest.name}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2 mb-4">
                  {dest.short_description}
                </p>
                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-stone">No destinations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
