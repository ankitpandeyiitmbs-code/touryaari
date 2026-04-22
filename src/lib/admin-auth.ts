'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@touryaaritravels.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_COOKIE = 'admin_session';
const SESSION_VALUE = 'touryaari_admin_authenticated';

export async function validateCredentials(email: string, password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD env var is not set');
    return false;
  }
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export async function requireAdmin(): Promise<void> {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }
}

// Use in API routes — returns 401 response if not authenticated, null if ok
export async function requireAdminApi(): Promise<NextResponse | null> {
  const isAuthenticated = await checkAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }
  return null;
}

export async function getAdminEmail(): Promise<string> {
  return ADMIN_EMAIL;
}
