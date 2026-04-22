'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, Sun, Tag } from 'lucide-react';

const specialTours = [
  {
    id: 1,
    title: 'International Trips',
    subtitle: 'Explore beyond borders',
    description: 'Discover the world with our curated international packages to Bhutan, Bali, Nepal, Dubai and more.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    link: '/international',
    icon: Plane,
    size: 'large', // Takes up more space
  },
  {
    id: 2,
    title: 'Summer Escapes',
    subtitle: 'Beat the heat',
    description: 'Escape to the cool Himalayas this summer. Limited seats available for Leh, Ladakh & Spiti trips.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    link: '/tours?category=road-trip',
    icon: Sun,
    size: 'normal',
  },
  {
    id: 3,
    title: 'Exclusive Deals',
    subtitle: 'Up to 20% off',
    description: 'Special discounts on select tours. Book now and save big on your next adventure.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    link: '/tours',
    icon: Tag,
    size: 'normal',
  },
];

export default function SpecialToursSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
          >
            <span className="w-8 h-[1.5px] bg-gold" />
            Limited Time Offers
            <span className="w-8 h-[1.5px] bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark mb-4"
          >
            Special <em className="text-pine-light">Tours</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-mid max-w-xl mx-auto leading-relaxed"
          >
            Exclusive packages and limited-time offers for your next adventure
          </motion.p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-1.5 rounded-xl overflow-hidden">
          {specialTours.map((tour, index) => {
            const Icon = tour.icon;
            return (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link 
                  href={tour.link} 
                  className="group relative block overflow-hidden min-h-[380px] flex flex-col justify-end p-8 cursor-pointer"
                >
                  {/* Background Image */}
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/90 via-pine-dark/20 to-transparent z-[1] transition-all duration-400 group-hover:from-pine-dark/95 group-hover:via-pine-dark/30" />
                  
                  {/* Content */}
                  <div className="relative z-[2]">
                    {/* Badge */}
                    <span className="inline-block bg-gold text-pine-dark text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm mb-3">
                      {tour.subtitle}
                    </span>
                    
                    {/* Title */}
                    <h3 className="font-serif text-2xl lg:text-[1.7rem] font-semibold text-white leading-tight mb-2">
                      {tour.title}
                    </h3>
                    
                    {/* Description - expands on hover */}
                    <p className="text-[13px] text-white/75 leading-relaxed mb-4 max-h-0 overflow-hidden transition-all duration-400 group-hover:max-h-20">
                      {tour.description}
                    </p>
                    
                    {/* CTA */}
                    <span className="inline-flex items-center gap-1.5 text-gold-light text-xs font-semibold tracking-widest uppercase">
                      Explore Now
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
