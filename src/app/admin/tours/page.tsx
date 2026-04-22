'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit2, Trash2, Star, TrendingUp, Eye, EyeOff } from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  slug: string;
  category: string;
  destination: string;
  duration_days: number;
  duration_nights: number;
  price_single: number;
  is_active: boolean;
  is_featured: boolean;
  is_popular: boolean;
  thumbnail_url: string;
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    filterTours();
  }, [searchQuery, categoryFilter, statusFilter, tours]);

  async function fetchTours() {
    try {
      const response = await fetch('/api/admin/tours');
      const data = await response.json();
      setTours(data.tours || []);
      setFilteredTours(data.tours || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function filterTours() {
    let filtered = tours;

    if (searchQuery) {
      filtered = filtered.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((tour) => tour.category === categoryFilter);
    }

    if (statusFilter === 'active') {
      filtered = filtered.filter((tour) => tour.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter((tour) => !tour.is_active);
    }

    setFilteredTours(filtered);
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTours(tours.filter((tour) => tour.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  }

  const categories = ['all', ...Array.from(new Set(tours.map((t) => t.category)))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Tours</h1>
          <p className="text-stone mt-1">Manage your tour packages</p>
        </div>
        <Link
          href="/admin/tours/new"
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Tour
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
            <input
              type="text"
              placeholder="Search tours by title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filteredTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tour.thumbnail_url || '/placeholder.jpg'}
                        alt={tour.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-pine-dark">{tour.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {tour.is_featured && <Star className="w-3 h-3 text-gold" />}
                          {tour.is_popular && <TrendingUp className="w-3 h-3 text-gold" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-pine/10 text-pine-dark text-xs font-medium rounded">
                      {tour.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{tour.destination}</td>
                  <td className="px-6 py-4 text-sm text-stone">{tour.duration_days}D/{tour.duration_nights}N</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-pine-dark">₹{tour.price_single?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tour.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/tours/${tour.id}/edit`}
                        className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(tour.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone">No tours found. Create your first tour!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-2">Confirm Delete</h3>
            <p className="text-stone mb-6">Are you sure you want to delete this tour? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-cream-dark text-stone rounded-lg hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
