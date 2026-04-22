'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings, User, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-stone hover:text-gold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="mb-10">
          <h1 className="font-serif text-4xl font-semibold text-pine-dark mb-2">Account Settings</h1>
          <p className="text-text-mid">Manage your profile information</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-card space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-cream-dark">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-pine-dark">{user?.email}</h3>
              <p className="text-stone text-sm">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 bg-cream border border-cream-dark rounded-lg text-stone cursor-not-allowed"
              />
              <p className="text-xs text-stone mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Full Name</label>
              <input
                type="text"
                value={user?.user_metadata?.full_name || ''}
                disabled
                className="w-full px-4 py-3 bg-cream border border-cream-dark rounded-lg text-stone cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-cream-dark">
            <p className="text-sm text-stone">More profile settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
