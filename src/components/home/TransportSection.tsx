import Link from 'next/link';
import { Car, Bus, ArrowRight } from 'lucide-react';

export default function TransportSection() {
  return (
    <div className="py-16 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Transport Services
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-pine-dark mb-3">
            Book Your Transport
          </h2>
          <p className="text-stone max-w-2xl mx-auto">
            Reliable and comfortable transport for local and outstation travel. Choose from sedans, SUVs, tempo travelers, and buses.
          </p>
        </div>

        {/* Transport Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Local */}
          <div className="bg-white rounded-xl p-6 border border-cream-dark hover:shadow-card transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-pine-dark mb-2">Local (Same Day)</h3>
            <p className="text-stone text-sm mb-4">
              Within city limits. Perfect for sightseeing, airport transfers, and local errands.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone">Sedan</span>
                <span className="font-medium text-pine-dark">₹1,900</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone">SUV</span>
                <span className="font-medium text-pine-dark">₹2,600</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone">Tempo (12 seater)</span>
                <span className="font-medium text-pine-dark">₹6,500</span>
              </div>
            </div>
            <p className="text-xs text-stone/60 mb-4">*Parking included</p>
            <Link
              href="/transport"
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:text-gold-light"
            >
              Book Local <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Outstation */}
          <div className="bg-white rounded-xl p-6 border border-cream-dark hover:shadow-card transition-shadow">
            <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <Bus className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-pine-dark mb-2">Outstation</h3>
            <p className="text-stone text-sm mb-4">
              Inter-city travel. Ideal for weekend getaways, family trips, and business travel.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone">Sedan</span>
                <span className="font-medium text-pine-dark">₹13/km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone">SUV</span>
                <span className="font-medium text-pine-dark">₹17/km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone">Tempo (12 seater)</span>
                <span className="font-medium text-pine-dark">₹27/km</span>
              </div>
            </div>
            <p className="text-xs text-stone/60 mb-4">*Toll, parking, state tax extra</p>
            <Link
              href="/transport"
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:text-gold-light"
            >
              Book Outstation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Fleet Info */}
          <div className="bg-pine-dark rounded-xl p-6 text-white">
            <h3 className="font-serif text-xl font-semibold mb-4">Our Fleet</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                Sedan (Dzire/Etios) - 4 seats
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                SUV (Ertiga/Innova) - 6 seats
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                Tempo Traveller - 12/16/24 seats
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                Bus - 50 seats
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-pine/20">
              <p className="text-xs text-stone/80 mb-3">All vehicles include:</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gold/20 px-2 py-1 rounded">AC</span>
                <span className="text-xs bg-gold/20 px-2 py-1 rounded">Experienced Driver</span>
                <span className="text-xs bg-gold/20 px-2 py-1 rounded">Music System</span>
              </div>
            </div>
            <Link
              href="/transport"
              className="inline-flex items-center gap-2 mt-6 bg-gold text-pine-dark font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
            >
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/transport"
            className="inline-flex items-center gap-2 bg-pine text-white font-semibold tracking-wide px-8 py-3 rounded-lg hover:bg-pine-dark transition-colors"
          >
            View All Vehicles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
