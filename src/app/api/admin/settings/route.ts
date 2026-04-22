import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ settings: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;


  try {
    const updates = await request.json();
    const supabase = createClient();

    console.log('Settings update request:', updates);

    // Remove id from updates to avoid conflicts
    const { id, ...updateFields } = updates;

    // First check if global row exists
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('id', 'global')
      .single();

    let data, error;

    if (existing) {
      // Update existing row with only the fields being sent
      const result = await supabase
        .from('site_settings')
        .update({ ...updateFields, updated_at: new Date().toISOString() })
        .eq('id', 'global')
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new row
      const result = await supabase
        .from('site_settings')
        .insert({ id: 'global', ...updateFields, updated_at: new Date().toISOString() })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    console.log('Settings update result:', { data, error });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
