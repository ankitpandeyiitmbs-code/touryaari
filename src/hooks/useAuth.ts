'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
  });

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let isAdmin = false;
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
      }

      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        isAdmin,
      });
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({
        ...prev,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
    });
  }, [supabase]);

  return { ...state, signOut };
}
