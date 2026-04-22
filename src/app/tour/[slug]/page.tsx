import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Check, X, Phone, MessageCircle, Share2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Tour } from '@/types';
import { formatPrice, formatDuration, getCategoryLabel } from '@/lib/utils';
import BookingWidget from '@/components/tours/BookingWidget';

interface TourPageProps {
  params: { slug: string };
}

// Sample tours for display when Supabase data is not available
const sampleTours: Record<string, Tour> = {
  'manali-leh-road-trip': {
    id: '1',
    slug: 'manali-leh-road-trip',
    title: 'Manali to Leh Road Trip',
    subtitle: 'The Ultimate Himalayan Adventure',
    description: 'Epic road trip through Rohtang Pass and Baralacha La',
    destination: 'Leh Ladakh',
    location_detail: 'Manali to Leh Highway',
    state: 'Himachal & Ladakh',
    country: 'India',
    category: 'road-trip',
    duration_days: 9,
    duration_nights: 8,
    price_single: 45000,
    price_double: 38000,
    price_triple: 35000,
    original_price: 52000,
    discount_percent: 13,
    group_size_min: 6,
    group_size_max: 15,
    difficulty: 'Challenging',
    rating: 4.9,
    reviews_count: 128,
    is_active: true,
    is_featured: true,
    is_popular: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  } as Tour,
  'spiti-valley-expedition': {
    id: '2',
    slug: 'spiti-valley-expedition',
    title: 'Spiti Valley Expedition',
    subtitle: 'Land of Monasteries & Mountains',
    description: 'Explore the cold desert mountain valley',
    destination: 'Spiti Valley',
    location_detail: 'Key Monastery, Chandratal',
    state: 'Himachal Pradesh',
    country: 'India',
    category: 'road-trip',
    duration_days: 7,
    duration_nights: 6,
    price_single: 35000,
    price_double: 30000,
    price_triple: 28000,
    original_price: 40000,
    discount_percent: 12,
    group_size_min: 4,
    group_size_max: 12,
    difficulty: 'Moderate',
    rating: 4.8,
    reviews_count: 95,
    is_active: true,
    is_featured: true,
    is_popular: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800',
  } as Tour,
  'chardham-yatra-2024': {
    id: '3',
    slug: 'chardham-yatra-2024',
    title: 'Chardham Yatra Package',
    subtitle: 'Spiritual Journey to Four Holy Shrines',
    description: 'Visit Yamunotri, Gangotri, Kedarnath & Badrinath',
    destination: 'Uttarakhand',
    location_detail: 'Char Dham Circuit',
    state: 'Uttarakhand',
    country: 'India',
    category: 'spiritual',
    duration_days: 10,
    duration_nights: 9,
    price_single: 55000,
    price_double: 48000,
    price_triple: 45000,
    original_price: 62000,
    discount_percent: 11,
    group_size_min: 4,
    group_size_max: 20,
    difficulty: 'Moderate',
    rating: 4.9,
    reviews_count: 210,
    is_active: true,
    is_featured: true,
    is_popular: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  } as Tour,
  'kedarnath-trek-package': {
    id: '4',
    slug: 'kedarnath-trek-package',
    title: 'Kedarnath Trek Package',
    subtitle: 'Sacred Journey to Lord Shiva\'s Abode',
    description: 'Trek to one of the holiest Hindu shrines',
    destination: 'Kedarnath',
    location_detail: 'Gaurikund to Kedarnath Temple',
    state: 'Uttarakhand',
    country: 'India',
    category: 'trekking',
    duration_days: 3,
    duration_nights: 2,
    price_single: 15000,
    price_double: 12000,
    price_triple: 10000,
    original_price: 18000,
    discount_percent: 17,
    group_size_min: 2,
    group_size_max: 15,
    difficulty: 'Challenging',
    rating: 4.8,
    reviews_count: 156,
    is_active: true,
    is_featured: true,
    is_popular: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  } as Tour,
};

async function getTour(slug: string): Promise<Tour | null> {
  // First try to get from Supabase
  const supabase = createClient();
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  // If found in database, return it
  if (data) return data;
  
  // Otherwise check sample data
  return sampleTours[slug] || null;
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const tour = await getTour(params.slug);
  if (!tour) return { title: 'Tour Not Found' };
  
  return {
    title: `${tour.title} - Touryaari Travels`,
    description: tour.meta_description || tour.subtitle || '',
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const tour = await getTour(params.slug);
  
  if (!tour) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone mb-4">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tours" className="hover:text-gold transition-colors">Tours</Link>
          <span className="mx-2">/</span>
          <span className="text-pine-dark font-medium">{tour.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="col-span-2 row-span-2 relative h-80 rounded-xl overflow-hidden">
                <Image
                  src={tour.thumbnail_url || '/placeholder.jpg'}
                  alt={tour.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {tour.gallery_images?.slice(0, 4).map((img, i) => (
                <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                  <Image src={img} alt={`${tour.title} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Title & Meta */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-cream-dark">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-pine text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">{getCategoryLabel(tour.category)}</span>
                {tour.is_featured && <span className="bg-gold text-pine-dark text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">Featured</span>}
                {tour.discount_percent > 0 && (
                  <span className="bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">{tour.discount_percent}% OFF</span>
                )}
              </div>
              
              <h1 className="font-serif text-3xl font-bold text-pine-dark mb-2">
                {tour.title}
              </h1>
              <p className="text-stone text-lg mb-4">{tour.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-stone">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold" />
                  {tour.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold" />
                  {formatDuration(tour.duration_days, tour.duration_nights)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold" />
                  {tour.group_size_min}-{tour.group_size_max} people
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="font-semibold text-pine-dark">{tour.rating || 4.5}</span>
                  <span>({tour.reviews_count || 0} reviews)</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-cream-dark">
              <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Overview</h2>
              <p className="text-stone leading-relaxed">{tour.description}</p>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-6 border border-cream-dark">
                <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Highlights</h2>
                <div className="grid grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-stone">
                      <Check className="w-5 h-5 text-gold" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-6 border border-cream-dark">
                <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-gold pl-4 pb-4">
                      <h3 className="font-semibold text-pine-dark">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-stone text-sm mt-1">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {day.activities.map((activity, i) => (
                            <span key={i} className="text-xs bg-cream px-2 py-1 rounded text-stone">
                              {activity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-cream-dark">
                  <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Inclusions</h2>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone">
                        <Check className="w-5 h-5 text-gold shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-cream-dark">
                  <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Exclusions</h2>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone">
                        <X className="w-5 h-5 text-stone/50 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget tour={tour} />
              
              {/* Contact Buttons */}
              <div className="bg-white rounded-xl p-6 mt-4 border border-cream-dark">
                <h3 className="font-serif font-semibold text-pine-dark mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+919876543210"
                    className="w-full inline-flex items-center justify-center gap-2 border border-cream-dark text-pine-dark font-medium py-2.5 rounded-lg hover:border-gold hover:bg-gold/5 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <a
                    href={`https://wa.me/919876543210?text=Hi! I'm interested in the tour: ${tour.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-pine-dark text-white font-medium py-2.5 rounded-lg hover:bg-pine transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
