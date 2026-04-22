'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sliders, X } from 'lucide-react';

interface FilterOption {
  id: string;
  type: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
}

export default function TourFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentDestination = searchParams.get('destination') || '';
  const currentDurations = searchParams.get('duration')?.split(',') || [];
  const currentPriceRanges = searchParams.get('price_range')?.split(',') || [];

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  async function fetchFilterOptions() {
    try {
      const response = await fetch('/api/admin/filter-options');
      const data = await response.json();
      setFilterOptions(data.filterOptions?.filter((opt: FilterOption) => opt.is_active) || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const applyFilter = (key: string, value: string, isMulti: boolean = false) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (isMulti) {
      const currentValues = params.get(key)?.split(',') || [];
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter(v => v !== value);
        if (newValues.length > 0) {
          params.set(key, newValues.join(','));
        } else {
          params.delete(key);
        }
      } else {
        currentValues.push(value);
        params.set(key, currentValues.join(','));
      }
    } else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/tours?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/tours');
  };

  const categories = filterOptions.filter(opt => opt.type === 'category');
  const durations = filterOptions.filter(opt => opt.type === 'duration');
  const priceRanges = filterOptions.filter(opt => opt.type === 'price_range');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-card border border-cream-dark">
        <div className="text-stone">Loading filters...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-card border border-cream-dark">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif font-semibold text-lg text-pine-dark flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Filters
        </h3>
        {(currentCategory || currentDestination || currentDurations.length > 0 || currentPriceRanges.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gold hover:text-gold-light flex items-center gap-1 font-medium"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-pine-dark mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={currentCategory === cat.value}
                  onChange={(e) => applyFilter('category', e.target.value)}
                  className="text-gold focus:ring-gold border-cream-dark"
                />
                <span className="text-stone">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Duration Filter */}
      {durations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-pine-dark mb-3">Duration</h4>
          <div className="space-y-2">
            {durations.map((dur) => (
              <label key={dur.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentDurations.includes(dur.value)}
                  onChange={(e) => {
                    applyFilter('duration', dur.value, true);
                  }}
                  className="text-gold focus:ring-gold rounded border-cream-dark"
                />
                <span className="text-stone">{dur.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      {priceRanges.length > 0 && (
        <div>
          <h4 className="font-medium text-pine-dark mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((price) => (
              <label key={price.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPriceRanges.includes(price.value)}
                  onChange={(e) => {
                    applyFilter('price_range', price.value, true);
                  }}
                  className="text-gold rounded border-cream-dark"
                />
                <span className="text-stone">{price.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
