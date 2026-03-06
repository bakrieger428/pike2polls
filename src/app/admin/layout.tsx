import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Pike2ThePolls',
  description: 'Admin dashboard for managing ride signups.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
