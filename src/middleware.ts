// Touryaari Travels - Next.js Middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/server';

// Paths that require Supabase authentication
const protectedPaths = ['/account'];

// Paths that are auth-only (logged in users shouldn't access)
const authPaths = ['/auth/login', '/auth/register'];

// Admin paths that need cookie-based auth
const adminPaths = ['/admin'];
const adminLoginPaths = ['/admin/login', '/api/admin/login'];

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'touryaari_admin_authenticated';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const path = request.nextUrl.pathname;

  // Check if this is an admin route (excluding login)
  const isAdminRoute = adminPaths.some((ap) => path.startsWith(ap)) &&
                       !adminLoginPaths.some((ap) => path.startsWith(ap));

  // Check admin session cookie for admin routes
  if (isAdminRoute) {
    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE);

    if (!adminSession || adminSession.value !== SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Admin is authenticated, allow access
    return response;
  }

  // Allow admin login page to load without redirect
  if (adminLoginPaths.some((ap) => path.startsWith(ap))) {
    return response;
  }

  // Refresh Supabase session if it exists (for non-admin routes)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if path requires Supabase protection
  const isProtected = protectedPaths.some((pp) => path.startsWith(pp));
  const isAuthPath = authPaths.some((ap) => path.startsWith(ap));

  // Redirect unauthenticated users from protected routes
  if (isProtected && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/api/admin/:path*',
  ],
};
