'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSettings } from '@/components/providers/SettingsProvider';

const defaultSlides = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=85',
    eyebrow: 'Himalayan Adventures',
    title: 'Explore the Unseen Himalayas',
    subtitle: 'Discover breathtaking landscapes, ancient monasteries, and the world\'s highest motorable passes.',
    cta1_text: 'Explore Tours',
    cta1_link: '/tours',
    cta2_text: 'Plan My Trip',
    cta2_link: '/contact',
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1920&q=85',
    eyebrow: 'Spiritual Journeys',
    title: 'Sacred Pilgrimages Await',
    subtitle: 'Walk the ancient paths to Kedarnath, Badrinath, and the divine Char Dham circuit.',
    cta1_text: 'View Yatras',
    cta1_link: '/tours?category=spiritual',
    cta2_text: 'Learn More',
    cta2_link: '/destinations',
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85',
    eyebrow: 'Beyond Borders',
    title: 'International Escapes',
    subtitle: 'From the mystical valleys of Bhutan to the pristine beaches of Bali and beyond.',
    cta1_text: 'International Tours',
    cta1_link: '/international',
    cta2_text: 'Destinations',
    cta2_link: '/destinations',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const router = useRouter();
  const settings = useSettings();

  useEffect(() => {
    const fetchSlides = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        setSlides(data);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (date) params.set('date', date);
    if (guests) params.set('guests', guests);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-end pb-32 overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="100vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-pine-dark/25 via-pine-dark/10 to-pine-dark/90" />
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
              className="inline-flex items-center gap-2.5 bg-gold/20 border border-gold/40 text-gold-light px-4 py-1.5 rounded-sm text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              <span className="w-5 h-px bg-gold" />
              {slides[currentSlide].eyebrow}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] tracking-tight mb-6"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/80 max-w-lg mb-10 font-light leading-relaxed"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={slides[currentSlide].cta1_link || '/tours'}
                className="inline-flex items-center gap-2 bg-gold text-pine-dark px-6 py-3 rounded text-sm font-semibold tracking-wider uppercase hover:bg-gold-light hover:-translate-y-px transition-all"
              >
                {slides[currentSlide].cta1_text || 'Explore Tours'}
              </Link>
              <Link
                href={slides[currentSlide].cta2_link || '/contact'}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded text-sm font-medium hover:bg-white/20 transition-all"
              >
                {slides[currentSlide].cta2_text || 'Contact Us'}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-white rounded-xl p-8 shadow-lg max-w-4xl pointer-events-auto relative z-30"
        >
          <form onSubmit={handleSearch}>
            <div className="flex items-center gap-2 text-stone text-xs font-semibold tracking-widest uppercase mb-5">
              <span className="flex-1 h-px bg-cream-dark" />
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                Find Your Perfect Journey
              </span>
              <span className="flex-1 h-px bg-cream-dark" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone tracking-widest uppercase flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tours..."
                  className="border-[1.5px] border-cream-dark rounded px-3.5 py-2.5 text-sm text-pine-dark bg-white focus:border-pine focus:ring-2 focus:ring-pine/10 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone tracking-widest uppercase flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border-[1.5px] border-cream-dark rounded px-3.5 py-2.5 text-sm text-pine-dark bg-white focus:border-pine focus:ring-2 focus:ring-pine/10 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-stone tracking-widest uppercase flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  Travellers
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="border-[1.5px] border-cream-dark rounded px-3.5 py-2.5 text-sm text-pine-dark bg-white focus:border-pine focus:ring-2 focus:ring-pine/10 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="3-5">3-5 People</option>
                  <option value="6+">6+ People</option>
                </select>
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 bg-pine text-white px-6 py-3 rounded text-sm font-semibold tracking-wide uppercase hover:bg-pine-light transition-all">
                Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-pine-dark/90 backdrop-blur-md border-t border-gold/20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex justify-around items-center h-[72px]">
            {[
              { number: settings.stat1_number || '500+', label: settings.stat1_label || 'Happy Travelers' },
              { number: settings.stat2_number || '50+', label: settings.stat2_label || 'Destinations' },
              { number: settings.stat3_number || '100+', label: settings.stat3_label || 'Tours Completed' },
              { number: settings.stat4_number || '4.9', label: settings.stat4_label || 'Average Rating' },
            ].map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-serif text-2xl font-semibold text-gold">{stat.number}</div>
                  <div className="text-[11px] font-medium text-white/55 tracking-widest uppercase">{stat.label}</div>
                </div>
                {index < 3 && (
                  <div className="w-px h-8 bg-gold/20 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
