'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import { Tour } from '@/types';
import BookingForm from '@/components/booking/BookingForm';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { formatPrice, formatDuration } from '@/lib/utils';

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      setTour(data);
      setLoading(false);
    };
    fetchTour();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-6">The tour you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/tours" className="btn-primary">
            Browse All Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tours" className="hover:text-accent">Tours</Link>
          <span className="mx-2">/</span>
          <Link href={`/tour/${tour.slug}`} className="hover:text-accent">{tour.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Book</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Link
              href={`/tour/${tour.slug}`}
              className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tour Details
            </Link>

            <div className="bg-white rounded-xl p-6 shadow-card">
              <h1 className="text-2xl font-heading font-bold text-primary mb-6">
                Book Your Trip
              </h1>
              <BookingForm tour={tour} />
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="font-heading font-semibold text-lg text-primary mb-4">
                  Tour Summary
                </h3>
                <div className="flex gap-4 mb-4">
                  <img
                    src={tour.thumbnail_url || '/placeholder.jpg'}
                    alt={tour.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-primary">{tour.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      {tour.destination}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(tour.duration_days, tour.duration_nights)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-sm text-accent-dark">
                  <strong>Need Help?</strong> Call us at{' '}
                  <a href="tel:+918595689569" className="underline">
                    +91 85956 89569
                  </a>{' '}
                  or{' '}
                  <a href="https://wa.me/918595689569" className="underline">
                    WhatsApp us
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}
