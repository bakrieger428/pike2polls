# Email Notifications for Rider and Volunteer Signups

This document describes the email notification system that sends automated emails when new riders or volunteers sign up.

## Overview

The email notification system uses:
- **Supabase Edge Functions** - Serverless functions running on Deno
- **Database Webhooks** - PostgreSQL triggers that fire on INSERT events
- **Resend API** - Email delivery service with free tier (3,000 emails/month)

## Architecture

```
Form Submission
    ↓
Supabase Database (INSERT trigger)
    ↓
PostgreSQL Webhook Function
    ↓
Supabase Edge Function (send-signup-notification)
    ↓
Resend API
    ↓
Email sent to support@pike2thepolls.com
```

## Prerequisites

### 1. Resend Account Setup

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Create a free account
3. Navigate to [https://resend.com/api-keys](https://resend.com/api-keys)
4. Click "Create API Key"
5. Copy the API key

### 2. Verify Email Domain (One-Time Setup)

**Important**: Before sending emails, you must verify the sending domain in Resend.

1. In Resend dashboard, go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Add: `pike2thepolls.com`
4. Add DNS records to your domain registrar (GoDaddy, Namecheap, etc.):
   - TXT record for verification
   - MX records for email delivery
5. Wait for DNS propagation (usually 1-24 hours)

**Note**: For testing, you can use Resend's default domain (you don't need to verify your domain immediately).

## Setup Instructions

### Step 1: Set Environment Variables

Add to your `.env.local` file:

```bash
# Resend API Key (server-side, no NEXT_PUBLIC_ prefix)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Add to Vercel Environment Variables:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `RESEND_API_KEY` (server-side variable, do NOT add NEXT_PUBLIC_ prefix)
3. Set for Production, Preview, and Development environments

### Step 2: Deploy Edge Function

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Windows
   scoop bucket add supabase https://github.com/supabase/supabase scoop install supabase

   # Linux
   curl https://get.supabase.com | sh
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

3. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-signup-notification
   ```

4. Set the environment variable in Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=your_actual_api_key_here
   ```

#### Option B: Using Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Edge Functions
4. Click "New Function"
5. Name: `send-signup-notification`
6. Copy contents of `supabase/functions/send-signup-notification/index.ts`
7. Paste into the function editor
8. Click "Save" then "Deploy"
9. Add environment variable: `RESEND_API_KEY`

### Step 3: Set Up Database Triggers

1. Open the SQL migration file:
   ```
   supabase-migrations/add-email-notification-triggers.sql
   ```

2. Replace placeholders:
   - `YOUR_SUPABASE_PROJECT_ID` - Get from your Supabase project URL
     - Example: If URL is `https://abcdefgh.supabase.co`, use `abcdefgh`
   - `YOUR_SUPABASE_ANON_KEY` - Get from `.env.local` or Supabase dashboard

3. Run the migration in Supabase SQL Editor:
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the updated migration SQL
   - Click "Run"

Alternatively, use Supabase CLI:
```bash
supabase db push
```

## Testing

### Test Rider Signup Email

1. Go to `/signup` on your local or deployed site
2. Fill out the complete rider signup form
3. Submit the form
4. Check email at `support@pike2thepolls.com`
5. Should receive email with subject: `🚗 New Rider Signup: [Name]`

### Test Volunteer Signup Email

1. Go to `/volunteer/signup` on your local or deployed site
2. Fill out the complete volunteer signup form
3. Submit the form
4. Check email at `support@pike2thepolls.com`
5. Should receive email with subject: `🙋 New Volunteer Signup: [Name]`

### Test Edge Function Directly

You can test the Edge Function directly using curl:

```bash
curl -X POST \
  'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-signup-notification' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -d '{
    "type": "INSERT",
    "table": "signups",
    "schema": "public",
    "record": {
      "id": "test-123",
      "created_at": "2026-03-11T12:00:00Z",
      "first_name": "Test",
      "last_name": "User",
      "is_pike_resident": true,
      "is_registered_voter": true,
      "voting_date": "election-day",
      "preferred_time": "9:00 AM",
      "email": "test@example.com",
      "phone": "555-123-4567",
      "address": "123 Main St, Indianapolis, IN 46235",
      "liability_waiver_agreed": true,
      "disclaimer_agreed": true,
      "status": "pending"
    },
    "old_record": null
  }'
```

## Troubleshooting

### Emails Not Arriving

