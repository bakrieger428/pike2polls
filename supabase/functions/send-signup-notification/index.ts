/**
 * Supabase Edge Function: Send Signup Notification Email
 *
 * Triggered by database webhooks on INSERT to signups and volunteers tables.
 * Sends formatted email notifications to support@pike2thepolls.com using Resend API.
 *
 * Environment Variables Required:
 * - RESEND_API_KEY: Resend API key for sending emails
 *
 * @see https://supabase.com/docs/guides/functions
 * @see https://resend.com/docs/api-reference/emails/send
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

// Type definitions for database webhook payloads
interface SignupRecord {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  is_pike_resident: boolean;
  is_registered_voter: boolean;
  voting_date: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day';
  preferred_time: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  liability_waiver_agreed: boolean;
  disclaimer_agreed: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  contacted?: boolean;
  accepted_terms?: boolean;
  pickup_confirmed?: boolean;
  admin_notes?: string;
}

interface VolunteerRecord {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_driver: boolean;
  is_logistical_support: boolean;
  may_2: boolean;
  may_3: boolean;
  may_5: boolean;
  all_days: boolean;
  time_slots: string[];
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  vehicle_make_model?: string;
  number_of_seats?: number;
  license_plate?: string;
  drive_alone_preference?: 'alone' | 'paired';
  has_valid_insurance?: boolean;
  driving_history_issues?: 'yes' | 'speeding_tickets_only' | 'no';
  needs_gas_reimbursement?: boolean;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: SignupRecord | VolunteerRecord;
  schema: 'public';
  old_record: null;
}

// Configuration
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'noreply@pike2thepolls.com';
const TO_EMAIL = 'support@pike2thepolls.com';

// Validate environment variables
if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY environment variable is not set');
}

// Initialize Resend client
const resend = new Resend(RESEND_API_KEY);

/**
 * Format voting date for display
 */
function formatVotingDate(date: string): string {
  const dateMap: Record<string, string> = {
    'early-voting-date-1': 'Early Voting - May 2, 2026',
    'early-voting-date-2': 'Early Voting - May 3, 2026',
    'election-day': 'Election Day - May 5, 2026',
  };
  return dateMap[date] || date;
}

/**
 * Format volunteer availability for display
 */
function formatVolunteerAvailability(record: VolunteerRecord): string {
  const days: string[] = [];
  if (record.all_days) {
    days.push('All Days (May 2, 3, and 5)');
  } else {
    if (record.may_2) days.push('May 2');
    if (record.may_3) days.push('May 3');
    if (record.may_5) days.push('May 5');
  }
  return days.length > 0 ? days.join(', ') : 'None specified';
}

/**
 * Format volunteer roles for display
 */
function formatVolunteerRoles(record: VolunteerRecord): string {
  const roles: string[] = [];
  if (record.is_driver) roles.push('Driver');
  if (record.is_logistical_support) roles.push('Logistical Support');
  return roles.length > 0 ? roles.join(', ') : 'None specified';
}

/**
 * Generate HTML email for rider signup
 */
