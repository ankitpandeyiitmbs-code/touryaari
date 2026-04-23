'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First try admin login
    try {
      const adminResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminResponse.json();

      console.log('Admin login response:', adminData);

      if (adminData.success) {
        toast.success('Welcome back, Admin!');
        router.push('/admin');
        router.refresh();
        setLoading(false);
        return;
      } else {
        console.log('Admin login failed:', adminData.error);
      }
    } catch (err) {
      console.error('Admin login error:', err);
    }

    // Normal user login with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      router.push(redirect);
      router.refresh();
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream pt-20 pb-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 pt-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="https://i.ibb.co/HLJJ976C/T-1-1-Photoroom.png" alt="Touryaari" className="h-40 w-auto object-contain" width="160" height="160" />
            <span className="font-display text-xl font-semibold text-pine-dark tracking-wide">
              Touryaari<span className="text-gold">Travels</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-card-hover p-8 border border-cream-dark">
          <h1 className="font-serif text-2xl font-bold text-pine-dark text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-stone text-center mb-6">
            Sign in to access your bookings and account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-pine-dark"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-cream-dark text-gold focus:ring-gold" />
                <span className="text-text-mid">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-gold hover:text-gold-light font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-pine-dark font-semibold tracking-wide py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-dark" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-stone">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-cream-dark rounded-lg py-2.5 text-pine-dark hover:border-gold hover:bg-gold/5 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>

          <p className="text-center mt-6 text-text-mid">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-gold hover:text-gold-light font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center mt-8 text-sm text-stone">
          &copy; {new Date().getFullYear()} Touryaari Travels. All rights reserved.
        </p>
      </div>
    </div>
  );
}
