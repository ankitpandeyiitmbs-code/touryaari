'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge_text: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSlides(slides.filter(s => s.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Hero Slides</h1>
          <p className="text-stone mt-1">Manage homepage carousel</p>
        </div>
        <Link href="/admin/hero-slides/new" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light">
          <Plus className="w-5 h-5" /> Add Slide
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Slide</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">CTA</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {slides.map((slide, index) => (
                <tr key={slide.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={slide.image_url || '/placeholder.jpg'} alt={slide.title} className="w-16 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-pine-dark">{slide.title || 'Untitled'}</p>
                        <p className="text-xs text-stone truncate max-w-xs">{slide.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{slide.cta_text}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hero-slides/${slide.id}/edit`} className="p-2 text-gold hover:bg-gold/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(slide.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {slides.length === 0 && <div className="text-center py-12 text-stone">No slides found</div>}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-2">Confirm Delete</h3>
            <p className="text-stone mb-6">Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-cream-dark text-stone rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
