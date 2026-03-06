'use client';

import { useState } from 'react';
import { Card, Button, Alert } from '@/components/ui';
import type { Volunteer } from '@/lib/supabase';
import { supabase, TABLES } from '@/lib/supabase';

interface VolunteerEditModalProps {
  volunteer: Volunteer;
  onClose: () => void;
  onSave: () => void;
}

export function VolunteerEditModal({ volunteer, onClose, onSave }: VolunteerEditModalProps) {
  const [formData, setFormData] = useState({
    first_name: volunteer.first_name,
    last_name: volunteer.last_name,
    email: volunteer.email,
    phone: volunteer.phone,
    is_driver: volunteer.is_driver,
    is_logistical_support: volunteer.is_logistical_support,
    vehicle_make_model: volunteer.vehicle_make_model || '',
    number_of_seats: volunteer.number_of_seats?.toString() || '',
    license_plate: volunteer.license_plate || '',
    drive_alone_preference: volunteer.drive_alone_preference || '',
    has_valid_insurance: volunteer.has_valid_insurance?.toString() || '',
    driving_history_issues: volunteer.driving_history_issues || '',
    needs_gas_reimbursement: volunteer.needs_gas_reimbursement?.toString() || '',
    notes: volunteer.notes || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        is_driver: formData.is_driver,
        is_logistical_support: formData.is_logistical_support,
        notes: formData.notes || null,
      };

      // Only include driver fields if they're a driver
      if (formData.is_driver) {
        updateData.vehicle_make_model = formData.vehicle_make_model || null;
        updateData.number_of_seats = formData.number_of_seats ? parseInt(formData.number_of_seats, 10) : null;
        updateData.license_plate = formData.license_plate || null;
        updateData.drive_alone_preference = formData.drive_alone_preference || null;
        updateData.has_valid_insurance = formData.has_valid_insurance === 'true' ? true : formData.has_valid_insurance === 'false' ? false : null;
        updateData.driving_history_issues = formData.driving_history_issues || null;
        updateData.needs_gas_reimbursement = formData.needs_gas_reimbursement === 'true' ? true : formData.needs_gas_reimbursement === 'false' ? false : null;
      } else {
        // Clear driver fields if not a driver
        updateData.vehicle_make_model = null;
        updateData.number_of_seats = null;
        updateData.license_plate = null;
        updateData.drive_alone_preference = null;
        updateData.has_valid_insurance = null;
        updateData.driving_history_issues = null;
        updateData.needs_gas_reimbursement = null;
      }

      const { error: updateError } = await supabase
        .from(TABLES.VOLUNTEERS)
        .update(updateData)
        .eq('id', volunteer.id);

      if (updateError) throw updateError;

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update volunteer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-2xl w-full p-6 my-8">
        <div className="mb-6">
          <h3 className="text-heading-xl font-semibold text-text-primary mb-2">
            Edit Volunteer Information
          </h3>
          <p className="text-body-sm text-text-secondary">
            Update volunteer details and driver information
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6" role="alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-heading-md font-semibold text-text-primary mb-4">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-caption-md font-medium text-text-secondary mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className="w-full px-3 py-2 border border-border-dark rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-caption-md font-medium text-text-secondary mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className="w-full px-3 py-2 border border-border-dark rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-caption-md font-medium text-text-secondary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-border-dark rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-caption-md font-medium text-text-secondary mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-border-dark rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-heading-md font-semibold text-text-primary mb-4">
              Roles
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_driver}
                  onChange={(e) => handleChange('is_driver', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-body-md text-text-secondary">Driver</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_logistical_support}
                  onChange={(e) => handleChange('is_logistical_support', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-body-md text-text-secondary">Logistical Support</span>
              </label>
            </div>
          </div>

          {/* Driver Information */}
          {formData.is_driver && (
            <div className="bg-neutral-50 p-4 rounded-lg">
              <h4 className="text-heading-md font-semibold text-text-primary mb-4">
                Driver Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-caption-md font-medium text-text-secondary mb-2">
                    Vehicle Make & Model
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_make_model}
                    onChange={(e) => handleChange('vehicle_make_model', e.target.value)}
                    placeholder="e.g., Toyota Camry 2020"
                    className="w-full px-3 py-2 border border-border-dark rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.number_of_seats}
                      onChange={(e) => handleChange('number_of_seats', e.target.value)}
                      placeholder="e.g., 4"
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      License Plate
                    </label>
                    <input
                      type="text"
                      value={formData.license_plate}
                      onChange={(e) => handleChange('license_plate', e.target.value)}
                      placeholder="e.g., ABC1234"
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      Driving Alone Preference
                    </label>
                    <select
                      value={formData.drive_alone_preference}
                      onChange={(e) => handleChange('drive_alone_preference', e.target.value)}
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    >
                      <option value="">Select...</option>
                      <option value="alone">Alone</option>
                      <option value="paired">Paired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      Has Valid Insurance
                    </label>
                    <select
                      value={formData.has_valid_insurance}
                      onChange={(e) => handleChange('has_valid_insurance', e.target.value)}
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      Driving History Issues
                    </label>
                    <select
                      value={formData.driving_history_issues}
                      onChange={(e) => handleChange('driving_history_issues', e.target.value)}
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    >
                      <option value="">Select...</option>
                      <option value="no">No</option>
                      <option value="speeding_tickets_only">Speeding Tickets Only</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-caption-md font-medium text-text-secondary mb-2">
                      Needs Gas Reimbursement
                    </label>
                    <select
                      value={formData.needs_gas_reimbursement}
                      onChange={(e) => handleChange('needs_gas_reimbursement', e.target.value)}
                      className="w-full px-3 py-2 border border-border-dark rounded-md"
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-caption-md font-medium text-text-secondary mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              className="w-full px-3 py-2 border border-border-dark rounded-md"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border-light">
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
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
