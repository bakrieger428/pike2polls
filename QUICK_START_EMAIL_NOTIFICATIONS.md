# Quick Start Guide - Email Notifications

## 5-Minute Setup

### Prerequisites
- Supabase CLI installed
- Resend account (free - https://resend.com/signup)
- Access to Supabase dashboard

### Step 1: Get Resend API Key (2 minutes)
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Copy the key (starts with `re_`)

### Step 2: Run Setup Script (2 minutes)

#### Windows:
```bash
cd scripts
setup-email-notifications.bat
```

#### macOS/Linux:
```bash
cd scripts
chmod +x setup-email-notifications.sh
./setup-email-notifications.sh
```

### Step 3: Run Database Migration (1 minute)
The script will show you the SQL. Either:
- Copy/paste into Supabase SQL Editor, OR
- Run: `supabase db push`

### Step 4: Test
1. Go to `/signup` or `/volunteer/signup`
2. Submit a form
3. Check email at `support@pike2thepolls.com`

✅ Done!

## Manual Setup (Alternative)

If you prefer manual setup:

### 1. Deploy Edge Function
```bash
supabase link --project-ref YOUR_PROJECT_ID
supabase functions deploy send-signup-notification
supabase secrets set RESEND_API_KEY=re_your_key_here
```

### 2. Update Migration File
Edit `supabase-migrations/add-email-notification-triggers.sql`:
- Replace `YOUR_SUPABASE_PROJECT_ID` with your project ID
- Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

### 3. Run Migration
Go to Supabase Dashboard → SQL Editor → Run the migration

## Verification

### Check Function Deployed
```bash
supabase functions list
```
Should show: `send-signup-notification`

### Check Triggers
In Supabase SQL Editor:
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('on_new_signup', 'on_new_volunteer');
```

### Test Directly
```bash
curl -X POST \
  'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-signup-notification' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"type":"INSERT","table":"signups","record":{"id":"test","first_name":"Test","last_name":"User","email":"test@example.com","phone":"555-1234","voting_date":"election-day","preferred_time":"9:00 AM","is_pike_resident":true,"is_registered_voter":true,"liability_waiver_agreed":true,"disclaimer_agreed":true,"status":"pending"},"schema":"public","old_record":null}'
```

## Troubleshooting

### No Email Received?
1. Check Resend logs: https://resend.com/logs
2. Check Edge Function logs: Supabase Dashboard → Functions → Logs
3. Verify `RESEND_API_KEY` is set: `supabase secrets list`

### Trigger Not Firing?
```sql
-- Check if triggers exist
SELECT * FROM information_schema.triggers
WHERE trigger_name IN ('on_new_signup', 'on_new_volunteer');
```

### API Key Error?
```bash
# Verify key is set
supabase secrets list

# Reset if needed
supabase secrets set RESEND_API_KEY=re_your_actual_key
```

## Support

- Full documentation: `supabase/functions/send-signup-notification/README.md`
- Implementation details: `EMAIL_NOTIFICATIONS_IMPLEMENTATION.md`
- Resend docs: https://resend.com/docs
- Supabase Functions docs: https://supabase.com/docs/guides/functions

## Environment Variables

### .env.local (for reference, NOT used by Edge Function)
```bash
# These are for the Next.js app, not the Edge Function
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Supabase Secrets (for Edge Function)
```bash
# This is set via Supabase CLI, not in .env.local
RESEND_API_KEY=re_your_actual_key_here
```

### Vercel Environment Variables
Add `RESEND_API_KEY` to Vercel (for Edge Functions, not client-side):
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add: `RESEND_API_KEY`
3. Do NOT add `NEXT_PUBLIC_` prefix

## Cost

- **Free**: 3,000 emails/month via Resend
- **Expected usage**: ~50-200 emails total
- **No credit card needed** for free tier

## Security

✅ API key is server-side only (never exposed to client)
✅ Email recipient is hardcoded (cannot be spoofed)
✅ All data transmitted over HTTPS
✅ Resend is SOC 2 Type II certified

## Next Steps

1. ✅ Setup complete
2. 📧 Test with a signup form
3. 📊 Monitor in Resend dashboard
4. 🔄 Rotate email recipient if needed (edit Edge Function)

For detailed documentation, see:
- `supabase/functions/send-signup-notification/README.md`
- `EMAIL_NOTIFICATIONS_IMPLEMENTATION.md`
