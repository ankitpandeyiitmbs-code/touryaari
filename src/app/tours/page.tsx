import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import TourFilters from '@/components/tours/TourFilters';
import TourCard from '@/components/tours/TourCard';
import { createClient } from '@/lib/supabase/server';
import { Tour } from '@/types';
import Skeleton from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'All Tours - Touryaari Travels',
  description: 'Browse all our curated tours - from Himalayan adventures to spiritual yatras and international destinations.',
};

async function getTours(searchParams: { [key: string]: string | string[] | undefined }) {
  const supabase = createClient();
  let query = supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false });

  const category = Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category;
  const destination = Array.isArray(searchParams.destination) ? searchParams.destination[0] : searchParams.destination;
  const search = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search;
  const duration = Array.isArray(searchParams.duration) ? searchParams.duration : searchParams.duration?.split(',') || [];
  const priceRange = Array.isArray(searchParams.price_range) ? searchParams.price_range : searchParams.price_range?.split(',') || [];

  console.log('Search params:', { category, destination, search, duration, priceRange });

  if (category) {
    query = query.eq('category', category);
  }
  if (destination) {
    query = query.eq('destination', destination);
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,destination.ilike.%${search}%`);
  }

  const { data, error } = await query;
  console.log('Tours query result:', { data, error });
  
  let tours = data as Tour[] || [];

  // Client-side filtering for duration
  if (duration.length > 0) {
    tours = tours.filter(tour => {
      return duration.some(d => {
        if (d === '1-3') return tour.duration_days >= 1 && tour.duration_days <= 3;
        if (d === '4-7') return tour.duration_days >= 4 && tour.duration_days <= 7;
        if (d === '8-14') return tour.duration_days >= 8 && tour.duration_days <= 14;
        if (d === '15+') return tour.duration_days >= 15;
        return false;
      });
    });
  }

  // Client-side filtering for price range
  if (priceRange.length > 0) {
    tours = tours.filter(tour => {
      return priceRange.some(p => {
        if (p === '0-10000') return tour.price_single <= 10000;
        if (p === '10000-25000') return tour.price_single >= 10000 && tour.price_single <= 25000;
        if (p === '25000-50000') return tour.price_single >= 25000 && tour.price_single <= 50000;
        if (p === '50000+') return tour.price_single >= 50000;
        return false;
      });
    });
  }

  return tours;
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tours = await getTours(searchParams);

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Explore
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-3">
            {searchParams.category 
              ? `${searchParams.category.toString().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Tours`
              : 'All Tours'}
          </h1>
          <p className="text-stone text-lg">
            Discover {tours.length} amazing tours curated just for you
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TourFilters />
          </div>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            }>
              {tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-cream-dark">
                  {searchParams.category ? (
                    <>
                      <p className="text-xl text-pine-dark font-semibold mb-2">
                        {searchParams.category.toString().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Tours Coming Soon!
                      </p>
                      <p className="text-stone/70 mt-2 mb-6">
                        We're working on amazing {searchParams.category.toString().replace('-', ' ')} tours. Check back soon or explore other categories.
                      </p>
                      <Link 
                        href="/tours" 
                        className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
                      >
                        Browse All Tours
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-xl text-stone">No tours found matching your criteria.</p>
                      <p className="text-stone/70 mt-2">Try adjusting your filters.</p>
                    </>
                  )}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
