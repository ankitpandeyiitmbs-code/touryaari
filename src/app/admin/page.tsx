import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import {
  Map,
  MapPin,
  Calendar,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  Image as ImageIcon,
  Image,
  AlertCircle,
} from 'lucide-react';

async function getStats() {
  const supabase = createClient();
  
  const [
    { count: toursCount },
    { count: destinationsCount },
    { count: bookingsCount },
    { count: inquiriesCount },
    { count: blogCount },
    { count: testimonialsCount },
    { count: galleryCount },
    { count: heroSlidesCount },
    { data: recentBookings },
    { data: recentInquiries },
    { data: monthlyRevenue },
  ] = await Promise.all([
    supabase.from('tours').select('*', { count: 'exact', head: true }),
    supabase.from('destinations').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
    supabase.from('hero_slides').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*, tours(title)').order('created_at', { ascending: false }).limit(5),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('bookings').select('total_amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  const revenue = monthlyRevenue?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

  return {
    tours: toursCount || 0,
    destinations: destinationsCount || 0,
    bookings: bookingsCount || 0,
    inquiries: inquiriesCount || 0,
    blogs: blogCount || 0,
    testimonials: testimonialsCount || 0,
    gallery: galleryCount || 0,
    heroSlides: heroSlidesCount || 0,
    revenue,
    recentBookings: recentBookings || [],
    recentInquiries: recentInquiries || [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    { label: 'Total Tours', value: stats.tours, icon: Map, href: '/admin/tours', color: 'bg-pine' },
    { label: 'Destinations', value: stats.destinations, icon: MapPin, href: '/admin/destinations', color: 'bg-pine-light' },
    { label: 'Bookings', value: stats.bookings, icon: Calendar, href: '/admin/bookings', color: 'bg-gold' },
    { label: 'New Inquiries', value: stats.inquiries, icon: MessageSquare, href: '/admin/inquiries', color: 'bg-pine' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, href: '/admin/blog', color: 'bg-pine-light' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, href: '/admin/testimonials', color: 'bg-gold' },
    { label: 'Gallery Images', value: stats.gallery, icon: ImageIcon, href: '/admin/gallery', color: 'bg-pine' },
    { label: 'Hero Slides', value: stats.heroSlides, icon: Image, href: '/admin/hero-slides', color: 'bg-pine-light' },
    { label: 'Monthly Revenue', value: formatPrice(stats.revenue), icon: TrendingUp, href: '/admin/bookings', color: 'bg-gold', isCurrency: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-pine-dark">Dashboard</h1>
        <p className="text-stone mt-1">Welcome to Touryaari Travels Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group border border-cream-dark"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-stone text-sm">{stat.label}</p>
                <p className="font-serif text-3xl font-bold text-pine-dark mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-gold group-hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
          <div className="p-6 border-b border-cream-dark">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-pine-dark">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-sm text-gold hover:underline">View all</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Ref</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Tour</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {stats.recentBookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-cream/50">
                    <td className="px-6 py-4 text-sm font-medium text-pine-dark">{booking.id?.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-stone">{booking.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-stone">{booking.tours?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-pine-dark font-medium">{formatPrice(booking.total_amount)}</td>
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
                  </tr>
                ))}
                {stats.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-stone">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
          <div className="p-6 border-b border-cream-dark">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-pine-dark">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-sm text-gold hover:underline">View all</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Phone</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Destination</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {stats.recentInquiries.map((inquiry: any) => (
                  <tr key={inquiry.id} className="hover:bg-cream/50">
                    <td className="px-6 py-4 text-sm font-medium text-pine-dark">{inquiry.name}</td>
                    <td className="px-6 py-4 text-sm text-stone">{inquiry.phone}</td>
                    <td className="px-6 py-4 text-sm text-stone">{inquiry.destination}</td>
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
                  </tr>
                ))}
                {stats.recentInquiries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-stone">
                      No inquiries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-card border border-cream-dark">
        <h2 className="font-serif text-xl font-bold text-pine-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/tours/new"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-cream hover:bg-gold/10 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <Map className="w-6 h-6 text-gold" />
            </div>
            <span className="font-medium text-sm text-pine-dark">Add New Tour</span>
          </Link>
          <Link
            href="/admin/destinations/new"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-cream hover:bg-gold/10 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <span className="font-medium text-sm text-pine-dark">Add Destination</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-cream hover:bg-gold/10 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-gold" />
            </div>
            <span className="font-medium text-sm text-pine-dark">Write Blog Post</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-cream hover:bg-gold/10 transition-colors text-center"
          >
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
            <span className="font-medium text-sm text-pine-dark">Site Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
