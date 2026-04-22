import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, setAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Admin login attempt for:', email);

    const isValid = await validateCredentials(email, password);

    if (!isValid) {
      console.log('Admin login failed for:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Admin login successful for:', email);
    await setAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
