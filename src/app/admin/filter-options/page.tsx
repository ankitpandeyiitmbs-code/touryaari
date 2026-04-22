'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

interface FilterOption {
  id: string;
  type: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export default function FilterOptionsPage() {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<FilterOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  async function fetchFilterOptions() {
    try {
      const response = await fetch('/api/admin/filter-options');
      const data = await response.json();
      setFilterOptions(data.filterOptions || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/admin/filter-options/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setFilterOptions(filterOptions.filter((opt) => opt.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting filter option:', error);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingOption 
        ? `/api/admin/filter-options/${editingOption.id}`
        : '/api/admin/filter-options';
      
      const method = editingOption ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOption),
      });

      if (response.ok) {
        setEditingOption(null);
        fetchFilterOptions();
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error saving filter option:', error);
      alert('Failed to save filter option');
    } finally {
      setIsSaving(false);
    }
  }

  const groupedOptions = filterOptions.reduce((acc, opt) => {
    if (!acc[opt.type]) acc[opt.type] = [];
    acc[opt.type].push(opt);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-stone">Loading filter options...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-pine-dark">Filter Options</h1>
            <p className="text-stone mt-1">Manage tour page filters</p>
          </div>
        </div>
        <button
          onClick={() => setEditingOption({
            id: '',
            type: 'category',
            value: '',
            label: '',
            sort_order: 0,
            is_active: true,
          })}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Option
        </button>
      </div>

      {/* Filter Options by Type */}
      <div className="grid gap-6">
        {Object.entries(groupedOptions).map(([type, options]) => (
          <div key={type} className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
            <div className="bg-cream px-6 py-4 border-b border-cream-dark">
              <h2 className="font-serif text-xl font-bold text-pine-dark capitalize">{type.replace('_', ' ')}</h2>
            </div>
            <div className="divide-y divide-cream-dark">
              {options.map((option) => (
                <div key={option.id} className="px-6 py-4 flex items-center justify-between hover:bg-cream/50">
                  <div>
                    <p className="font-medium text-pine-dark">{option.label}</p>
                    <p className="text-sm text-stone">Value: {option.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      option.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {option.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => setEditingOption(option)}
                      className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(option.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-4">
              {editingOption.id ? 'Edit Filter Option' : 'Add Filter Option'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Type</label>
                <select
                  value={editingOption.type}
                  onChange={(e) => setEditingOption({ ...editingOption, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
                >
                  <option value="category">Category</option>
                  <option value="duration">Duration</option>
                  <option value="price_range">Price Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Value</label>
                <input
                  type="text"
                  value={editingOption.value}
                  onChange={(e) => setEditingOption({ ...editingOption, value: e.target.value })}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Label</label>
                <input
                  type="text"
                  value={editingOption.label}
                  onChange={(e) => setEditingOption({ ...editingOption, label: e.target.value })}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Sort Order</label>
                <input
                  type="number"
                  value={editingOption.sort_order}
                  onChange={(e) => setEditingOption({ ...editingOption, sort_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingOption.is_active}
                  onChange={(e) => setEditingOption({ ...editingOption, is_active: e.target.checked })}
                  className="w-4 h-4 text-gold border-cream-dark rounded"
                />
                <span className="text-sm text-stone">Active</span>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setEditingOption(null)}
                  className="px-4 py-2 border border-cream-dark text-stone rounded-lg hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-2">Confirm Delete</h3>
            <p className="text-stone mb-6">Are you sure you want to delete this filter option? This action cannot be undone.</p>
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
