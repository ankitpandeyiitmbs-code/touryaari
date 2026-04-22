'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    fetchPost();
  }, [postId]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/admin/blog/${postId}`);
      const data = await res.json();
      if (data.post) {
        setFormData({
          ...data.post,
          tags: data.post.tags?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Edit Blog Post</h1>
          <p className="text-stone mt-1">Update blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
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
            <span className="text-sm text-stone">Published</span>
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
            disabled={isSaving}
            className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
