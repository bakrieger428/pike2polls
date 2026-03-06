# 🚨 Vercel Environment Variables Setup Guide

## Problem
Your app is throwing this error in production:
```
Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

This means **Vercel doesn't have your environment variables set**.

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Environment Variables

**Direct Link**:
```
https://vercel.com/bakrieger428s-projects/pike2polls/settings/environment-variables
```

**Or navigate manually**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **pike2polls** project
3. Go to **Settings** tab
4. Click **Environment Variables** in the sidebar

### Step 2: Add the Following Variables

Click **"Add New"** for each of these:

#### Variable 1: Supabase URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://vvzzorscnvoggeanfxtn.supabase.co`
- **Environments**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **"Save"**

#### Variable 2: Supabase Anon Key
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enpvcnNjbnZvZ2dlYW5meHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDI2MzgsImV4cCI6MjA4Nzc3ODYzOH0.O2VmLqDN860DxcXNqCsTUkoputpyv6WD6hExN466GuI`
- **Environments**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **"Save"**

#### Variable 3: Google Places API Key (Optional)
- **Name**: `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- **Value**: `AIzaSyCbEkJn7Me81zVD8ZZdBbDgjrs7pO4zgJ4`
- **Environments**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **"Save"**

### Step 3: Redeploy Your Application

After adding the environment variables:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment (should be at the top)
3. Click the **three dots (...)** menu
4. Click **"Redeploy"**
5. Wait for deployment to complete (~1-2 minutes)

### Step 4: Test the Fix

1. Go to: `https://pike2thepolls.com/signup`
2. Complete the entire form
3. Click **"Continue"** on the final step
4. ✅ Should submit successfully!

---

## 🔍 How to Verify Environment Variables Are Set

After deployment, open your browser console (F12) and you should see:
```
🔍 Supabase Environment Variables:
  - NEXT_PUBLIC_SUPABASE_URL: https://vvzzorscnvogg...
  - NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1Ni...
```

If you see "NOT SET" instead, the environment variables weren't added correctly.

---

## ❓ Troubleshooting

**Q: I added the variables but still get the error**
- A: Make sure you redeployed after adding the variables. Vercel needs to rebuild with the new environment variables.

**Q: Which environments should I select?**
- A: Select ALL THREE: Production, Preview, and Development. This ensures they work everywhere.

**Q: Do I need to restart anything?**
- A: No, just redeploy in Vercel. The environment variables are picked up automatically during build.

**Q: Can I copy-paste the values?**
- A: Yes! Copy the exact values shown above. Don't add quotes or spaces.
