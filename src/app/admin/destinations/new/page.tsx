'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewDestinationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    region: '',
    state: '',
    country: 'India',
    description: '',
    short_description: '',
    image_url: '',
    banner_url: '',
    is_featured: false,
    is_international: false,
    is_active: true,
    sort_order: 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name, slug: generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/destinations');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create destination');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/destinations" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Add Destination</h1>
          <p className="text-stone mt-1">Create a new destination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Region</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Short Description</label>
          <input
            type="text"
            value={formData.short_description}
            onChange={(e) => handleChange('short_description', e.target.value)}
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-4 w-32 h-24 object-cover rounded-lg" />}
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Banner URL</label>
            <input
              type="url"
              value={formData.banner_url}
              onChange={(e) => handleChange('banner_url', e.target.value)}
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => handleChange('is_featured', e.target.checked)}
              className="w-4 h-4 text-gold"
            />
            <span className="text-sm text-stone">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_international}
              onChange={(e) => handleChange('is_international', e.target.checked)}
              className="w-4 h-4 text-gold"
            />
            <span className="text-sm text-stone">International</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-cream-dark">
          <Link href="/admin/destinations" className="px-6 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Destination'}
          </button>
        </div>
      </form>
    </div>
  );
}
