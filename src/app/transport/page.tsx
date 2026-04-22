import { Metadata } from 'next';
import TransportBooking from '@/components/transport/TransportBooking';

export const metadata: Metadata = {
  title: 'Transport Booking - Touryaari Travels',
  description: 'Book comfortable and reliable transport for your journey. Choose from sedans, SUVs, tempo travelers, and buses.',
};

export default function TransportPage() {
  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Transport Services
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-3">
            Book Your Transport
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Choose from our wide range of vehicles for a comfortable and safe journey
          </p>
        </div>

        <TransportBooking />
      </div>
    </div>
  );
}
