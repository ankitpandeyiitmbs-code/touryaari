'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface State {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  tour_count?: number;
}

const fallbackStates: State[] = [
  {
    id: '1',
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    description: 'Sacred ghats, ancient temples and spiritual journeys',
    image_url: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200',
  },
  {
    id: '2',
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    description: 'Snow-capped Himalayas, valley treks, ancient temples and spiritual journeys',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200',
  },
];

export default function StatesSection() {
  const [states, setStates] = useState<State[]>(fallbackStates);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStates = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('states')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) setStates(data);

      // Fetch tour counts per state
      const { data: tours } = await supabase
        .from('tours')
        .select('state_slug')
        .eq('is_active', true);
      if (tours) {
        const c: Record<string, number> = {};
        tours.forEach((t) => { if (t.state_slug) c[t.state_slug] = (c[t.state_slug] || 0) + 1; });
        setCounts(c);
      }
    };
    fetchStates();
  }, []);

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 text-gold text-[11px] font-semibold tracking-[0.16em] uppercase mb-4"
          >
            <span className="w-8 h-[1.5px] bg-gold" />
            Explore by Region
            <span className="w-8 h-[1.5px] bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark"
          >
            Choose Your <em className="text-pine-light not-italic">Destination</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-text-mid max-w-xl mx-auto leading-relaxed"
          >
            Hand-picked journeys through India's most sacred and spectacular landscapes
          </motion.p>
        </div>

        {/* State Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {states.map((state, i) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link href={`/states/${state.slug}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
                {/* Background image with uniform object-cover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${state.image_url})` }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/90 via-pine-dark/30 to-transparent" />

                {/* Top badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="text-white text-xs font-medium tracking-wide">
                    {counts[state.slug] !== undefined ? `${counts[state.slug]} Tours` : 'Explore Tours'}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-2">
                    {state.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-sm">
                    {state.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm font-semibold tracking-wider uppercase border-b border-gold/60 pb-0.5 group-hover:gap-3 transition-all">
                    View Tours <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
