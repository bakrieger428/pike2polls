'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, Alert } from '@/components/ui';
import { Container } from '@/components/layout';
import { supabase, TABLES, type Signup, type Volunteer } from '@/lib/supabase';
import Link from 'next/link';
import { AdminProtected } from '@/components/admin';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

function DashboardContent() {
  const { user, signOut } = useAuth();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signups' | 'volunteers'>('signups');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      // Load signups
      const { data: signupsData, error: signupsError } = await supabase
        .from(TABLES.SIGNUPS)
        .select('*')
        .order('created_at', { ascending: false });

      if (signupsError) throw signupsError;
      setSignups(signupsData || []);

      // Load volunteers
      const { data: volunteersData, error: volunteersError } = await supabase
        .from(TABLES.VOLUNTEERS)
        .select('*')
        .order('created_at', { ascending: false });

      if (volunteersError) throw volunteersError;
      setVolunteers(volunteersData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  const updateSignupStatus = async (id: string, status: Signup['status']) => {
    try {
      const { error } = await supabase
        .from(TABLES.SIGNUPS)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const updateVolunteerStatus = async (id: string, status: Volunteer['status']) => {
    try {
      const { error } = await supabase
        .from(TABLES.VOLUNTEERS)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const exportToCSV = () => {
    const data = activeTab === 'signups' ? signups : volunteers;
    const filename = activeTab === 'signups' ? 'signups' : 'volunteers';

    // Define CSV headers based on type
    const headers = activeTab === 'signups'
      ? ['Date', 'Name', 'Email', 'Phone', 'Address', 'Voting Date', 'Preferred Time', 'Status']
      : ['Date', 'Name', 'Email', 'Phone', 'Driver', 'Logistical Support', 'Availability', 'Status'];

    // Convert data to CSV
    const csvRows = [
      headers.join(','),
      ...data.map((row) => {
        if (activeTab === 'signups') {
          const signup = row as Signup;
          return [
            format(new Date(signup.created_at), 'MM/dd/yyyy'),
            `${signup.first_name} ${signup.last_name}`,
            signup.email || '',
            signup.phone || '',
            signup.address || '',
            signup.voting_date,
            signup.preferred_time,
            signup.status,
          ].join(',');
        } else {
          const volunteer = row as Volunteer;
          return [
            format(new Date(volunteer.created_at), 'MM/dd/yyyy'),
            `${volunteer.first_name} ${volunteer.last_name}`,
            volunteer.email,
            volunteer.phone,
            volunteer.is_driver ? 'Yes' : 'No',
            volunteer.is_logistical_support ? 'Yes' : 'No',
            volunteer.time_slots.join('; '),
            volunteer.status,
          ].join(',');
        }
      }),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSignups = signups.filter(signup => {
    if (statusFilter === 'all') return true;
    return signup.status === statusFilter;
  });

  const filteredVolunteers = volunteers.filter(volunteer => {
    if (statusFilter === 'all') return true;
    return volunteer.status === statusFilter;
  });

  const stats = {
    totalSignups: signups.length,
    pendingSignups: signups.filter(s => s.status === 'pending').length,
    confirmedSignups: signups.filter(s => s.status === 'confirmed').length,
    totalVolunteers: volunteers.length,
    pendingVolunteers: volunteers.filter(v => v.status === 'pending').length,
    confirmedVolunteers: volunteers.filter(v => v.status === 'confirmed').length,
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-section">
      <Container>
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-display-xl font-bold text-text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-body-md text-text-secondary">
                Manage ride signups and volunteer applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.email && (
                <span className="hidden sm:inline text-caption-sm text-text-tertiary">
                  {user.email}
                </span>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {user?.email && (
            <p className="text-caption-sm text-text-tertiary sm:hidden">
              Signed in as: {user.email}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6" role="alert">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              className="mt-3"
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-primary-600 mb-1">
              {stats.totalSignups}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Total Signups
            </div>
          </Card>

          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-warning-600 mb-1">
              {stats.pendingSignups}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Pending
            </div>
          </Card>

          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-success-600 mb-1">
              {stats.confirmedSignups}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Confirmed
            </div>
          </Card>

          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-primary-600 mb-1">
              {stats.totalVolunteers}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Volunteers
            </div>
          </Card>

          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-warning-600 mb-1">
              {stats.pendingVolunteers}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Pending
            </div>
          </Card>

          <Card className="text-center p-4">
            <div className="text-heading-lg font-bold text-success-600 mb-1">
              {stats.confirmedVolunteers}
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Confirmed
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('signups')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'signups'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-text-secondary hover:bg-neutral-200'
                }`}
              >
                Ride Signups ({signups.length})
              </button>
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'volunteers'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-text-secondary hover:bg-neutral-200'
                }`}
              >
                Volunteers ({volunteers.length})
              </button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-border-dark rounded-md text-sm flex-1 sm:flex-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={isLoading || (activeTab === 'signups' ? signups.length === 0 : volunteers.length === 0)}
              >
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                isLoading={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Table */}
        <Card>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-body-md text-text-secondary">Loading...</p>
            </div>
          ) : activeTab === 'signups' ? (
            <>
              {filteredSignups.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-body-md text-text-secondary mb-4">
                    {signups.length === 0
                      ? 'No ride signups yet. Share the signup form to get started!'
                      : 'No signups match the current filter.'}
                  </p>
                  {signups.length === 0 && (
                    <Link href="/signup">
                      <Button variant="primary">View Signup Form</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border-light">
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Date</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Name</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Contact</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Voting Date</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Time</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Status</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSignups.map((signup) => (
                        <tr key={signup.id} className="border-b border-border-light hover:bg-surface-hover">
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {format(new Date(signup.created_at), 'MM/dd/yyyy')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-body-md font-medium text-text-primary">
                              {signup.first_name} {signup.last_name}
                            </div>
                            {signup.address && (
                              <div className="text-caption-sm text-text-tertiary mt-1">
                                {signup.address}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {signup.email && (
                              <a href={`mailto:${signup.email}`} className="block hover:text-primary-600">
                                {signup.email}
                              </a>
                            )}
                            {signup.phone && (
                              <div className="mt-1">{signup.phone}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {signup.voting_date.replace(/-/g, ' ')}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {signup.preferred_time}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-caption-md font-medium ${
                              signup.status === 'confirmed' ? 'bg-success-100 text-success-800' :
                              signup.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                              'bg-error-100 text-error-800'
                            }`}>
                              {signup.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <select
                                value={signup.status}
                                onChange={(e) => updateSignupStatus(signup.id, e.target.value as Signup['status'])}
                                className="px-2 py-1 border border-border-dark rounded text-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              {filteredVolunteers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-body-md text-text-secondary mb-4">
                    {volunteers.length === 0
                      ? 'No volunteer applications yet.'
                      : 'No volunteers match the current filter.'}
                  </p>
                  {volunteers.length === 0 && (
                    <Link href="/volunteer">
                      <Button variant="primary">View Volunteer Form</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border-light">
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Date</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Name</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Contact</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Roles</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Availability</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Status</th>
                        <th className="px-4 py-3 text-caption-sm font-semibold text-text-tertiary uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer.id} className="border-b border-border-light hover:bg-surface-hover">
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {format(new Date(volunteer.created_at), 'MM/dd/yyyy')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-body-md font-medium text-text-primary">
                              {volunteer.first_name} {volunteer.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            <a href={`mailto:${volunteer.email}`} className="block hover:text-primary-600">
                              {volunteer.email}
                            </a>
                            <div className="mt-1">{volunteer.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {volunteer.is_driver && <div className="text-caption-sm">🚗 Driver</div>}
                            {volunteer.is_logistical_support && <div className="text-caption-sm">📦 Logistics</div>}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-text-secondary">
                            {volunteer.all_days ? 'All days' : volunteer.time_slots.join(', ')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 rounded-full text-caption-md font-medium ${
                              volunteer.status === 'confirmed' ? 'bg-success-100 text-success-800' :
                              volunteer.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                              'bg-error-100 text-error-800'
                            }`}>
                              {volunteer.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <select
                                value={volunteer.status}
                                onChange={(e) => updateVolunteerStatus(volunteer.id, e.target.value as Volunteer['status'])}
                                className="px-2 py-1 border border-border-dark rounded text-sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-heading-md font-semibold text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/" className="block">
              <Card className="hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div>
                    <div className="text-heading-md font-medium text-text-primary">
                      View Public Site
                    </div>
                    <div className="text-caption-sm text-text-tertiary">
                      Go to the home page
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/faq" className="block">
              <Card className="hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-heading-md font-medium text-text-primary">
                      View FAQ
                    </div>
                    <div className="text-caption-sm text-text-tertiary">
                      Frequently asked questions
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminProtected requireAdmin={true}>
      <DashboardContent />
    </AdminProtected>
  );
}
