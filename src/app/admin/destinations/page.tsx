'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  region: string;
  state: string;
  tour_count: number;
  is_featured: boolean;
  is_international: boolean;
  is_active: boolean;
  image_url: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filtered, setFiltered] = useState<Destination[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    let result = destinations;
    if (search) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.region?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, destinations]);

  async function fetchDestinations() {
    try {
      const res = await fetch('/api/admin/destinations');
      const data = await res.json();
      setDestinations(data.destinations || []);
      setFiltered(data.destinations || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDestinations(destinations.filter(d => d.id !== id));
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
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Destinations</h1>
          <p className="text-stone mt-1">Manage travel destinations</p>
        </div>
        <Link href="/admin/destinations/new" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light">
          <Plus className="w-5 h-5" /> Add Destination
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
          <input
            type="text"
            placeholder="Search destinations..."
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Region</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Tours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((dest) => (
                <tr key={dest.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={dest.image_url || '/placeholder.jpg'} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-pine-dark">{dest.name}</p>
                        {dest.is_featured && <span className="text-xs text-gold">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{dest.region || '-'}</td>
                  <td className="px-6 py-4 text-sm text-stone">{dest.tour_count}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${dest.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {dest.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/destinations/${dest.id}/edit`} className="p-2 text-gold hover:bg-gold/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(dest.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No destinations found</div>}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-2">Confirm Delete</h3>
            <p className="text-stone mb-6">Are you sure you want to delete this destination?</p>
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
