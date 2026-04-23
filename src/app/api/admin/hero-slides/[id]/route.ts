import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    return NextResponse.json({ slide: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  try {
    const body = await request.json();
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('hero_slides')
      .update(body)
      .eq('id', params.id)
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    return NextResponse.json({ slide: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  try {
    const supabase = createClient();
    const { error } = await supabase.from('hero_slides').delete().eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
