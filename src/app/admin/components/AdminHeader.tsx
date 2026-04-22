'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  email: string;
}

export default function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-pine-dark text-white sticky top-0 z-50 border-b border-gold/20">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="https://i.ibb.co/QjY2c5Hm/T-1.png" alt="Touryaari" className="h-12 w-auto object-contain" width="64" height="64" />
          <span className="font-serif text-xl font-bold text-white">
            Touryaari <span className="text-gold">Admin</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">{email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
