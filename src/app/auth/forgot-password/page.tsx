'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success('Password reset link sent to your email');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center font-display text-[17px] font-semibold text-pine-dark">
              T
            </div>
            <span className="font-display text-xl font-semibold text-pine-dark tracking-wide">
              Touryaari<span className="text-gold">Travels</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-card-hover p-8 border border-cream-dark">
          {!sent ? (
            <>
              <h1 className="font-serif text-2xl font-bold text-pine-dark text-center mb-2">
                Forgot Password?
              </h1>
              <p className="text-stone text-center mb-6">
                Enter your email and we&apos;ll send you a reset link
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-pine-dark font-semibold tracking-wide py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-serif text-xl font-bold text-pine-dark mb-2">
                Check Your Email
              </h2>
              <p className="text-stone mb-6">
                We&apos;ve sent a password reset link to <strong className="text-pine-dark">{email}</strong>
              </p>
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-pine font-medium border-b-[1.5px] border-pine hover:text-gold hover:border-gold transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}

          {!sent && (
            <p className="text-center mt-6 text-text-mid">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-gold hover:text-gold-light font-semibold">
                Sign in
              </Link>
            </p>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-stone">
          &copy; {new Date().getFullYear()} Touryaari Travels. All rights reserved.
        </p>
      </div>
    </div>
  );
}
