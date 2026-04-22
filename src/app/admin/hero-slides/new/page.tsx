'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewHeroSlidePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge_text: '',
    cta_text: 'Explore Now',
    cta_link: '/tours',
    image_url: '',
    video_url: '',
    is_active: true,
    sort_order: 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/hero-slides');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create slide');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/hero-slides" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Add Hero Slide</h1>
          <p className="text-stone mt-1">Create a new homepage slide</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Badge Text</label>
            <input
              type="text"
              value={formData.badge_text}
              onChange={(e) => handleChange('badge_text', e.target.value)}
              placeholder="e.g., New"
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Subtitle</label>
          <textarea
            value={formData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">CTA Text</label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => handleChange('cta_text', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">CTA Link</label>
            <input
              type="text"
              value={formData.cta_link}
              onChange={(e) => handleChange('cta_link', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Image URL *</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              required
            />
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Video URL (optional)</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => handleChange('video_url', e.target.value)}
              placeholder="YouTube or video URL"
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleChange('is_active', e.target.checked)}
              className="w-4 h-4 text-gold"
            />
            <span className="text-sm text-stone">Active</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-cream-dark">
          <Link href="/admin/hero-slides" className="px-6 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || !formData.image_url}
            className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Slide'}
          </button>
        </div>
      </form>
    </div>
  );
}
