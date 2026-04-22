'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Star, MapPin, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface State {
  id: string; name: string; slug: string; description: string;
  image_url: string; hero_image: string;
}
interface Tour {
  id: string; title: string; slug: string; thumbnail_url: string;
  duration_days: number; duration_nights: number; price_single: number;
  original_price: number; discount_percent: number; difficulty: string;
  highlights: string[]; destination: string; is_featured: boolean;
  group_size_max: number; state_slug: string;
}

export default function StateToursPage() {
  const { slug } = useParams() as { slug: string };
  const [state, setState] = useState<State | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: stateData } = await supabase
        .from('states').select('*').eq('slug', slug).single();
      if (stateData) setState(stateData);

      const { data: toursData } = await supabase
        .from('tours').select('*')
        .eq('state_slug', slug).eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (toursData) setTours(toursData);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918595689569';

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${state?.hero_image || state?.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/85 via-pine-dark/40 to-pine-dark/20" />
        <div className="relative h-full flex flex-col justify-end max-w-[1200px] mx-auto px-6 lg:px-12 pb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors self-start mt-6 pt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.16em] uppercase mb-3">
              <MapPin className="w-3.5 h-3.5" /> {tours.length} Tours Available
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-3">
              {state?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </h1>
            <p className="text-white/70 max-w-xl leading-relaxed">{state?.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">
        {tours.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-14 h-14 text-stone-light mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-pine-dark mb-2">No tours yet</h3>
            <p className="text-text-mid mb-8">We're adding tours for {state?.name} soon.</p>
            <a
              href={`https://wa.me/${whatsappNum}?text=Hi! I'm interested in tours to ${state?.name}. Can you help?`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1ebe5d] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {tours.map((tour, i) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Fixed-ratio image container — no layout shift regardless of upload */}
                <Link href={`/tours/${tour.slug}`} className="block relative aspect-[4/3] overflow-hidden">
                  {tour.thumbnail_url ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${tour.thumbnail_url})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-pine/20 to-pine-dark/30 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-pine/30" />
                    </div>
                  )}
                  {tour.is_featured && (
                    <div className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  {tour.discount_percent > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      -{tour.discount_percent}%
                    </div>
                  )}
                </Link>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-text-mid text-xs mb-2">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>{tour.destination}</span>
                    {tour.difficulty && (
                      <>
                        <span className="text-stone-light">·</span>
                        <span className={`font-medium ${
                          tour.difficulty === 'Easy' ? 'text-green-600' :
                          tour.difficulty === 'Moderate' ? 'text-yellow-600' :
                          'text-red-500'
                        }`}>{tour.difficulty}</span>
                      </>
                    )}
                  </div>
                  <Link href={`/tours/${tour.slug}`}>
                    <h3 className="font-serif text-lg font-semibold text-pine-dark mb-3 leading-tight group-hover:text-pine transition-colors line-clamp-2">
                      {tour.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-text-mid mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {tour.duration_days}D / {tour.duration_nights}N
                    </span>
                    {tour.group_size_max > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold" />
                        Max {tour.group_size_max}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-light/50">
                    <div>
                      {tour.original_price > tour.price_single && (
                        <div className="text-xs text-text-mid line-through">
                          ₹{tour.original_price.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="font-semibold text-pine-dark text-lg">
                        ₹{tour.price_single.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-text-mid ml-1">/person</span>
                      </div>
                    </div>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="text-xs font-semibold text-pine border border-pine rounded-full px-4 py-2 hover:bg-pine hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* WhatsApp CTA */}
        {tours.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-pine rounded-2xl p-8 text-center"
          >
            <h3 className="font-serif text-2xl font-semibold text-white mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-white/70 mb-6">Talk to us directly and we'll create a custom tour just for you.</p>
            <a
              href={`https://wa.me/${whatsappNum}?text=Hi! I'm interested in a custom tour to ${state?.name}. Can you help me plan?`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
