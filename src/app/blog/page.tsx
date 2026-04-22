import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Travel Blog - Touryaari Travels',
  description: 'Travel tips, destination guides, and stories from Touryaari Travels.',
};

async function getBlogPosts() {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4">
            <span className="w-8 h-[1.5px] bg-gold" />
            Stories
            <span className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark mb-4">
            Travel Blog
          </h1>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Discover travel tips, destination guides, and inspiring stories from our journeys.
          </p>
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-12">
            <Link href={`/blog/${posts[0].slug}`} className="block group">
              <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-cream-dark">
                <div className="relative h-64 lg:h-96">
                  <Image
                    src={posts[0].featured_image_url || '/placeholder.jpg'}
                    alt={posts[0].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block w-fit mb-4 bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                    Featured
                  </span>
                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-pine-dark mb-4 group-hover:text-pine transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-stone mb-4 line-clamp-3">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-stone">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {posts[0].author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(posts[0].published_at)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-cream-dark">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featured_image_url || '/placeholder.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-sm text-stone mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2 text-pine-dark leading-snug line-clamp-2 group-hover:text-pine transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-stone text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="text-gold text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-stone">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
