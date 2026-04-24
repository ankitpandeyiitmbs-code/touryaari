'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Users, ArrowRight, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { Tour } from '@/types';
import { formatPrice, formatDuration } from '@/lib/utils';
import { loadRazorpayScript, type RazorpayOptions } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
  travel_date: z.string().min(1, 'Travel date is required'),
  sharing_type: z.enum(['single', 'double', 'triple', 'quad']),
  adults: z.coerce.number().min(1, 'At least 1 adult required').max(10),
  children: z.coerce.number().min(0).max(5),
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Enter a valid email address'),
  customer_phone: z.string().min(10, 'Enter a valid 10-digit phone number'),
  customer_city: z.string().optional(),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  tour: Tour;
}

export default function BookingForm({ tour }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      sharing_type: 'double',
      adults: 2,
      children: 0,
    },
  });

  const sharingType = watch('sharing_type');
  const adults = watch('adults') || 1;
  const children = watch('children') || 0;

  const getPricePerPerson = () => {
    switch (sharingType) {
      case 'single': return tour.price_single;
      case 'double': return tour.price_double || tour.price_single;
      case 'triple': return tour.price_triple || tour.price_single;
      case 'quad':   return tour.price_quad || tour.price_single;
      default:       return tour.price_single;
    }
  };

  const pricePerPerson = getPricePerPerson();
  const subtotal = pricePerPerson * adults + pricePerPerson * 0.5 * children;
  const gstAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gstAmount;
  const advanceAmount = Math.round(totalAmount * 0.3);
  const balanceAmount = totalAmount - advanceAmount;

  const handleNextStep = async () => {
    const fields: Record<number, (keyof BookingFormData)[]> = {
      1: ['travel_date', 'sharing_type', 'adults', 'children'],
      2: ['customer_name', 'customer_email', 'customer_phone'],
    };
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (step < 3) {
      handleNextStep();
      return;
    }
    await initiatePayment(data);
  };

  const initiatePayment = async (data: BookingFormData) => {
    setIsProcessing(true);
    try {
      console.log('Starting payment process...');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create a booking record via API
      console.log('Creating booking...');
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: tour.id,
          tour_title: tour.title,
          tour_slug: tour.slug,
          user_id: user?.id || null,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          customer_city: data.customer_city || null,
          travel_date: data.travel_date,
          adults: data.adults,
          children: data.children,
          sharing_type: data.sharing_type,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          advance_amount: advanceAmount,
          balance_amount: balanceAmount,
          special_requests: data.special_requests || null,
          status: 'pending',
          payment_status: 'unpaid',
        }),
      });
      const bookingData = await bookingRes.json();
      console.log('Booking response:', bookingData);

      if (!bookingData.booking) {
        console.error('Booking creation failed:', bookingData);
        toast.error('Failed to create booking. Please try again.');
        setIsProcessing(false);
        return;
      }

      const booking = bookingData.booking;
      console.log('Booking created:', booking);

      // 2. Create Razorpay order
      console.log('Creating Razorpay order...');
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: advanceAmount,
          currency: 'INR',
          booking_id: booking.id,
        }),
      });
      const orderData = await orderRes.json();
      console.log('Order response:', orderData);

      if (!orderData.success) {
        console.error('Order creation failed:', orderData);
        toast.error('Failed to initiate payment. Please try again.');
        setIsProcessing(false);
        return;
      }

      // If demo mode, skip Razorpay modal and show success
      if (orderData.demo) {
        console.log('Demo mode: Skipping Razorpay modal');
        setBookingComplete(true);
        toast.success('Booking confirmed! 🎉');
        setIsProcessing(false);
        return;
      }

      // 3. Load and open Razorpay checkout
      console.log('Loading Razorpay script...');
      const loaded = await loadRazorpayScript();
      console.log('Razorpay script loaded:', loaded);
      if (!loaded) {
        toast.error('Payment gateway unavailable. Please try again.');
        setIsProcessing(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Touryaari Travels',
        description: `Advance payment for ${tour.title}`,
        order_id: orderData.order_id,
        prefill: {
          name: data.customer_name,
          email: data.customer_email,
          contact: data.customer_phone,
        },
        theme: { color: '#C89033' },
        handler: async (response) => {
          console.log('Payment successful:', response);
          // 4. Verify payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: booking.id,
            }),
          });
          const verifyData = await verifyRes.json();
          console.log('Verification response:', verifyData);

          if (verifyData.success) {
            setBookingComplete(true);
            toast.success('Booking confirmed! 🎉');
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            toast('Payment cancelled. Your booking is saved as pending.', { icon: 'ℹ️' });
            setIsProcessing(false);
          },
        },
      };

      console.log('Opening Razorpay modal with key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-pine-dark mb-2">Booking Confirmed!</h2>
        <p className="text-stone mb-6">
          We&apos;ve sent a confirmation to your email. Our team will contact you shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/account/bookings')}
            className="bg-gold text-pine-dark font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => router.push('/tours')}
            className="border border-cream-dark text-stone px-6 py-3 rounded-lg hover:bg-cream transition-colors"
          >
            Browse More Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              s === step ? 'bg-gold text-pine-dark' :
              s < step  ? 'bg-pine text-white' :
              'bg-cream-dark text-stone'
            }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-8 transition-colors ${s < step ? 'bg-pine' : 'bg-cream-dark'}`} />}
          </div>
        ))}
        <div className="ml-2 text-sm text-stone">
          {step === 1 ? 'Trip Details' : step === 2 ? 'Your Details' : 'Confirm & Pay'}
        </div>
      </div>

      {/* Step 1: Trip Details */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-1.5">
              Travel Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('travel_date')}
              min={new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none text-pine-dark"
            />
            {errors.travel_date && <p className="text-red-500 text-xs mt-1">{errors.travel_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-pine-dark mb-1.5">Room Sharing</label>
            <div className="grid grid-cols-2 gap-3">
              {(['single', 'double', 'triple', 'quad'] as const).map((type) => {
                const prices: Record<string, number> = {
                  single: tour.price_single,
                  double: tour.price_double || tour.price_single,
                  triple: tour.price_triple || tour.price_single,
                  quad:   tour.price_quad   || tour.price_single,
                };
                return (
                  <label key={type} className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${
                    sharingType === type ? 'border-gold bg-gold/10' : 'border-cream-dark hover:border-gold/50'
                  }`}>
                    <input type="radio" value={type} {...register('sharing_type')} className="sr-only" />
                    <span className="font-medium text-pine-dark capitalize">{type} Sharing</span>
                    <span className="text-sm text-gold font-semibold">{formatPrice(prices[type])}/person</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">Adults <span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register('adults', { valueAsNumber: true })}
                min={1} max={10}
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
              {errors.adults && <p className="text-red-500 text-xs mt-1">{errors.adults.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">Children <span className="text-stone text-xs">(5–12 yrs)</span></label>
              <input
                type="number"
                {...register('children', { valueAsNumber: true })}
                min={0} max={5}
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('customer_name')}
              placeholder="As per ID proof"
              className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
            {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-1.5">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              {...register('customer_email')}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
            {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                {...register('customer_phone')}
                placeholder="+91 85956 89569"
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
              {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-1.5">City</label>
              <input
                type="text"
                {...register('customer_city')}
                placeholder="Delhi"
                className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-1.5">Special Requests</label>
            <textarea
              {...register('special_requests')}
              rows={3}
              placeholder="Any dietary requirements, special assistance, etc."
              className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Summary */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="bg-cream rounded-xl p-5 space-y-3">
            <h3 className="font-serif text-lg font-semibold text-pine-dark">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone">Tour</span><span className="font-medium text-pine-dark">{tour.title}</span></div>
              <div className="flex justify-between"><span className="text-stone">Travel Date</span><span className="font-medium text-pine-dark">{watch('travel_date')}</span></div>
              <div className="flex justify-between"><span className="text-stone">Travelers</span><span className="font-medium text-pine-dark">{adults} adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</span></div>
              <div className="flex justify-between"><span className="text-stone">Sharing</span><span className="font-medium text-pine-dark capitalize">{sharingType}</span></div>
              <div className="border-t border-cream-dark pt-2 mt-2">
                <div className="flex justify-between"><span className="text-stone">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-stone">GST (5%)</span><span>{formatPrice(gstAmount)}</span></div>
                <div className="flex justify-between font-semibold text-pine-dark text-base mt-1">
                  <span>Total</span><span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
              <div className="bg-gold/10 rounded-lg p-3 border border-gold/30">
                <div className="flex justify-between text-gold font-semibold">
                  <span>Advance Payable Now (30%)</span><span>{formatPrice(advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-stone text-xs mt-1">
                  <span>Balance due before departure</span><span>{formatPrice(balanceAmount)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-stone">
            By proceeding, you agree to our <a href="/terms" target="_blank" className="text-gold hover:underline">Terms & Conditions</a> and <a href="/refund-policy" target="_blank" className="text-gold hover:underline">Refund Policy</a>.
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-cream-dark text-stone rounded-lg hover:bg-cream transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : <div />}

        {step < 3 ? (
          <button type="button" onClick={handleNextStep}
            className="flex items-center gap-2 bg-gold text-pine-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-gold-light transition-colors">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="submit" disabled={isProcessing}
            className="flex items-center gap-2 bg-gold text-pine-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <CreditCard className="w-4 h-4" />
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(advanceAmount)}`}
          </button>
        )}
      </div>
    </form>
  );
}
