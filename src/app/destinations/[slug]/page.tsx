import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Destination, Tour } from '@/types';
import TourCard from '@/components/tours/TourCard';

interface DestinationPageProps {
  params: { slug: string };
}

async function getDestination(slug: string): Promise<Destination | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

async function getToursByDestination(destinationName: string): Promise<Tour[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('tours')
    .select('*')
    .eq('destination', destinationName)
    .eq('is_active', true)
    .order('is_featured', { ascending: false });
  return data || [];
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const destination = await getDestination(params.slug);
  if (!destination) return { title: 'Destination Not Found' };
  
  return {
    title: `${destination.name} - Touryaari Travels`,
    description: destination.meta_description || destination.short_description || '',
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const destination = await getDestination(params.slug);
  
  if (!destination) {
    notFound();
  }

  const tours = await getToursByDestination(destination.name);

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/destinations" className="hover:text-accent">Destinations</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{destination.name}</span>
        </nav>

        {/* Hero */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-12">
          <Image
            src={destination.image_url || '/placeholder.jpg'}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
              {destination.name}
            </h1>
            <p className="text-white/90 text-lg max-w-xl">
              {destination.short_description}
            </p>
          </div>
        </div>

        {/* Description */}
        {destination.description && (
          <div className="bg-white rounded-xl p-8 shadow-card mb-12">
            <h2 className="text-2xl font-heading font-bold text-primary mb-4">
              About {destination.name}
            </h2>
            <div 
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: destination.description }}
            />
          </div>
        )}

        {/* Tours */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">
            Tours in {destination.name}
          </h2>
          
          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 mb-4">No tours available for this destination yet.</p>
              <Link href="/tours" className="btn-primary">
                Browse All Tours
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
