'use client';

import { useState, useEffect } from 'react';
import { Button, Alert } from '@/components/ui';
import type { Signup, Volunteer, DriverAssignment } from '@/lib/supabase';
import { supabase, TABLES } from '@/lib/supabase';

interface RiderInfoModalProps {
  signup: Signup;
  availableDrivers: Volunteer[];
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  contacted: string;
  accepted_terms: string;
  pickup_confirmed: string;
  assigned_driver_id: string;
  admin_notes: string;
}

export function RiderInfoModal({ signup, availableDrivers, onClose, onSave }: RiderInfoModalProps) {
  const [formData, setFormData] = useState<FormData>({
    contacted: signup.contacted ? 'true' : 'false',
    accepted_terms: signup.accepted_terms ? 'true' : 'false',
    pickup_confirmed: signup.pickup_confirmed ? 'true' : 'false',
    assigned_driver_id: '',
    admin_notes: signup.admin_notes || '',
  });
  const [existingAssignment, setExistingAssignment] = useState<DriverAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Lock body scroll when modal opens
  useEffect(() => {
    const originalStyle = window.document.body.style.overflow;
    const originalPaddingRight = window.document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, []);

  // Load existing driver assignment
  useEffect(() => {
    async function loadExistingAssignment() {
      // First check if this signup is in any group
      const { data: groupMember } = await supabase
        .from(TABLES.GROUP_MEMBERS)
        .select('group_id')
        .eq('signup_id', signup.id)
        .maybeSingle();

      if (groupMember) {
        // Then check if that group has a driver assignment
        const { data: assignment } = await supabase
          .from(TABLES.DRIVER_ASSIGNMENTS)
          .select('*, volunteers!inner(id, first_name, last_name)')
          .eq('group_id', groupMember.group_id)
          .maybeSingle();

        if (assignment) {
          setExistingAssignment(assignment);
          setFormData(prev => ({ ...prev, assigned_driver_id: assignment.volunteer_id }));
        }
      }
    }

    loadExistingAssignment();
  }, [signup.id]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setWarning(null);
  };

  // Filter drivers available on the rider's voting date
  const availableDriversForDate = availableDrivers.filter(driver => {
    if (!driver.is_driver || driver.status !== 'confirmed') return false;

    // Check if driver is available on the voting date
    const votingDateField = signup.voting_date === 'early-voting-date-1' ? 'may_2' :
                            signup.voting_date === 'early-voting-date-2' ? 'may_3' : 'may_5';
    return driver.all_days || driver[votingDateField];
  });

  const validateForm = (): boolean => {
    // Require "Contacted" before "Accepted Terms" or "Pickup Confirmed" can be Yes
    if (formData.contacted !== 'true') {
      if (formData.accepted_terms === 'true' || formData.pickup_confirmed === 'true') {
        setError('Rider must be contacted before they can accept terms or have pickup confirmed.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setWarning(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Update signup with new status
      const updateData: {
        contacted: boolean;
        accepted_terms: boolean;
        pickup_confirmed: boolean;
        admin_notes: string | null;
      } = {
        contacted: formData.contacted === 'true',
        accepted_terms: formData.accepted_terms === 'true',
        pickup_confirmed: formData.pickup_confirmed === 'true',
        admin_notes: formData.admin_notes || null,
      };

      const { error: updateError } = await supabase
        .from(TABLES.SIGNUPS)
        .update(updateData)
        .eq('id', signup.id);

      if (updateError) throw updateError;

      // Handle driver assignment
      if (formData.assigned_driver_id && formData.assigned_driver_id !== existingAssignment?.volunteer_id) {
        // Check if rider is already assigned to a different group
        const { data: existingMember } = await supabase
          .from(TABLES.GROUP_MEMBERS)
          .select('group_id, rider_groups!inner(voting_date, preferred_time)')
          .eq('signup_id', signup.id)
          .maybeSingle();

        if (existingMember) {
          setWarning('Rider is already assigned to another group. This will create a new assignment.');
        }

        // Find existing rider group for this driver on this date/time, or create new one
        const { data: existingGroup } = await supabase
          .from(TABLES.RIDER_GROUPS)
          .select('id, group_members!inner(signup_id)')
          .eq('voting_date', signup.voting_date)
          .eq('preferred_time', signup.preferred_time)
          .limit(1)
          .maybeSingle();

        let groupId: string;

        if (existingGroup) {
          groupId = existingGroup.id;
        } else {
          // Create new rider group
          const { data: newGroup, error: groupError } = await supabase
            .from(TABLES.RIDER_GROUPS)
            .insert({
              voting_date: signup.voting_date,
              preferred_time: signup.preferred_time,
            })
            .select('id')
            .single();

          if (groupError) throw groupError;
          groupId = newGroup.id;
        }

        // Add rider as group member if not already a member
        const { data: existingMemberCheck } = await supabase
          .from(TABLES.GROUP_MEMBERS)
          .select('id')
          .eq('group_id', groupId)
          .eq('signup_id', signup.id)
          .maybeSingle();

        if (!existingMemberCheck) {
          const { error: memberError } = await supabase
            .from(TABLES.GROUP_MEMBERS)
            .insert({
              group_id: groupId,
              signup_id: signup.id,
            });

          if (memberError) throw memberError;
        }

        // Create driver assignment
        const { error: assignmentError } = await supabase
          .from(TABLES.DRIVER_ASSIGNMENTS)
          .insert({
            volunteer_id: formData.assigned_driver_id,
            voting_date: signup.voting_date,
            preferred_time: signup.preferred_time,
            group_id: groupId,
            status: 'assigned',
          });

        if (assignmentError) throw assignmentError;
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rider information');
    } finally {
      setIsLoading(false);
    }
  };

  const votingDateLabel = signup.voting_date === 'early-voting-date-1' ? 'May 2 (Early Voting)' :
                          signup.voting_date === 'early-voting-date-2' ? 'May 3 (Early Voting)' :
                          'May 5 (Election Day)';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full h-[85vh] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex-shrink-0 border-b border-border-light bg-white">
          <h3 className="text-heading-xl font-semibold text-text-primary mb-2">
            Rider Information
          </h3>
          <p className="text-body-sm text-text-secondary">
            Manage rider contact status and driver assignment
          </p>
          {error && (
            <div className="mt-4">
              <Alert variant="error" role="alert">
                {error}
              </Alert>
            </div>
          )}
          {warning && (
            <div className="mt-4">
              <Alert variant="warning" role="alert">
                {warning}
              </Alert>
            </div>
          )}
        </div>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rider Information - Read Only */}
            <div>
              <h4 className="text-heading-md font-semibold text-text-primary mb-4">
                Rider Details
              </h4>
              <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Name:</span>
                    <p className="text-body-md text-text-primary">
                      {signup.first_name} {signup.last_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Status:</span>
                    <p className="text-body-md text-text-primary capitalize">{signup.status}</p>
                  </div>
                </div>
                {signup.email && (
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Email:</span>
                    <p className="text-body-md text-text-primary">
                      <a href={`mailto:${signup.email}`} className="text-primary-600 hover:underline">
                        {signup.email}
                      </a>
                    </p>
                  </div>
                )}
                {signup.phone && (
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Phone:</span>
                    <p className="text-body-md text-text-primary">{signup.phone}</p>
                  </div>
                )}
                {signup.address && (
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Address:</span>
                    <p className="text-body-md text-text-primary">{signup.address}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Voting Date:</span>
                    <p className="text-body-md text-text-primary">{votingDateLabel}</p>
                  </div>
                  <div>
                    <span className="text-caption-md font-medium text-text-tertiary">Preferred Time:</span>
                    <p className="text-body-md text-text-primary">{signup.preferred_time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Status */}
            <div>
              <h4 className="text-heading-md font-semibold text-text-primary mb-4">
                Contact Status
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-caption-md font-medium text-text-secondary mb-2">
                    Contacted *
                  </label>
                  <select
                    value={formData.contacted}
                    onChange={(e) => handleChange('contacted', e.target.value)}
                    className="w-full px-3 py-2 border border-border-dark rounded-md"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-caption-md font-medium text-text-secondary mb-2">
                    Accepted Terms
                  </label>
                  <select
                    value={formData.accepted_terms}
                    onChange={(e) => handleChange('accepted_terms', e.target.value)}
                    className="w-full px-3 py-2 border border-border-dark rounded-md"
                    disabled={formData.contacted !== 'true'}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {formData.contacted !== 'true' && formData.accepted_terms === 'true' && (
                    <p className="text-caption-sm text-warning-600 mt-1">
                      Rider must be contacted first
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-caption-md font-medium text-text-secondary mb-2">
                    Pickup Confirmed
                  </label>
                  <select
                    value={formData.pickup_confirmed}
                    onChange={(e) => handleChange('pickup_confirmed', e.target.value)}
                    className="w-full px-3 py-2 border border-border-dark rounded-md"
                    disabled={formData.contacted !== 'true'}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                  {formData.contacted !== 'true' && formData.pickup_confirmed === 'true' && (
                    <p className="text-caption-sm text-warning-600 mt-1">
                      Rider must be contacted first
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Driver Assignment */}
            <div>
              <h4 className="text-heading-md font-semibold text-text-primary mb-4">
                Driver Assignment
              </h4>
              <div>
                <label className="block text-caption-md font-medium text-text-secondary mb-2">
                  Assign Driver
                </label>
                <select
                  value={formData.assigned_driver_id}
                  onChange={(e) => handleChange('assigned_driver_id', e.target.value)}
                  className="w-full px-3 py-2 border border-border-dark rounded-md"
                >
                  <option value="">Unassigned</option>
                  {availableDriversForDate.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                      {driver.vehicle_make_model ? ` (${driver.vehicle_make_model})` : ''}
                      {driver.number_of_seats ? ` - ${driver.number_of_seats} seats` : ''}
                    </option>
                  ))}
                </select>
                {availableDriversForDate.length === 0 && (
                  <p className="text-caption-sm text-warning-600 mt-1">
                    No confirmed drivers available for {votingDateLabel}
                  </p>
                )}
                {existingAssignment && !formData.assigned_driver_id && (
                  <p className="text-caption-sm text-warning-600 mt-1">
                    Removing existing driver assignment
                  </p>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-caption-md font-medium text-text-secondary mb-2">
                Admin Notes
              </label>
              <textarea
                value={formData.admin_notes}
                onChange={(e) => handleChange('admin_notes', e.target.value)}
                placeholder="Add any notes about this rider..."
                rows={3}
                className="w-full px-3 py-2 border border-border-dark rounded-md"
              />
            </div>
          </form>
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t border-border-light flex gap-3 justify-end flex-shrink-0 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
