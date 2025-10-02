import Sidebar from '@/components/admin/sidebar';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for Fake Store',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  if (user.user_metadata.role !== 'admin') {
    // Or redirect to a dedicated 'unauthorized' page
    redirect('/');
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}