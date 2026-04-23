import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slides: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const body = await request.json();
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([body])
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    return NextResponse.json({ slide: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
