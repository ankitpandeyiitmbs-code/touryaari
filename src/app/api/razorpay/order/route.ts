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
      
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 500 }
      );
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
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      description: error.description,
    });
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
