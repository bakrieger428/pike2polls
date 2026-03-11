# Cloudflare Turnstile Setup Guide

This guide explains how to set up Cloudflare Turnstile for bot protection on the Pike2ThePolls signup forms.

## What is Turnstile?

Cloudflare Turnstile is a free CAPTCHA alternative that:
- **No cost**: Completely free, no usage limits
- **User-friendly**: Minimal friction for legitimate users
- **Bot protection**: Blocks automated spam and abuse
- **Privacy-focused**: Doesn't track users across sites

## Step-by-Step Setup

### 1. Create Cloudflare Account (if you don't have one)

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for a free account
3. Verify your email address

### 2. Create a Turnstile Site Key

1. In the Cloudflare Dashboard, navigate to:
   - **Turnstile** (left sidebar) → **Add new site**

2. Configure your site:
   - **Site name**: `Pike2ThePolls Signup` (or similar)
   - **Domain**: `pike2thepolls.com` (add `localhost` for development)
   - **Widget Mode**: Managed (recommended)
   - **Pre-clearance**: Off

3. Click **Create**

4. Copy your **Site Key** (looks like: `0x4AAAAAAAxxxxxxxxxxxxxx`)

### 3. Add Environment Variable

**Local Development** (`.env.local`):
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAxxxxxxxxxxxxxx
```

**Vercel Production**:
1. Go to Vercel Dashboard → Pike2ThePolls → Settings → Environment Variables
2. Add variable:
   - **Key**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Value**: `0x4AAAAAAAxxxxxxxxxxxxxx` (your site key)
   - **Environments**: Production, Preview, Development

### 4. Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/signup

3. You should see a Turnstile widget after selecting "Yes" to the resident check

4. Complete the widget and verify the "Continue" button becomes enabled

## Troubleshooting

### "Security Configuration Missing" Error

**Cause**: Turnstile site key not configured

**Solution**:
1. Check that `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is in `.env.local`
2. Restart the development server
3. Verify the key format (starts with `0x4AAA`)

### Turnstile Widget Not Appearing

**Possible Causes**:
1. Missing site key in environment variables
2. JavaScript error in browser console
3. Ad blocker blocking Turnstile

**Solutions**:
1. Check browser console (F12) for errors
2. Disable ad blockers for localhost
3. Clear browser cache and reload

### "Invalid Site Key" Error

**Cause**: Incorrect or corrupted site key

**Solution**:
1. Verify the key matches what's in Cloudflare Dashboard
2. Ensure no extra spaces or quotes
3. Try regenerating the key in Cloudflare Dashboard

## Security Considerations

### Why Turnstile?

- **Invisible to most users**: Uses behavioral analysis, not puzzles
- **No user tracking**: Doesn't follow users across websites
- **Accessibility compliant**: WCAG 2.1 AA compliant
- **Mobile-friendly**: Works great on touch devices

### Limitations

Turnstile provides **client-side** bot protection. For comprehensive security:

1. **Rate Limiting**: Also implemented (see `src/middleware.ts`)
2. **Input Validation**: Zod schemas validate all inputs
3. **SQL Injection**: Prevented by Supabase parameterized queries
4. **DDoS Protection**: Vercel provides basic mitigation

### What Turnstile Protects Against

✅ **Prevents**:
- Automated form spam
- Bot signup attacks
- Credential stuffing attempts
- Brute force attacks

❌ **Does NOT prevent**:
- Manual spam (human spammers)
- DDoS attacks (use rate limiting + Vercel)
- SQL injection (use parameterized queries)
- XSS attacks (use React + input validation)

## Additional Resources

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Turnstile Best Practices](https://developers.cloudflare.com/turnstile/get-started/best-practices/)
- [Turnstile FAQ](https://developers.cloudflare.com/turnstile/reference/faq/)

## Support

If you encounter issues:

1. Check browser console for errors (F12 → Console tab)
2. Verify environment variables are set correctly
3. Check Cloudflare Dashboard for site status
4. Review security logs in Cloudflare Dashboard

## Next Steps

After setting up Turnstile:

1. ✅ Test the signup flow end-to-end
2. ✅ Verify rate limiting is working (see `docs/SECURITY_AUDIT.md`)
3. ✅ Monitor Turnstile analytics in Cloudflare Dashboard
4. ✅ Adjust security settings based on traffic patterns
