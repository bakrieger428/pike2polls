# Email Notification Testing Guide

## Quick Test (2 Minutes)

### 1. Test Rider Signup Email
1. Open: http://localhost:3000/signup
2. Fill out the form with test data:
   - Name: Test Rider
   - Email: your-personal-email@example.com
   - Phone: (317) 555-0123
   - Address: 123 Main St, Indianapolis, IN 46220
   - Complete all steps
3. Submit the form
4. Check email at: **support@pike2thepolls.com**

### 2. Test Volunteer Signup Email
1. Open: http://localhost:3000/volunteer/signup
2. Fill out the form:
   - Name: Test Volunteer
   - Email: your-personal-email@example.com
   - Phone: (317) 555-0456
   - Select "Driver" and/or "Logistical Support"
   - Complete all steps
3. Submit the form
4. Check email at: **support@pike2thepolls.com**

## What to Expect

### Rider Signup Email Contains:
- ✅ Name and contact information
- ✅ Eligibility answers (resident, registered voter)
- ✅ Voting preferences (date, time)
- ✅ Pickup location
- ✅ Timestamp

### Volunteer Signup Email Contains:
- ✅ Name and contact information
- ✅ Roles selected (driver, logistical support)
- ✅ Availability (days/time slots)
- ✅ Driver details (if applicable)
- ✅ Timestamp

## Troubleshooting

### No Email Received?

**Check 1: Edge Function Logs**
1. Go to: https://supabase.com/dashboard/project/vvzzorscnvoggeanfxtn/functions/send-signup-notification/logs
2. Look for recent invocations
3. Check for error messages

**Check 2: Resend Dashboard**
1. Go to: https://resend.com/dashboard/logs
2. Look for email sends
3. Check status (delivered, bounced, etc.)

**Check 3: Database Triggers**
1. Go to: https://supabase.com/dashboard/project/vvzzorscnvoggeanfxtn/database/triggers
2. Verify triggers exist: `on_new_signup` and `on_new_volunteer`

**Check 4: Environment Variable**
1. Go to: https://supabase.com/dashboard/project/vvzzorscnvoggeanfxtn/settings/secrets
2. Verify `RESEND_API_KEY` is set

### Common Issues

**Issue**: "Extension pg_net is not available"
- **Solution**: The migration didn't run. Re-run the migration SQL.

**Issue**: "Function notify_new_signup() does not exist"
- **Solution**: The migration didn't run completely. Re-run the migration SQL.

**Issue**: Email sends but goes to spam
- **Solution**: Add `noreply@pike2thepolls.com` to your email contacts/allowlist

**Issue**: Edge Function timeout
- **Solution**: Check Resend API key is valid and has sufficient quota

## Verify Everything is Working

### Quick Checklist
- [ ] Migration ran successfully in Supabase Dashboard
- [ ] Edge Function deployed (you completed this)
- [ ] RESEND_API_KEY set in Supabase secrets (you completed this)
- [ ] Test signup form works
- [ ] Email received at support@pike2thepolls.com
- [ ] Email contains all form data
- [ ] Email formatting looks correct

## Success!

If emails are arriving correctly, the system is fully operational! 🎉

**Next Steps:**
- Deploy to production (push to Vercel)
- Test with real signups
- Monitor email logs at resend.com/dashboard

## Need Help?

If you encounter issues, check:
- `supabase/functions/send-signup-notification/README.md` - Full troubleshooting guide
- `QUICK_START_EMAIL_NOTIFICATIONS.md` - Setup documentation
- `EMAIL_NOTIFICATIONS_IMPLEMENTATION.md` - Technical details
