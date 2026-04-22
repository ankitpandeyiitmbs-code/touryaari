import { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Gallery - Touryaari Travels',
  description: 'Explore our travel gallery showcasing beautiful destinations and memorable moments.',
};

async function getGalleryImages() {
  const supabase = createClient();
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

// Sample gallery images for display
const sampleGalleryImages = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', caption: 'Leh Ladakh Adventure', is_active: true, sort_order: 1 },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800', caption: 'Spiti Valley Views', is_active: true, sort_order: 2 },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Kedarnath Temple', is_active: true, sort_order: 3 },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', caption: 'Manali Mountains', is_active: true, sort_order: 4 },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Beach Paradise', is_active: true, sort_order: 5 },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', caption: 'Bhutan Journey', is_active: true, sort_order: 6 },
  { id: '7', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', caption: 'Mountain Trek', is_active: true, sort_order: 7 },
  { id: '8', image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', caption: 'Scenic Views', is_active: true, sort_order: 8 },
];

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const displayImages = images.length > 0 ? images : sampleGalleryImages;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Memories
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-4">
            Photo Gallery
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Capturing beautiful moments from our journeys across incredible destinations.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-xl group ${
                index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative ${index % 5 === 0 ? 'h-80 md:h-96' : 'h-48'}`}>
                <Image
                  src={image.image_url}
                  alt={image.caption || 'Gallery image'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-stone">Gallery coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
