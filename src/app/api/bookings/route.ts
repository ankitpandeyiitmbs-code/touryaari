import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([body])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Booking creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
    
    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
