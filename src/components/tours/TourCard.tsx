import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { Tour } from '@/types';
import { formatPrice, formatDuration } from '@/lib/utils';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tour/${tour.slug}`} className="block h-full group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={tour.thumbnail_url || '/placeholder.jpg'}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        {tour.discount_percent > 0 && (
          <span className="absolute top-3 left-3 bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
            {tour.discount_percent}% OFF
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-pine-dark/80 to-transparent">
          <div className="flex items-center gap-1 text-white text-sm">
            <MapPin className="w-4 h-4" />
            {tour.destination}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-stone mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(tour.duration_days, tour.duration_nights)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {tour.group_size_min}-{tour.group_size_max} people
          </span>
        </div>
        <h3 className="font-serif font-semibold text-lg mb-2 text-pine-dark leading-snug line-clamp-2 group-hover:text-pine transition-colors">
          {tour.title}
        </h3>
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="text-sm font-semibold text-pine-dark">{tour.rating || 4.5}</span>
          <span className="text-xs text-stone">({tour.reviews_count || 10} reviews)</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-cream-dark">
          <div>
            <span className="text-xs text-stone">Starting from</span>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-semibold text-pine-dark">
                {formatPrice(tour.price_single)}
              </span>
              {tour.original_price && (
                <span className="text-sm text-stone line-through">
                  {formatPrice(tour.original_price)}
                </span>
              )}
            </div>
          </div>
          <span className="text-[13px] font-semibold text-gold uppercase tracking-wide">View Details</span>
        </div>
      </div>
    </Link>
  );
}
