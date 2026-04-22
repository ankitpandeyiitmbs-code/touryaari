import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

// GET single tour
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const supabase = createClient();
    const { data: tour, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tour });
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update tour
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase
      .from('tours')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tour: data });
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
