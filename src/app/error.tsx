'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="font-serif text-6xl font-bold text-gold mb-4">Oops!</h1>
        <h2 className="font-serif text-2xl font-bold text-pine-dark mb-4">
          Something went wrong
        </h2>
        <p className="text-stone mb-8 leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred. 
          Please try again or contact our support team if the problem persists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 border border-pine text-pine-dark font-medium px-6 py-3 rounded-lg hover:bg-pine hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
