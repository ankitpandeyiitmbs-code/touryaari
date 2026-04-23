import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Razorpay order request:', body);
    const { amount, currency = 'INR', booking_id, booking_type = 'tour' } = body;

    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'SET' : 'NOT SET');
      console.error('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET');
      
      // For demo/dev: create a mock order and mark booking as confirmed
      const supabase = createServiceClient();
      const table = booking_type === 'transport' ? 'transport_bookings' : 'bookings';
      
      await supabase
        .from(table)
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_order_id: `order_demo_${Date.now()}`,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking_id);

      return NextResponse.json({
        success: true,
        order_id: `order_demo_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        demo: true,
      });
    }

    console.log('Creating Razorpay order with key:', process.env.RAZORPAY_KEY_ID);
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: booking_id || `receipt_${Date.now()}`,
      notes: {
        booking_id,
        booking_type,
      },
    };

    console.log('Razorpay options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
