'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/types';
import { formatDate } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';

// Sample blog posts for immediate display
const samplePosts: BlogPost[] = [
  {
    id: '1',
    slug: 'essential-tips-for-leh-ladakh-trip',
    title: '10 Essential Tips for Your First Leh Ladakh Trip',
    excerpt: 'Everything you need to know before embarking on your Himalayan adventure. From acclimatization to packing essentials.',
    content: '<p>Content here...</p>',
    cover_image: 'https://images.unsplash.com/photo-1563286094-8b90030e1d8a?w=600',
    author_name: 'Touryaari Team',
    author_avatar: null,
    category: 'Travel Tips',
    tags: ['Ladakh', 'Himalayas', 'Road Trip'],
    is_featured: true,
    is_published: true,
    views_count: 0,
    read_time: 8,
    meta_title: null,
    meta_description: null,
    published_at: '2024-01-15',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    slug: 'kedarnath-trek-guide-2024',
    title: 'Complete Kedarnath Trek Guide 2024',
    excerpt: 'A comprehensive guide to the sacred Kedarnath trek including route details, best time to visit, and accommodation options.',
    content: '<p>Content here...</p>',
    cover_image: 'https://images.unsplash.com/photo-1589779293338-c3b0ada7d824?w=600',
    author_name: 'Touryaari Team',
    author_avatar: null,
    category: 'Travel Tips',
    tags: ['Kedarnath', 'Trekking', 'Pilgrimage'],
    is_featured: true,
    is_published: true,
    views_count: 0,
    read_time: 10,
    meta_title: null,
    meta_description: null,
    published_at: '2024-01-10',
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
  },
  {
    id: '3',
    slug: 'spiti-valley-road-trip',
    title: 'Ultimate Spiti Valley Road Trip Itinerary',
    excerpt: 'Discover the untouched beauty of Spiti Valley with our detailed 7-day road trip itinerary covering all major attractions.',
    content: '<p>Content here...</p>',
    cover_image: 'https://images.unsplash.com/photo-1519883361061-b09e8d2f279f?w=600',
    author_name: 'Touryaari Team',
    author_avatar: null,
    category: 'Travel Tips',
    tags: ['Spiti', 'Road Trip', 'Himachal'],
    is_featured: true,
    is_published: true,
    views_count: 0,
    read_time: 12,
    meta_title: null,
    meta_description: null,
    published_at: '2024-01-05',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
  },
];

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      if (data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-28 bg-cream">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-gold text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
            >
              <span className="w-8 h-[1.5px] bg-gold" />
              Travel Blog
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-semibold text-pine-dark mb-3"
            >
              Travel Tips & <em className="text-pine-light">Guides</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-mid max-w-md leading-relaxed"
            >
              Insights and inspiration for your next adventure
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-pine text-[13px] font-semibold tracking-widest uppercase border-b-[1.5px] border-pine pb-0.5 hover:text-gold hover:border-gold transition-colors mt-6 md:mt-0"
            >
              View All Articles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={post.cover_image || '/placeholder.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    />
                    {/* Category Badge */}
                    <span className="absolute bottom-3 left-3 bg-pine-dark text-gold-light text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                      Travel Tips
                    </span>
                  </div>
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-stone mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time} min read
                        </span>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="font-serif text-lg font-semibold text-pine-dark leading-snug mb-2 line-clamp-2 group-hover:text-pine transition-colors">
                      {post.title}
                    </h3>
                    {/* Excerpt */}
                    <p className="text-text-mid text-sm line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    {/* Read More Link */}
                    <span className="inline-flex items-center gap-1.5 text-pine text-sm font-medium group-hover:text-gold transition-colors">
                      Read More 
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
