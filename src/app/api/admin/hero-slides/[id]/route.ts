import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  try {
    const supabase = createServiceClient();
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
    const supabase = createServiceClient();
    
    // Remove id from body if present to avoid conflicts
    const { id, ...updateData } = body;
    
    // First check if slide exists
    const { data: existingSlide, error: checkError } = await supabase
      .from('hero_slides')
      .select('id')
      .eq('id', params.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Check error:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (!existingSlide) {
      console.error('Slide not found with id:', params.id);
      return NextResponse.json({ error: 'Slide not found', id: params.id }, { status: 404 });
    }
    
    const { data, error } = await supabase
      .from('hero_slides')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Slide not found after update' }, { status: 404 });
    return NextResponse.json({ slide: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminApi();
  if (authError) return authError;
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('hero_slides').delete().eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
