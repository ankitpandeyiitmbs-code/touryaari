import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const body = await request.json();
    const {
      vehicle_id,
      booking_type,
      pickup_location,
      pickup_date,
      pickup_time,
      drop_location,
      drop_date,
      drop_time,
      estimated_distance_km,
      estimated_duration_hours,
      base_price,
      driver_da,
      extra_km_charge,
      night_halt_charges,
      toll_charges,
      parking_charges,
      state_tax,
      gst_amount,
      total_amount,
      advance_amount,
      balance_amount,
      customer_name,
      customer_email,
      customer_phone,
      customer_city,
      special_requests,
    } = body;

    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Create transport booking
    const { data: booking, error } = await supabase
      .from('transport_bookings')
      .insert([{
        vehicle_id,
        user_id: user?.id || null,
        booking_type,
        pickup_location,
        pickup_date,
        pickup_time,
        drop_location,
        drop_date,
        drop_time,
        estimated_distance_km,
        estimated_duration_hours,
        base_price,
        driver_da,
        extra_km_charge,
        night_halt_charges,
        toll_charges,
        parking_charges,
        state_tax,
        gst_amount,
        total_amount,
        advance_amount,
        balance_amount,
        customer_name,
        customer_email,
        customer_phone,
        customer_city,
        special_requests,
        status: 'pending',
        payment_status: 'unpaid',
      }])
      .select()
      .single();

    if (error || !booking) {
      console.error('Error creating transport booking:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error in transport booking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
