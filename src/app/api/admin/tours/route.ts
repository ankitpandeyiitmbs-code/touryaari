import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

// GET all tours
export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const supabase = createClient();
    const { data: tours, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST new tour
export async function POST(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const body = await request.json();
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('tours')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tour: data });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
