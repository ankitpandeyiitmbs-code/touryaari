'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    cover_image: '',
    author_name: '',
    is_published: false,
    is_featured: false,
    read_time: 5,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          published_at: formData.is_published ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">New Blog Post</h1>
          <p className="text-stone mt-1">Create a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="travel, tips, india"
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={12}
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => handleChange('cover_image', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
            {formData.cover_image && <img src={formData.cover_image} alt="Preview" className="mt-4 w-48 h-32 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Author Name</label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) => handleChange('author_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => handleChange('is_published', e.target.checked)}
              className="w-4 h-4 text-gold"
            />
            <span className="text-sm text-stone">Publish Now</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
              className="w-4 h-4 text-gold"
            />
            <span className="text-sm text-stone">Featured</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-cream-dark">
          <Link href="/admin/blog" className="px-6 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
