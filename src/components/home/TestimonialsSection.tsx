'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types';
import Skeleton from '@/components/ui/Skeleton';

// Sample testimonials for immediate display
const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    location: 'Delhi',
    tour_name: 'Manali-Leh Road Trip',
    rating: 5,
    review: 'An absolutely incredible experience! The team at Touryaari took care of every detail. The landscapes were breathtaking and the guides were knowledgeable and friendly.',
    is_active: true,
    is_featured: true,
    sort_order: 1,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Priya Patel',
    location: 'Mumbai',
    tour_name: 'Char Dham Yatra',
    rating: 5,
    review: 'The spiritual journey was transformative. Everything was perfectly organized from accommodation to transport. Highly recommend for anyone seeking a divine experience.',
    is_active: true,
    is_featured: true,
    sort_order: 2,
    created_at: '2024-01-01',
  },
  {
    id: '3',
    name: 'Arjun Mehta',
    location: 'Bangalore',
    tour_name: 'Spiti Valley Expedition',
    rating: 5,
    review: 'Spiti Valley exceeded all expectations. The local homestays, the culture, the monasteries - everything was authentic and beautiful. Thank you Touryaari!',
    is_active: true,
    is_featured: true,
    sort_order: 3,
    created_at: '2024-01-01',
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleTestimonials);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(6);
      if (data && data.length > 0) {
        setTestimonials(data);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-28 bg-cream relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
          >
            <span className="w-8 h-[1.5px] bg-gold" />
            Reviews
            <span className="w-8 h-[1.5px] bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark mb-4"
          >
            What Our <em className="text-pine-light">Travelers</em> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-mid max-w-lg mx-auto leading-relaxed"
          >
            Real stories from real travelers who have experienced journeys with Touryaari Travels
          </motion.p>
        </div>

        {loading ? (
          <Skeleton className="h-72 max-w-3xl mx-auto rounded-xl" />
        ) : testimonials.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-xl shadow-card p-10 md:p-14">
              <Quote className="absolute top-8 left-8 w-10 h-10 text-gold/20" />
              
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center relative z-10"
              >
                {/* Stars */}
                <div className="flex justify-center gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonials[currentIndex].rating
                          ? 'fill-gold text-gold'
                          : 'fill-cream text-stone/30'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="font-serif text-xl md:text-2xl text-pine-dark leading-relaxed mb-8">
                  &ldquo;{testimonials[currentIndex].review}&rdquo;
                </p>
                
                {/* Author */}
                <div>
                  <p className="font-serif font-semibold text-lg text-pine-dark">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-stone text-sm">
                    {testimonials[currentIndex].location}
                    {testimonials[currentIndex].tour_name && (
                      <span className="text-gold"> • {testimonials[currentIndex].tour_name}</span>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* Navigation */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-cream-dark flex items-center justify-center hover:border-gold hover:bg-gold/5 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-pine" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-cream-dark flex items-center justify-center hover:border-gold hover:bg-gold/5 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-pine" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-gold w-8' : 'bg-stone/30 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
