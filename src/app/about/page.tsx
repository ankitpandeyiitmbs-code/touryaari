import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Touryaari Travels',
  description: 'Learn about Touryaari Travels - your trusted partner for unforgettable journeys across India and beyond.',
};

const stats = [
  { number: '10,000+', label: 'Happy Travelers' },
  { number: '500+', label: 'Tours Completed' },
  { number: '15+', label: 'Years Experience' },
  { number: '4.9', label: 'Average Rating' },
];

const values = [
  {
    icon: CheckCircle,
    title: 'Customer First',
    description: 'We prioritize your comfort, safety, and satisfaction above everything else.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Handpicked accommodations, expert guides, and carefully curated itineraries.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our experienced team knows every destination like the back of their hand.',
  },
  {
    icon: Globe,
    title: 'Local Insights',
    description: 'Authentic experiences that connect you with local culture and traditions.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Our Story
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-6">
            About Touryaari Travels
          </h1>
          <p className="text-stone text-lg max-w-3xl mx-auto leading-relaxed">
            Your Journey, Our Passion. Since 2010, we&apos;ve been creating unforgettable 
            travel experiences that bring people closer to the beauty of India and the world.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-card border border-cream-dark">
              <div className="text-3xl md:text-4xl font-serif font-bold text-gold mb-2">{stat.number}</div>
              <div className="text-stone font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/about-hero.jpg"
              alt="Touryaari Travels Team"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-pine-dark mb-4">
              Our Journey
            </h2>
            <div className="space-y-4 text-text-mid leading-relaxed">
              <p>
                Founded in 2010, Touryaari Travels began with a simple mission: to help travelers 
                discover the hidden gems of India. What started as a small operation in Manali 
                has grown into one of India&apos;s most trusted travel companies.
              </p>
              <p>
                Over the years, we&apos;ve taken thousands of travelers on incredible journeys 
                across the Himalayas, to spiritual destinations, and international adventures. 
                Our deep local knowledge and commitment to quality have made us the preferred 
                choice for travelers seeking authentic experiences.
              </p>
              <p>
                Today, we continue to innovate and expand, bringing you carefully crafted tours 
                that combine adventure, comfort, and cultural immersion. Whether you&apos;re a 
                solo traveler, a family, or a group of friends, we have the perfect journey waiting 
                for you.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
              <span className="w-8 h-[1.5px] bg-gold" />
              What We Stand For
              <span className="w-8 h-[1.5px] bg-gold" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-pine-dark mb-4">
              Our Values
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              These core principles guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-cream-dark">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-pine-dark mb-2">{value.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-pine-dark rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Why Choose Touryaari Travels?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            From personalized service to 24/7 support, we go above and beyond to ensure 
            your journey is nothing short of extraordinary.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