function generateSignupEmail(record: SignupRecord): string {
  const votingDate = formatVotingDate(record.voting_date);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Rider Signup</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e40af;
      margin-top: 0;
      font-size: 24px;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 10px;
    }
    h2 {
      color: #374151;
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .field {
      margin-bottom: 12px;
    }
    .label {
      font-weight: 600;
      color: #4b5563;
      display: inline-block;
      min-width: 150px;
    }
    .value {
      color: #1f2937;
    }
    .boolean-yes {
      color: #059669;
      font-weight: 600;
    }
    .boolean-no {
      color: #dc2626;
      font-weight: 600;
    }
    .timestamp {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .footer {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background-color: #fef3c7;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚗 New Rider Signup</h1>
    <p><span class="badge">ID: ${record.id}</span></p>

    <h2>Personal Information</h2>
    <div class="field">
      <span class="label">Name:</span>
      <span class="value">${record.first_name} ${record.last_name}</span>
    </div>
    <div class="field">
      <span class="label">Email:</span>
      <span class="value">${record.email || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">Phone:</span>
      <span class="value">${record.phone || 'Not provided'}</span>
    </div>

    <h2>Eligibility</h2>
    <div class="field">
      <span class="label">Pike Resident:</span>
      <span class="value ${record.is_pike_resident ? 'boolean-yes' : 'boolean-no'}">
        ${record.is_pike_resident ? '✓ Yes' : '✗ No'}
      </span>
    </div>
    <div class="field">
      <span class="label">Registered Voter:</span>
      <span class="value ${record.is_registered_voter ? 'boolean-yes' : 'boolean-no'}">
        ${record.is_registered_voter ? '✓ Yes' : '✗ No'}
      </span>
    </div>

    <h2>Voting Preferences</h2>
    <div class="field">
      <span class="label">Voting Date:</span>
      <span class="value">${votingDate}</span>
    </div>
    <div class="field">
      <span class="label">Preferred Time:</span>
      <span class="value">${record.preferred_time}</span>
    </div>

    <h2>Pickup Information</h2>
    <div class="field">
      <span class="label">Address:</span>
      <span class="value">${record.address || 'Not provided'}</span>
    </div>

    ${record.notes ? `
    <h2>Additional Notes</h2>
    <div class="field">
      <span class="value">${record.notes}</span>
    </div>
    ` : ''}

    <h2>Agreements</h2>
    <div class="field">
      <span class="label">Liability Waiver:</span>
      <span class="value ${record.liability_waiver_agreed ? 'boolean-yes' : 'boolean-no'}">
        ${record.liability_waiver_agreed ? '✓ Agreed' : '✗ Not agreed'}
      </span>
    </div>
    <div class="field">
      <span class="label">Disclaimer:</span>
      <span class="value ${record.disclaimer_agreed ? 'boolean-yes' : 'boolean-no'}">
        ${record.disclaimer_agreed ? '✓ Acknowledged' : '✗ Not acknowledged'}
      </span>
    </div>
    <div class="field">
      <span class="label">Status:</span>
      <span class="value">${record.status}</span>
    </div>

    <div class="timestamp">
      <strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString('en-US', {
        timeZone: 'America/Indiana/Indianapolis',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}<br>
      <strong>Signup ID:</strong> ${record.id}
    </div>

    <div class="footer">
      This email was sent automatically by the Pike2ThePolls signup system.<br>
      Please log in to the admin dashboard to manage this signup.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML email for volunteer signup
 */
function generateVolunteerEmail(record: VolunteerRecord): string {
  const roles = formatVolunteerRoles(record);
  const availability = formatVolunteerAvailability(record);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Volunteer Signup</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #1e40af;
      margin-top: 0;
      font-size: 24px;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 10px;
    }
    h2 {
      color: #374151;
      font-size: 18px;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .field {
      margin-bottom: 12px;
    }
    .label {
      font-weight: 600;
      color: #4b5563;
      display: inline-block;
      min-width: 150px;
    }
    .value {
      color: #1f2937;
    }
    .boolean-yes {
      color: #059669;
      font-weight: 600;
    }
    .timestamp {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .footer {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background-color: #dbeafe;
      color: #1e40af;
    }
    ul {
      margin: 5px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🙋 New Volunteer Signup</h1>
    <p><span class="badge">ID: ${record.id}</span></p>

    <h2>Personal Information</h2>
    <div class="field">
      <span class="label">Name:</span>
      <span class="value">${record.first_name} ${record.last_name}</span>
    </div>
    <div class="field">
      <span class="label">Email:</span>
      <span class="value">${record.email}</span>
    </div>
    <div class="field">
      <span class="label">Phone:</span>
      <span class="value">${record.phone}</span>
    </div>

    <h2>Volunteer Roles</h2>
    <div class="field">
      <span class="label">Roles:</span>
      <span class="value">${roles}</span>
    </div>

    <h2>Availability</h2>
    <div class="field">
      <span class="label">Days:</span>
      <span class="value">${availability}</span>
    </div>
    <div class="field">
      <span class="label">Time Slots:</span>
      <span class="value">
        <ul>
          ${record.time_slots.map(slot => `<li>${slot}</li>`).join('')}
        </ul>
      </span>
    </div>

    ${record.is_driver ? `
    <h2>Driver Information</h2>
    <div class="field">
      <span class="label">Vehicle:</span>
      <span class="value">${record.vehicle_make_model || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">Seats Available:</span>
      <span class="value">${record.number_of_seats || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">License Plate:</span>
      <span class="value">${record.license_plate || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">Insurance Valid:</span>
      <span class="value ${record.has_valid_insurance ? 'boolean-yes' : 'boolean-no'}">
        ${record.has_valid_insurance ? '✓ Yes' : '✗ No'}
      </span>
    </div>
    <div class="field">
      <span class="label">Driving History:</span>
      <span class="value">${record.driving_history_issues || 'Not specified'}</span>
    </div>
    <div class="field">
      <span class="label">Gas Reimbursement:</span>
      <span class="value ${record.needs_gas_reimbursement ? 'boolean-yes' : ''}">
        ${record.needs_gas_reimbursement ? 'Yes' : 'No'}
      </span>
    </div>
    ` : ''}

    ${record.notes ? `
    <h2>Additional Notes</h2>
    <div class="field">
      <span class="value">${record.notes}</span>
    </div>
    ` : ''}

    <div class="field">
      <span class="label">Status:</span>
      <span class="value">${record.status}</span>
    </div>

    <div class="timestamp">
      <strong>Submitted:</strong> ${new Date(record.created_at).toLocaleString('en-US', {
        timeZone: 'America/Indiana/Indianapolis',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}<br>
      <strong>Volunteer ID:</strong> ${record.id}
    </div>

    <div class="footer">
      This email was sent automatically by the Pike2ThePolls volunteer signup system.<br>
      Please log in to the admin dashboard to manage this volunteer.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send email using Resend API
 */
async function sendEmail(subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  console.log(`Sending email to ${TO_EMAIL}...`);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: subject,
      html: html,
    });

    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Main handler for the Edge Function
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 });
  }

  try {
    // Parse webhook payload
    const payload: WebhookPayload = await req.json();

    console.log(`Received ${payload.type} event for table: ${payload.table}`);

    // Only handle INSERT events
    if (payload.type !== 'INSERT') {
      console.log(`Skipping event type: ${payload.type}`);
      return new Response(JSON.stringify({ message: 'Event type not handled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process based on table type
    let subject: string;
    let htmlContent: string;

    if (payload.table === 'signups') {
      const record = payload.record as SignupRecord;
      subject = `🚗 New Rider Signup: ${record.first_name} ${record.last_name}`;
      htmlContent = generateSignupEmail(record);
      console.log(`Processing rider signup: ${record.first_name} ${record.last_name}`);
    } else if (payload.table === 'volunteers') {
      const record = payload.record as VolunteerRecord;
      subject = `🙋 New Volunteer Signup: ${record.first_name} ${record.last_name}`;
      htmlContent = generateVolunteerEmail(record);
      console.log(`Processing volunteer signup: ${record.first_name} ${record.last_name}`);
    } else {
      console.log(`Skipping table: ${payload.table}`);
      return new Response(JSON.stringify({ message: 'Table not handled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email
    await sendEmail(subject, htmlContent);

    return new Response(JSON.stringify({
      success: true,
      message: 'Email notification sent successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
