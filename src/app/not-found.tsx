import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="font-serif text-9xl font-bold text-gold/30">404</h1>
        <h2 className="font-serif text-3xl font-bold text-pine-dark mb-4 -mt-8">
          Page Not Found
        </h2>
        <p className="text-stone mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for seems to have wandered off on its own adventure. 
          Let&apos;s get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 bg-gold text-pine-dark font-semibold tracking-wide px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link 
            href="/tours" 
            className="inline-flex items-center justify-center gap-2 border border-pine text-pine-dark font-medium px-6 py-3 rounded-lg hover:bg-pine hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
