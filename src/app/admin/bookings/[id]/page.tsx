'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  tour_title: string;
  tour_slug: string;
  travel_date: string;
  adults: number;
  children: number;
  sharing_type: string;
  total_amount: number;
  advance_amount: number;
  balance_amount: number;
  gst_amount: number;
  special_requests: string;
  status: string;
  payment_status: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  admin_notes: string;
  created_at: string;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  async function fetchBooking() {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`);
      const data = await res.json();
      if (data.booking) {
        setBooking(data.booking);
        setNotes(data.booking.admin_notes || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(status: string) {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBooking();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function saveNotes() {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      });
      if (res.ok) {
        alert('Notes saved');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const formatPrice = (amount: number) => `₹${amount?.toLocaleString() || 0}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN');

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;
  if (!booking) return <div className="text-center py-12 text-stone">Booking not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/bookings" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Booking Details</h1>
          <p className="text-stone mt-1">Ref: {booking.id?.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Customer Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Name</p>
                <p className="font-medium text-pine-dark">{booking.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Email</p>
                <p className="font-medium text-pine-dark">{booking.customer_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Phone</p>
                <p className="font-medium text-pine-dark">{booking.customer_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">City</p>
                <p className="font-medium text-pine-dark">{booking.customer_city || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Tour Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-stone">Tour</p>
              <p className="font-medium text-pine-dark">{booking.tour_title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Travel Date</p>
                <p className="font-medium text-pine-dark">{formatDate(booking.travel_date)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-stone">Adults</p>
                <p className="font-medium text-pine-dark">{booking.adults}</p>
              </div>
              <div>
                <p className="text-sm text-stone">Children</p>
                <p className="font-medium text-pine-dark">{booking.children}</p>
              </div>
              <div>
                <p className="text-sm text-stone">Sharing</p>
                <p className="font-medium text-pine-dark capitalize">{booking.sharing_type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Payment Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gold" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm text-stone">Total Amount</p>
                  <p className="font-medium text-pine-dark">{formatPrice(booking.total_amount)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-stone">Advance Paid</p>
                  <p className="font-medium text-green-600">{formatPrice(booking.advance_amount)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-stone">Balance</p>
                  <p className="font-medium text-orange-600">{formatPrice(booking.balance_amount)}</p>
                </div>
                {booking.gst_amount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-sm text-stone">GST</p>
                    <p className="font-medium text-pine-dark">{formatPrice(booking.gst_amount)}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-stone">Payment Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                booking.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {booking.payment_status}
              </span>
            </div>
            {booking.razorpay_payment_id && (
              <div>
                <p className="text-sm text-stone">Payment ID</p>
                <p className="font-medium text-pine-dark text-xs">{booking.razorpay_payment_id}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Status & Actions</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-stone mb-2">Current Status</p>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {booking.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus('confirmed')}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus('completed')}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Complete
              </button>
              <button
                onClick={() => updateStatus('cancelled')}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6">
        <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Admin Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add internal notes about this booking..."
          className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none mb-4"
        />
        <button
          onClick={saveNotes}
          className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
