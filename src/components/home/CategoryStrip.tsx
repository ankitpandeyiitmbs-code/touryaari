'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mountain, Palmtree, Tent, Compass, Sun, MapPin, Clock } from 'lucide-react';

const categories = [
  { icon: Mountain,  label: 'Road Trips',        href: '/tours?category=road-trip', category: 'road-trip' },
  { icon: Palmtree,  label: 'Spiritual Yatra',    href: '/tours?category=spiritual', category: 'spiritual' },
  { icon: Tent,      label: 'Weekend Getaways',   href: '/tours?category=weekend', category: 'weekend' },
  { icon: Compass,   label: 'Adventure Trekking', href: '/tours?category=trekking', category: 'trekking' },
  { icon: Sun,       label: 'Summer Escapes',     href: '/tours?category=summer', category: 'summer' },
  { icon: MapPin,    label: 'Custom Tours',        href: '/contact', category: null },
];

export default function CategoryStrip() {
  const [active, setActive] = useState('');
  const [tourCounts, setTourCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTourCounts();
  }, []);

  async function fetchTourCounts() {
    try {
      const response = await fetch('/api/tours/counts');
      const data = await response.json();
      setTourCounts(data.counts || {});
    } catch (error) {
      console.error('Error fetching tour counts:', error);
    }
  }

  return (
    <section className="bg-cream-dark border-y border-stone-light/50 py-4">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex gap-6 lg:gap-10 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = active === category.label;
            const hasTours = category.category ? (tourCounts[category.category] || 0) > 0 : true;
            const isUpcoming = category.category && !hasTours;
            
            return (
              <Link
                key={category.label}
                href={category.href}
                onClick={() => setActive(category.label)}
                className="flex flex-col items-center gap-1.5 py-2 min-w-fit transition-colors relative"
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pine' : 'text-text-mid hover:text-pine'}`} />
                  {isUpcoming && (
                    <div className="absolute -top-1 -right-1 bg-gold text-pine-dark text-[8px] font-bold px-1 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className={`text-[11px] font-semibold tracking-wide whitespace-nowrap ${isActive ? 'text-pine' : 'text-text-mid hover:text-pine'}`}>
                  {category.label}
                </span>
                {isUpcoming && (
                  <span className="text-[8px] text-gold font-medium">Upcoming</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
