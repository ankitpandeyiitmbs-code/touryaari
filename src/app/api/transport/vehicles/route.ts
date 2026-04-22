import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data: vehicles } = await supabase
      .from('transport_vehicles')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error('Error fetching transport vehicles:', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}
