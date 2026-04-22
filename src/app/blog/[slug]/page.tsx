import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getBlogPost(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} - Touryaari Travels Blog`,
    description: post.excerpt || '',
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{post.title}</span>
        </nav>

        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-card">
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        {/* Share Section */}
        <div className="mt-8 p-6 bg-accent/10 rounded-xl">
          <h3 className="font-semibold text-primary mb-2">Enjoyed this article?</h3>
          <p className="text-gray-600 text-sm">
            Share it with your friends and follow us for more travel stories!
          </p>
        </div>
      </div>
    </div>
  );
}
