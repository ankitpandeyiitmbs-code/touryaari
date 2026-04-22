import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://touryaaritravels.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch active tours
  const { data: tours } = await supabase
    .from('tours')
    .select('slug, updated_at')
    .eq('is_active', true);

  // Fetch published blog posts
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true);

  // Fetch destinations
  const { data: destinations } = await supabase
    .from('destinations')
    .select('slug, updated_at');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/tours`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/weekend-trips`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/international`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const tourRoutes: MetadataRoute.Sitemap = (tours || []).map((tour) => ({
    url: `${BASE_URL}/tour/${tour.slug}`,
    lastModified: new Date(tour.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = (destinations || []).map((dest) => ({
    url: `${BASE_URL}/destinations/${dest.slug}`,
    lastModified: new Date(dest.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...tourRoutes, ...blogRoutes, ...destinationRoutes];
}
