'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Destination } from '@/types';
import Skeleton from '@/components/ui/Skeleton';
import { useSettings } from '@/components/providers/SettingsProvider';

// Sample destinations for immediate display
const sampleDestinations: Destination[] = [
  {
    id: '1',
    name: 'Leh Ladakh',
    slug: 'leh-ladakh',
    short_description: 'Land of high passes and ancient monasteries',
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    tour_count: 12,
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Spiti Valley',
    slug: 'spiti-valley',
    short_description: 'The middle land between India and Tibet',
    image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800',
    tour_count: 8,
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '3',
    name: 'Kedarnath',
    slug: 'kedarnath',
    short_description: 'Sacred abode of Lord Shiva',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    tour_count: 6,
    is_active: true,
    sort_order: 3,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '4',
    name: 'Manali',
    slug: 'manali',
    short_description: 'Valley of gods and adventure hub',
    image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    tour_count: 15,
    is_active: true,
    sort_order: 4,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '5',
    name: 'Bhutan',
    slug: 'bhutan',
    short_description: 'Kingdom of happiness',
    image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    tour_count: 5,
    is_active: true,
    sort_order: 5,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

export default function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>(sampleDestinations);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    const fetchDestinations = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(5);
      if (data && data.length > 0) {
        setDestinations(data);
      }
      setLoading(false);
    };
    fetchDestinations();
  }, []);

  return (
    <section className="py-28 bg-white">
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
              Places to Go
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark mb-3"
            >
              {settings.destinations_heading?.split(' ').slice(0, -1).join(' ') || 'Perfect'} <em className="text-pine-light">{settings.destinations_heading?.split(' ').pop() || 'Destinations'}</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-mid max-w-md leading-relaxed"
            >
              {settings.destinations_subtext || 'From the snow-capped peaks of the Himalayas to pristine beaches, discover breathtaking destinations.'}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/destinations" 
              className="inline-flex items-center gap-2 text-pine text-[13px] font-semibold tracking-widest uppercase border-b-[1.5px] border-pine pb-0.5 hover:text-gold hover:border-gold transition-colors mt-6 md:mt-0"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className={`h-[220px] rounded ${i === 1 ? 'col-span-2 row-span-2 h-full min-h-[448px]' : ''}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[500px]">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded cursor-pointer group ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <Link href={`/destinations/${dest.slug}`} className="block w-full h-full">
                  <Image
                    src={dest.image_url || '/placeholder.jpg'}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/80 via-pine-dark/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <div className="text-white/65 text-xs mb-0.5">{dest.tour_count} Tours</div>
                    <h3 className={`font-serif font-semibold text-white ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                      {dest.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
