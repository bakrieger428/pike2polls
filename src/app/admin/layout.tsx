import type { Metadata } from 'next';
import { AdminProtected } from '@/components/admin';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Pike2ThePolls',
  description: 'Admin dashboard for managing ride signups.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected requireAdmin={true}>
      {children}
    </AdminProtected>
  );
}
