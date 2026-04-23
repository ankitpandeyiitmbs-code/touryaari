import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Booking request body:', body);
    
    // Check if service role key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
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
      console.error('No data returned after insert');
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
    
    console.log('Booking created successfully:', data);
    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
