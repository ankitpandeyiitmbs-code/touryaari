'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    // Check if user already exists
    const { data: { user: existingUser } } = await supabase.auth.getUser();
    
    // Try to sign up - Supabase will return error if email already exists
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        toast.error('This email is already registered. Please login instead.');
      } else {
        toast.error(error.message);
      }
    } else if (data.user && !data.session) {
      // Email confirmation required
      toast.success('Registration successful! Please check your email to confirm your account.');
      router.push('/auth/login');
    } else if (data.user && data.session) {
      // Auto-logged in
      toast.success('Registration successful!');
      router.push('/account');
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
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
        <div className="text-center mb-8 pt-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="https://i.ibb.co/HLJJ976C/T-1-1-Photoroom.png" alt="Touryaari" className="h-80 w-auto object-contain" width="320" height="320" />
            <span className="font-display text-xl font-semibold text-pine-dark tracking-wide">
              Touryaari<span className="text-gold">Travels</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-card-hover p-8 border border-cream-dark">
          <h1 className="font-serif text-2xl font-bold text-pine-dark text-center mb-2">
            Create Account
          </h1>
          <p className="text-stone text-center mb-6">
            Join Touryaari Travels and start your journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="+91 85956 89569"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="Create a password"
                  required
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold text-pine-dark placeholder:text-stone/50"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="rounded border-cream-dark text-gold focus:ring-gold mt-0.5"
              />
              <span className="text-text-mid">
                I agree to the{' '}
                <Link href="/terms" className="text-gold hover:text-gold-light font-medium">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-gold hover:text-gold-light font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-pine-dark font-semibold tracking-wide py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 border border-cream-dark rounded-lg py-2.5 text-pine-dark hover:border-gold hover:bg-gold/5 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>

          <p className="text-center mt-6 text-text-mid">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold hover:text-gold-light font-semibold">
              Sign in
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
