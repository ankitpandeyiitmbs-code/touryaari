'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Tour } from '@/types';
import { formatPrice, formatDuration } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';
import { useSettings } from '@/components/providers/SettingsProvider';

// Sample tours for immediate display
const sampleTours: Tour[] = [
  {
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
    sub_category: null,
    duration_days: 9,
    duration_nights: 8,
    price_single: 45000,
    price_double: 38000,
    price_triple: 35000,
    price_quad: 32000,
    original_price: 52000,
    discount_percent: 13,
    group_size_min: 6,
    group_size_max: 15,
    difficulty: 'Challenging',
    thumbnail_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    gallery_images: null,
    itinerary: [],
    inclusions: null,
    exclusions: null,
    highlights: null,
    things_to_carry: null,
    faqs: [],
    activities: null,
    best_time: null,
    pickup_point: null,
    departure_city: null,
    booking_policy: null,
    cancellation_policy: null,
    rating: 4.9,
    reviews_count: 128,
    is_featured: true,
    is_popular: true,
    is_limited_seats: false,
    available_seats: null,
    is_active: true,
    meta_title: null,
    meta_description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
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
    sub_category: null,
    duration_days: 7,
    duration_nights: 6,
    price_single: 35000,
    price_double: 30000,
    price_triple: 28000,
    price_quad: 26000,
    original_price: 40000,
    discount_percent: 12,
    group_size_min: 4,
    group_size_max: 12,
    difficulty: 'Moderate',
    thumbnail_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800',
    gallery_images: null,
    itinerary: [],
    inclusions: null,
    exclusions: null,
    highlights: null,
    things_to_carry: null,
    faqs: [],
    activities: null,
    best_time: null,
    pickup_point: null,
    departure_city: null,
    booking_policy: null,
    cancellation_policy: null,
    rating: 4.8,
    reviews_count: 95,
    is_featured: true,
    is_popular: true,
    is_limited_seats: false,
    available_seats: null,
    is_active: true,
    meta_title: null,
    meta_description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '3',
    slug: 'chardham-yatra-2024',
    title: 'Chardham Yatra Package',
    subtitle: 'Spiritual Journey to Four Holy Shrines',
    description: 'Visit Yamunotri, Gangotri, Kedarnath & Badrinath',
    destination: 'Uttarakhand',
    location_detail: 'Char Dham Circuit',
    state: 'Uttarakhand',
    country: 'India',
    category: 'spiritual' as any,
    sub_category: null,
    duration_days: 10,
    duration_nights: 9,
    price_single: 55000,
    price_double: 48000,
    price_triple: 45000,
    price_quad: 42000,
    original_price: 62000,
    discount_percent: 11,
    group_size_min: 4,
    group_size_max: 20,
    difficulty: 'Moderate',
    thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    gallery_images: null,
    itinerary: [],
    inclusions: null,
    exclusions: null,
    highlights: null,
    things_to_carry: null,
    faqs: [],
    activities: null,
    best_time: null,
    pickup_point: null,
    departure_city: null,
    booking_policy: null,
    cancellation_policy: null,
    rating: 4.9,
    reviews_count: 210,
    is_featured: true,
    is_popular: true,
    is_limited_seats: false,
    available_seats: null,
    is_active: true,
    meta_title: null,
    meta_description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
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
    sub_category: null,
    duration_days: 3,
    duration_nights: 2,
    price_single: 15000,
    price_double: 12000,
    price_triple: 10000,
    price_quad: 9000,
    original_price: 18000,
    discount_percent: 17,
    group_size_min: 2,
    group_size_max: 15,
    difficulty: 'Challenging',
    thumbnail_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    gallery_images: null,
    itinerary: [],
    inclusions: null,
    exclusions: null,
    highlights: null,
    things_to_carry: null,
    faqs: [],
    activities: null,
    best_time: null,
    pickup_point: null,
    departure_city: null,
    booking_policy: null,
    cancellation_policy: null,
    rating: 4.8,
    reviews_count: 156,
    is_featured: true,
    is_popular: true,
    is_limited_seats: false,
    available_seats: null,
    is_active: true,
    meta_title: null,
    meta_description: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

export default function PopularToursSection() {
  const [tours, setTours] = useState<Tour[]>(sampleTours);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    const fetchTours = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('is_popular', true)
        .eq('is_active', true)
        .limit(4);
      if (data && data.length > 0) {
        setTours(data);
      }
      setLoading(false);
    };
    fetchTours();
  }, []);

  return (
    <section className="py-28 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
            >
              <span className="w-8 h-[1.5px] bg-gold" />
              What&apos;s New
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark mb-3"
            >
              {settings.popular_tours_heading?.split(' ').slice(0, -1).join(' ') || 'Popular'} <em className="text-pine-light">{settings.popular_tours_heading?.split(' ').pop() || 'Tours'}</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-mid max-w-md leading-relaxed"
            >
              {settings.popular_tours_subtext || 'Handpicked adventures loved by thousands of travelers'}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/tours" 
              className="inline-flex items-center gap-2 text-pine text-[13px] font-semibold tracking-widest uppercase border-b-[1.5px] border-pine pb-0.5 hover:text-gold hover:border-gold transition-colors mt-6 md:mt-0"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 3).map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href={`/tour/${tour.slug}`} 
                    className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-[220px] overflow-hidden">
                      <Image
                        src={tour.thumbnail_url || '/placeholder.jpg'}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                      />
                      {/* Category Badge */}
                      <span className="absolute top-3.5 left-3.5 bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                        {tour.category === 'road-trip' ? 'Road Trip' : tour.category === 'spiritual' ? 'Spiritual' : 'Adventure'}
                      </span>
                      {/* Favorite Button */}
                      <button className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                        <svg className="w-4 h-4 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      {/* Location */}
                      <div className="flex items-center gap-1 text-stone text-xs mb-2">
                        <MapPin className="w-3 h-3" />
                        {tour.destination}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-serif text-xl font-semibold text-pine-dark leading-snug mb-2 line-clamp-2 group-hover:text-pine transition-colors">
                        {tour.title}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-gold text-xs">★★★★★</span>
                        <span className="text-xs text-text-mid">{tour.rating || 4.5}</span>
                        <span className="text-xs text-stone">({tour.reviews_count || 10} reviews)</span>
                      </div>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-stone py-3 border-y border-cream-dark mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(tour.duration_days, tour.duration_nights)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {tour.group_size_min}-{tour.group_size_max} people
                        </span>
                      </div>
                      
                      {/* Footer - Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-stone">Starting from</div>
                          <div className="font-serif text-xl font-semibold text-pine">
                            {formatPrice(tour.price_double || tour.price_single)}
                            <span className="text-xs font-sans font-normal text-stone ml-1">/person</span>
                          </div>
                        </div>
                        <button className="bg-pine text-white text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded hover:bg-pine-light transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
