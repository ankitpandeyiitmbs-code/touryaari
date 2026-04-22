'use client';

import { motion } from 'framer-motion';
import { Shield, Map, CreditCard, Car, Home, Users, Award, Phone } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

const defaultFeatures = [
  { icon: Shield, title: 'Safe & Secure', description: 'Your safety is our priority. We follow strict safety protocols and provide 24/7 support during your journey.' },
  { icon: Map, title: 'Expert Guides', description: 'Our local guides are experienced professionals who know every trail and story of the region.' },
  { icon: CreditCard, title: 'Best Prices', description: 'Get the best value for your money with our competitive pricing and no hidden costs.' },
  { icon: Car, title: 'Comfortable Transport', description: 'Travel in well-maintained vehicles with experienced drivers who know the terrain.' },
  { icon: Home, title: 'Quality Stay', description: 'Handpicked accommodations that offer comfort and authentic local experiences.' },
  { icon: Users, title: 'Small Groups', description: 'Intimate group sizes ensure personalized attention and better experiences.' },
  { icon: Award, title: 'Award Winning', description: 'Recognized for excellence in travel services with 4.9/5 average rating.' },
  { icon: Phone, title: '24/7 Support', description: 'Our dedicated team is always available to assist you before, during, and after your trip.' },
];

export default function WhyChooseUs() {
  const settings = useSettings();
  
  // Build features from settings or use defaults
  const features = [
    { icon: Shield, title: settings.why1_title || defaultFeatures[0].title, description: settings.why1_text || defaultFeatures[0].description },
    { icon: Map, title: settings.why2_title || defaultFeatures[1].title, description: settings.why2_text || defaultFeatures[1].description },
    { icon: CreditCard, title: settings.why3_title || defaultFeatures[2].title, description: settings.why3_text || defaultFeatures[2].description },
    { icon: Car, title: settings.why4_title || defaultFeatures[3].title, description: settings.why4_text || defaultFeatures[3].description },
    { icon: Home, title: settings.why5_title || defaultFeatures[4].title, description: settings.why5_text || defaultFeatures[4].description },
    { icon: Users, title: settings.why6_title || defaultFeatures[5].title, description: settings.why6_text || defaultFeatures[5].description },
    { icon: Award, title: settings.why7_title || defaultFeatures[6].title, description: settings.why7_text || defaultFeatures[6].description },
    { icon: Phone, title: settings.why8_title || defaultFeatures[7].title, description: settings.why8_text || defaultFeatures[7].description },
  ].filter(f => f.title);

  return (
    <section className="py-28 bg-pine-dark relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
          >
            <span className="w-8 h-[1.5px] bg-gold" />
            Why {settings.site_name?.split(' ')[0] || 'Touryaari'}
            <span className="w-8 h-[1.5px] bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4"
          >
            {settings.why_choose_heading || 'Why Choose Us'.split(' ').slice(0, -1).join(' ')} <em className="text-gold-light">{settings.why_choose_heading?.split(' ').pop() || 'Us'}</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-lg mx-auto leading-relaxed"
          >
            {settings.why_choose_subtext || 'We make your travel dreams come true with exceptional service and unforgettable experiences'}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/20 border border-gold/20 rounded-xl overflow-hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-pine-dark p-8 hover:bg-gold/5 transition-colors"
            >
              <div className="w-12 h-12 bg-gold/10 rounded flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
