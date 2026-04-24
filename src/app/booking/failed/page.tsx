'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';

export default function BookingFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="max-w-[540px] mx-auto px-6 text-center">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
        <h1 className="font-serif text-3xl font-bold text-pine-dark mb-2">Payment Unsuccessful</h1>
        <p className="text-stone mb-2">Your payment could not be completed.</p>
        {bookingId && (
          <p className="text-sm text-stone mb-8">
            Booking reference: <span className="font-mono text-pine-dark">#{bookingId.slice(0,8).toUpperCase()}</span>
            <br />
            <span className="text-xs">Your booking has been saved. You can try paying again.</span>
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-gold text-pine-dark font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Payment Again
          </button>
          <a
            href="https://wa.me/918595689569"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </a>
          <Link
            href="/tours"
            className="w-full flex items-center justify-center border border-cream-dark text-stone py-3 rounded-lg hover:bg-cream transition-colors"
          >
            Browse Other Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
