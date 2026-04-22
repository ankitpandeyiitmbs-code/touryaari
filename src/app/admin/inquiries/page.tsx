'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, MessageCircle, Phone, Mail } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travel_date: string;
  travellers: number;
  budget: string;
  message: string;
  status: string;
  source: string;
  created_at: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filtered, setFiltered] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    let result = inquiries;
    if (search) {
      result = result.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase()) ||
        i.destination?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, inquiries]);

  async function fetchInquiries() {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setFiltered(data.inquiries || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-IN') : '-';

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Inquiries</h1>
          <p className="text-stone mt-1">Manage customer inquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
            <input
              type="text"
              placeholder="Search inquiries..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Travel Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-pine-dark">{inquiry.name}</p>
                      <p className="text-xs text-stone">{inquiry.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{inquiry.destination || '-'}</td>
                  <td className="px-6 py-4 text-sm text-stone">{formatDate(inquiry.travel_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      inquiry.status === 'converted' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{formatDate(inquiry.created_at)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/inquiries/${inquiry.id}`} className="p-2 text-gold hover:bg-gold/10 rounded-lg inline-flex">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No inquiries found</div>}
      </div>
    </div>
  );
}
