import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAdminSession, getAdminEmail } from '@/lib/admin-auth';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAdminSession();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const adminEmail = await getAdminEmail();

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader email={adminEmail} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