1. **Check Resend Dashboard**: [https://resend.com/dashboard/logs](https://resend.com/logs)
   - Shows all email attempts and error messages
   - Check for bounces, spam reports, or delivery failures

2. **Check Spam Folder**: Emails may be filtered to spam initially

3. **Verify Domain**: Ensure `pike2thepolls.com` is verified in Resend

4. **Check Environment Variables**:
   ```bash
   # In Supabase CLI
   supabase secrets list

   # Should show RESEND_API_KEY
   ```

5. **Check Edge Function Logs**:
   - Supabase Dashboard → Edge Functions → send-signup-notification → Logs
   - Look for error messages or failed requests

### Database Triggers Not Working

1. **Verify Triggers Exist**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT
     trigger_name,
     event_object_table,
     action_statement
   FROM information_schema.triggers
   WHERE trigger_name IN ('on_new_signup', 'on_new_volunteer');
   ```

2. **Check pg_net Extension**:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

3. **Test Trigger Manually**:
   ```sql
   -- Insert test signup
   INSERT INTO signups (
     first_name, last_name, email, phone,
     is_pike_resident, is_registered_voter,
     voting_date, preferred_time,
     liability_waiver_agreed, disclaimer_agreed,
     status
   ) VALUES (
     'Test', 'User', 'test@example.com', '555-123-4567',
     true, true,
     'election-day', '9:00 AM',
     true, true,
     'pending'
   );
   ```

### API Key Issues

1. **Invalid API Key**: Ensure you're using the correct Resend API key
   - Go to [https://resend.com/api-keys](https://resend.com/api-keys)
   - Copy the key (starts with `re_`)

2. **Environment Variable Not Set**:
   ```bash
   # Set in Supabase
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx

   # Verify it's set
   supabase secrets list
   ```

## Email Templates

### Rider Signup Email Includes:
- Personal information (name, email, phone)
- Eligibility status (Pike resident, registered voter)
- Voting preferences (date, time)
- Pickup address
- Agreements (liability waiver, disclaimer)
- Timestamp and signup ID

### Volunteer Signup Email Includes:
- Personal information (name, email, phone)
- Volunteer roles (driver, logistical support)
- Availability (days, time slots)
- Driver information (if applicable: vehicle, seats, insurance, etc.)
- Notes
- Timestamp and volunteer ID

Both emails are formatted with responsive HTML for easy reading on any device.

## Costs

- **Resend Free Tier**: 3,000 emails per month
- **Overage**: $1 per 1,000 emails (as of 2026)
- **Expected Usage**: ~50-200 signups total (temporary election app)

**Recommendation**: Free tier should be sufficient. Monitor usage in Resend dashboard.

## Security Notes

1. **API Key Security**:
   - `RESEND_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
   - Never exposed to client-side JavaScript
   - Stored securely in Supabase Edge Function environment

2. **Email Recipient**:
   - Hardcoded to `support@pike2thepolls.com`
   - Cannot be manipulated by form submissions
   - Prevents spam and abuse

3. **Rate Limiting**:
   - Resend has built-in rate limiting
   - Database triggers only fire on legitimate INSERT operations
   - No direct API exposure to public

## Monitoring

### Resend Dashboard
- **Logs**: [https://resend.com/logs](https://resend.com/logs)
- **Analytics**: Email open rate, click rate, delivery rate
- **Bounces**: Failed deliveries and reasons

### Supabase Dashboard
- **Edge Function Logs**: [https://supabase.com/dashboard/project/_/functions](https://supabase.com/dashboard)
- **Database Logs**: Trigger executions and errors

## Maintenance

### Change Email Recipient
Edit `supabase/functions/send-signup-notification/index.ts`:
```typescript
const TO_EMAIL = 'your-new-email@example.com';
```

Then redeploy:
```bash
supabase functions deploy send-signup-notification
```

### Update Email Templates
Edit the `generateSignupEmail()` or `generateVolunteerEmail()` functions in:
`supabase/functions/send-signup-notification/index.ts`

### Disable Email Notifications
```sql
-- Disable triggers (run in Supabase SQL Editor)
DROP TRIGGER IF EXISTS on_new_signup ON signups;
DROP TRIGGER IF EXISTS on_new_volunteer ON volunteers;
```

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend API Docs](https://resend.com/docs/api-reference/emails/send)
- [PostgreSQL pg_net Extension](https://github.com/supabase/pg_net)
- [Resend Email Templates Guide](https://resend.com/docs/send-email/nextjs/with-react-email)
