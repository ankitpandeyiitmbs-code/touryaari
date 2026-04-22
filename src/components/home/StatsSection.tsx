'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar, Award } from 'lucide-react';

const stats = [
  { icon: Calendar, number: '500+', label: 'Trips Completed' },
  { icon: Users, number: '15,000+', label: 'Happy Travellers' },
  { icon: Award, number: '8+', label: 'Years Experience' },
  { icon: MapPin, number: '50+', label: 'Destinations Covered' },
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white font-heading mb-2">
                {stat.number}
              </div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
