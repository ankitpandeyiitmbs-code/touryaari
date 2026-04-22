import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

// GET single filter option
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('filter_options')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ filterOption: data });
  } catch (error) {
    console.error('Error fetching filter option:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update filter option
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = await request.json();
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('filter_options')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ filterOption: data });
  } catch (error) {
    console.error('Error updating filter option:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE filter option
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('filter_options')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting filter option:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
