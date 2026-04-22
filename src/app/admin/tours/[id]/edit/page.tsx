'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface TourFormData {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  destination: string;
  category: string;
  duration_days: number;
  duration_nights: number;
  price_single: number;
  price_double: number;
  price_triple: number;
  price_quad: number;
  original_price: number;
  discount_percent: number;
  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  thumbnail_url: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
}

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    destination: '',
    category: 'road-trip',
    duration_days: 3,
    duration_nights: 2,
    price_single: 0,
    price_double: 0,
    price_triple: 0,
    price_quad: 0,
    original_price: 0,
    discount_percent: 0,
    is_active: true,
    is_featured: false,
    is_popular: false,
    thumbnail_url: '',
    highlights: [''],
    inclusions: [''],
    exclusions: [''],
  });

  useEffect(() => {
    fetchTour();
  }, [tourId]);

  async function fetchTour() {
    try {
      const response = await fetch(`/api/admin/tours/${tourId}`);
      const data = await response.json();
      if (data.tour) {
        setFormData({
          ...formData,
          ...data.tour,
          highlights: data.tour.highlights?.length ? data.tour.highlights : [''],
          inclusions: data.tour.inclusions?.length ? data.tour.inclusions : [''],
          exclusions: data.tour.exclusions?.length ? data.tour.exclusions : [''],
        });
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field: keyof TourFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'highlights' | 'inclusions' | 'exclusions', index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions', index: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.filter(h => h.trim()),
          inclusions: formData.inclusions.filter(i => i.trim()),
          exclusions: formData.exclusions.filter(e => e.trim()),
        }),
      });

      if (response.ok) {
        router.push('/admin/tours');
        router.refresh();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating tour:', error);
      alert('Failed to update tour');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone">Loading tour...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'media', label: 'Media' },
    { id: 'details', label: 'Details' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tours" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Edit Tour</h1>
          <p className="text-stone mt-1">Update tour package details</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark">
        <div className="border-b border-cream-dark">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab.id ? 'text-gold border-b-2 border-gold' : 'text-stone hover:text-pine-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
                  >
                    <option value="road-trip">Road Trip</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="weekend">Weekend</option>
                    <option value="customised">Customised</option>
                                        <option value="trekking">Trekking</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>
              </div>

              {/* State field */}
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">
                  State <span className="text-text-mid font-normal">(links tour to state page on homepage)</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={(formData as any).state || ''}
                    onChange={(e) => handleChange('state' as any, e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <input
                    type="text"
                    placeholder="Slug e.g. uttar-pradesh"
                    value={(formData as any).state_slug || ''}
                    onChange={(e) => handleChange('state_slug' as any, e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <p className="text-xs text-text-mid mt-1">Must match state slug exactly: <strong>uttar-pradesh</strong> or <strong>uttarakhand</strong></p>
              </div>


              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => handleChange('duration_days', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Duration (Nights)</label>
                  <input
                    type="number"
                    value={formData.duration_nights}
                    onChange={(e) => handleChange('duration_nights', parseInt(e.target.value))}
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
                    className="w-4 h-4 text-gold border-cream-dark rounded"
                  />
                  <span className="text-sm text-stone">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="w-4 h-4 text-gold border-cream-dark rounded"
                  />
                  <span className="text-sm text-stone">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => handleChange('is_popular', e.target.checked)}
                    className="w-4 h-4 text-gold border-cream-dark rounded"
                  />
                  <span className="text-sm text-stone">Popular</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Price (Single)</label>
                  <input
                    type="number"
                    value={formData.price_single}
                    onChange={(e) => handleChange('price_single', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Price (Double)</label>
                  <input
                    type="number"
                    value={formData.price_double}
                    onChange={(e) => handleChange('price_double', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Price (Triple)</label>
                  <input
                    type="number"
                    value={formData.price_triple}
                    onChange={(e) => handleChange('price_triple', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Price (Quad)</label>
                  <input
                    type="number"
                    value={formData.price_quad}
                    onChange={(e) => handleChange('price_quad', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Original Price (MRP)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => handleChange('original_price', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Discount %</label>
                  <input
                    type="number"
                    value={formData.discount_percent}
                    onChange={(e) => handleChange('discount_percent', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
                {formData.thumbnail_url && (
                  <img src={formData.thumbnail_url} alt="Preview" className="mt-4 w-48 h-32 object-cover rounded-lg" />
                )}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-pine-dark">Highlights</label>
                  <button type="button" onClick={() => addArrayItem('highlights')} className="flex items-center gap-1 text-sm text-gold hover:text-pine-dark">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {formData.highlights.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      placeholder="Enter highlight"
                      className="flex-1 px-4 py-2 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                    />
                    <button type="button" onClick={() => removeArrayItem('highlights', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-pine-dark">Inclusions</label>
                  <button type="button" onClick={() => addArrayItem('inclusions')} className="flex items-center gap-1 text-sm text-gold hover:text-pine-dark">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {formData.inclusions.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                      placeholder="What's included"
                      className="flex-1 px-4 py-2 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                    />
                    <button type="button" onClick={() => removeArrayItem('inclusions', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-pine-dark">Exclusions</label>
                  <button type="button" onClick={() => addArrayItem('exclusions')} className="flex items-center gap-1 text-sm text-gold hover:text-pine-dark">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {formData.exclusions.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('exclusions', index, e.target.value)}
                      placeholder="What's not included"
                      className="flex-1 px-4 py-2 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                    />
                    <button type="button" onClick={() => removeArrayItem('exclusions', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t border-cream-dark flex items-center justify-between">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    activeTab === tab.id ? 'bg-gold text-pine-dark' : 'bg-cream text-stone'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href="/admin/tours" className="px-6 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream">
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
          </div>
        </form>
      </div>
    </div>
  );
}
