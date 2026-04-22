'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, Calendar, User } from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_title: string;
  travel_date: string;
  adults: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    if (search) {
      result = result.filter(b => 
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
        b.tour_title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  async function fetchBookings() {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
      setFiltered(data.bookings || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (amount: number) => `₹${amount?.toLocaleString() || 0}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN');

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Bookings</h1>
          <p className="text-stone mt-1">Manage tour bookings</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Ref</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Travel Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4 text-sm font-medium text-pine-dark">{booking.id?.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-pine-dark">{booking.customer_name}</p>
                      <p className="text-xs text-stone">{booking.customer_phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{booking.tour_title}</td>
                  <td className="px-6 py-4 text-sm text-stone">{formatDate(booking.travel_date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-pine-dark">{formatPrice(booking.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/bookings/${booking.id}`} className="p-2 text-gold hover:bg-gold/10 rounded-lg inline-flex">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No bookings found</div>}
      </div>
    </div>
  );
}
