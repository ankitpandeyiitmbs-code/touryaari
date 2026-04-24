import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendBookingConfirmationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
      booking_type = 'tour',
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json(
        { success: false, error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Handle different booking types
    if (booking_type === 'transport') {
      // Update transport booking status
      const { error } = await supabase
        .from('transport_bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_payment_id,
          razorpay_order_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking_id);

      if (error) {
        console.error('Transport booking update error:', error.message);
        return NextResponse.json(
          { success: false, error: 'Failed to update booking' },
          { status: 500 }
        );
      }
    } else {
      // Handle tour booking
      // Fetch booking + tour details before updating (for email)
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, tours(title, destination)')
        .eq('id', booking_id)
        .single();

      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          razorpay_payment_id,
          razorpay_order_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking_id);

      if (error) {
        console.error('Booking update error:', error.message);
        return NextResponse.json(
          { success: false, error: 'Failed to update booking' },
          { status: 500 }
        );
      }

      // Send emails (non-blocking — payment confirmed even if email fails)
      if (booking) {
        try {
          await sendBookingConfirmationEmail({
            booking_id: booking.id,
            customer_name: booking.customer_name || 'Traveller',
            customer_email: booking.customer_email || '',
            customer_phone: booking.customer_phone || '',
            tour_title: booking.tours?.title || 'Tour',
            tour_destination: booking.tours?.destination || '',
            travel_date: booking.travel_date
              ? new Date(booking.travel_date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
              : 'TBD',
            num_travelers: (booking.adults || 1) + (booking.children || 0),
            total_amount: booking.advance_amount || 0,
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
          });
          await supabase.from('bookings').update({ confirmation_email_sent: true }).eq('id', booking_id);
        } catch (emailErr) {
          console.error('Email send error (non-fatal):', emailErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
