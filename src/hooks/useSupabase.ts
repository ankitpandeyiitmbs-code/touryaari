'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface UseSupabaseOptions<T> {
  table: string;
  select?: string;
  filters?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  single?: boolean;
}

interface UseSupabaseReturn<T> {
  data: T | T[] | null;
  error: PostgrestError | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabase<T>(options: UseSupabaseOptions<T>): UseSupabaseReturn<T> {
  const [data, setData] = useState<T | T[] | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from(options.table)
      .select(options.select || '*');

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.single) {
      const { data: result, error: err } = await query.single();
      setData(result as T);
      setError(err);
    } else {
      const { data: result, error: err } = await query;
      setData(result as T[]);
      setError(err);
    }

    setIsLoading(false);
  }, [supabase, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
