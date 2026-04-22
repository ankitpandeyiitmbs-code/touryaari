'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Users, Wallet, MessageSquare } from 'lucide-react';

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
  admin_notes: string;
  created_at: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.id as string;
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchInquiry();
  }, [inquiryId]);

  async function fetchInquiry() {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`);
      const data = await res.json();
      if (data.inquiry) {
        setInquiry(data.inquiry);
        setNotes(data.inquiry.admin_notes || '');
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
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchInquiry();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function saveNotes() {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      });
      if (res.ok) alert('Notes saved');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-IN') : '-';

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;
  if (!inquiry) return <div className="text-center py-12 text-stone">Inquiry not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/inquiries" className="p-2 text-stone hover:text-pine-dark hover:bg-cream rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Inquiry Details</h1>
          <p className="text-stone mt-1">From {inquiry.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Name</p>
                <p className="font-medium text-pine-dark">{inquiry.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Email</p>
                <p className="font-medium text-pine-dark">{inquiry.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Phone</p>
                <p className="font-medium text-pine-dark">{inquiry.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Source</p>
                <p className="font-medium text-pine-dark capitalize">{inquiry.source}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark">Travel Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Destination</p>
                <p className="font-medium text-pine-dark">{inquiry.destination || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Travel Date</p>
                <p className="font-medium text-pine-dark">{formatDate(inquiry.travel_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Travellers</p>
                <p className="font-medium text-pine-dark">{inquiry.travellers}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm text-stone">Budget</p>
                <p className="font-medium text-pine-dark">{inquiry.budget || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {inquiry.message && (
          <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 lg:col-span-2">
            <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Message</h2>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gold mt-1" />
              <p className="text-stone whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Status & Actions</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-stone mb-2">Current Status</p>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                inquiry.status === 'converted' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {inquiry.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => updateStatus('contacted')} disabled={isUpdating} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">
                Mark Contacted
              </button>
              <button onClick={() => updateStatus('converted')} disabled={isUpdating} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                Mark Converted
              </button>
              <button onClick={() => updateStatus('closed')} disabled={isUpdating} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6">
          <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Admin Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this inquiry..."
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none mb-4"
          />
          <button onClick={saveNotes} className="px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
