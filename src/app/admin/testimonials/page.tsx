'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  tour_name: string;
  platform: string;
  is_featured: boolean;
  is_active: boolean;
  date: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filtered, setFiltered] = useState<Testimonial[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    let result = testimonials;
    if (search) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.review.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, testimonials]);

  async function fetchTestimonials() {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
      setFiltered(data.testimonials || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
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
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Testimonials</h1>
          <p className="text-stone mt-1">Manage customer reviews</p>
        </div>
        <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light">
          <Plus className="w-5 h-5" /> Add Testimonial
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Review</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-pine-dark">{t.name}</p>
                      <p className="text-xs text-stone">{t.location}</p>
                      {t.is_featured && <span className="text-xs text-gold">Featured</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-sm font-medium">{t.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone max-w-xs truncate">{t.review}</td>
                  <td className="px-6 py-4 text-sm text-stone">{t.tour_name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/testimonials/${t.id}/edit`} className="p-2 text-gold hover:bg-gold/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No testimonials found</div>}
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
