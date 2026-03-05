# Supabase Setup Guide for Pike2ThePolls

This guide walks you through setting up Supabase for the Pike2ThePolls application. Supabase provides the PostgreSQL database, authentication, and Row-Level Security (RLS) for our application.

**Time Required**: ~15 minutes
**Cost**: Free tier is sufficient for this project (low traffic, temporary deployment)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Account](#create-supabase-account)
3. [Create Supabase Project](#create-supabase-project)
4. [Configure Database Schema](#configure-database-schema)
5. [Get Your Credentials](#get-your-credentials)
6. [Update Environment Variables](#update-environment-variables)
7. [Set Up Admin Authentication](#set-up-admin-authentication)
8. [Test the Connection](#test-the-connection)
9. [Security Verification](#security-verification)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ A GitHub account (for Supabase OAuth)
- ✅ Access to this project's repository
- ✅ About 15 minutes of focused time
- ✅ A modern web browser (Chrome, Firefox, Edge, Safari)

---

## Create Supabase Account

### Step 1: Navigate to Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click the **"Start your project"** button in the top right

### Step 2: Sign Up

You can sign up using:

**Option A: GitHub (Recommended)**
- Click **"Continue with GitHub"**
- Authorize Supabase to access your GitHub account
- This is the easiest method and recommended for this project

**Option B: Email**
- Enter your email address
- Create a password
- Verify your email by clicking the link sent to your inbox

### Step 3: Complete Your Profile

1. Enter your name
2. Select your organization type (choose "Personal" or "Startup")
3. Click **"Get Started"**

---

## Create Supabase Project

### Step 1: Create New Project

After logging in, you'll be on the dashboard:

1. Click **"New Project"** button
2. You may be asked to create an organization first:
   - Enter **"Pike Township"** as the organization name
   - Click **"Create organization"**

### Step 2: Configure Project Settings

Fill in the project form:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `pike2polls` | Use lowercase, no spaces |
| **Database Password** | Generate strong password | **Save this securely!** You'll need it later |
| **Region** | `Southeast (US)` | Choose closest to Indiana |
| **Pricing Plan** | `Free` | Sufficient for this project |

### Step 3: Create the Project

1. Click **"Create new project"**
2. Wait for project to be provisioned (~2-3 minutes)
3. You'll see a progress bar - **do not close the tab**
4. When complete, you'll be redirected to the project dashboard

---

## Configure Database Schema

### Step 1: Open SQL Editor

1. In the left sidebar, click **"SQL Editor"** (icon looks like a terminal)
2. Click **"New query"** button

### Step 2: Paste the Schema

1. Open the file: `docs/supabase-schema.sql` from your project
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Review the SQL briefly to understand what will be created:
   - ✅ `signups` table
   - ✅ Indexes for performance
   - ✅ Row Level Security (RLS) policies
   - ✅ Triggers and functions

### Step 3: Run the Schema

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for execution to complete (~5 seconds)
3. You should see **"Success. No rows returned"** message
4. Click **"Save"** to save this query for future reference (name it "pike2polls-schema")

### Step 4: Verify Table Creation

1. In the left sidebar, click **"Table Editor"** (icon looks like a grid)
2. You should see the `signups` table listed
3. Click on `signups` to view its structure
4. Verify all columns are present:
   - id
   - created_at
   - first_name
   - last_name
   - is_pike_resident
   - is_registered_voter
   - voting_date
   - preferred_time
   - email
   - phone
   - address
   - notes
   - status

---

## Get Your Credentials

### Step 1: Navigate to API Settings

1. In the left sidebar, click the **gear icon** (Settings)
2. Click **"API"** in the submenu

### Step 2: Copy Your Credentials

You'll see two important values:

**1. Project URL**
```
https://YOUR-PROJECT-ID.supabase.co
```
- Click the **copy icon** next to "Project URL"
- Paste somewhere safe for now

**2. anon public** key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Click the **copy icon** next to "anon public"
- Paste somewhere safe for now

⚠️ **IMPORTANT SECURITY NOTES**:
- ✅ **`anon` key** is safe to use in client-side code (has RLS protection)
- ❌ **NEVER** use the `service_role` key in client-side code (it bypasses RLS)
- ❌ **NEVER** commit these keys to git
- ❌ **NEVER** share these keys publicly

---

## Update Environment Variables

### Step 1: Locate .env.local

The `.env.local` file should already exist in your project root with placeholder values:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Replace Placeholders

Open `.env.local` in your text editor and replace the placeholder values:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Verify Changes

1. Save the file
2. Verify the file is in `.gitignore` (it should be - already configured)
3. **DO NOT** commit `.env.local` to git

---

## Set Up Admin Authentication

For the admin dashboard to work, you need to create admin users in Supabase Auth.

### Step 1: Open Authentication Settings

1. In the left sidebar, click **"Authentication"** (icon looks like a shield)
2. Click **"Providers"** in the submenu

### Step 2: Enable Email Provider

1. Find **"Email"** provider
2. Click to expand
3. Ensure **"Enable Email provider"** is toggled ON
4. Click **"Save"**

### Step 3: Create First Admin User

**Option A: Via Supabase Dashboard (Easiest)**

1. In the left sidebar under Authentication, click **"Users"**
2. Click **"Add user"** button
3. Fill in the form:
   - **Email**: `admin@pike2thepolls.com` (or your preferred admin email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: Toggle ON (skip email verification for now)
4. Click **"Create user"**

**Option B: Via Signup Form (After Deployment)**

1. Deploy your application to Vercel
2. Navigate to the signup page
3. Create an account with your admin email
4. Go to Supabase Dashboard → Authentication → Users
5. Click on the user
6. Toggle **"User is admin role"** to ON (if using custom claims)
7. Or note the user ID to add to an admin_users table later

### Step 4: Test Admin Login (Optional)

After deployment, you can test admin access:

1. Navigate to `/admin` on your site
2. Enter admin email and password
3. If authentication is working, you'll see the admin dashboard

---

## Test the Connection

### Step 1: Start Development Server

Open your terminal and run:

```bash
npm run dev
```

The server should start on `http://localhost:3000`

### Step 2: Test Supabase Connection

Let's create a simple test to verify the connection:

1. Create a test file `scripts/test-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Test 1: Query the signups table
    const { data, error } = await supabase
      .from('signups')
      .select('count');

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log('✅ RLS policies are working');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

testConnection();
```

2. Run the test:

```bash
npx tsx scripts/test-supabase.ts
```

3. You should see: `✅ Connection successful!`

---

## Security Verification

### Step 1: Verify Row Level Security (RLS)

RLS is **CRITICAL** for security. Verify it's enabled:

1. Go to **Table Editor** → `signups` table
2. Click **"RLS"** in the top right
3. Ensure **"Enable RLS"** is toggled ON
4. Verify these policies exist:
   - ✅ `Public users can create signups` (INSERT for anon)
   - ✅ `Admin users can view all signups` (SELECT for authenticated)
   - ✅ `Admin users can update signups` (UPDATE for authenticated)
   - ✅ `Admin users can delete signups` (DELETE for authenticated)

### Step 2: Verify Environment Variables

1. Check that `.env.local` is in `.gitignore`
2. Run: `git status` and ensure `.env.local` is NOT listed
3. Verify `NEXT_PUBLIC_` prefix is used (safe for client-side)

### Step 3: Check API Restrictions

1. Go to **Settings** → **API**
2. Scroll to **"API Settings"**
3. Review these settings:
   - ✅ **JWT Expiry Limit**: Reasonable (e.g., 3600s)
   - ✅ **Password Requirements**: Minimum length enabled
   - ✅ **Site URL**: Should be `http://localhost:3000` (dev) or `https://pike2thepolls.com` (prod)

---

## Troubleshooting

### Issue: "Invalid API key" error

**Solution**:
1. Check that you copied the correct `anon` key (not `service_role`)
2. Verify there are no extra spaces in `.env.local`
3. Restart the dev server after changing `.env.local`

### Issue: RLS policies not working

**Solution**:
1. Go to Table Editor → signups → RLS
2. Ensure "Enable RLS" is toggled ON
3. Check that policies have "Using" and "With Check" expressions
4. Try dropping and recreating policies

### Issue: Can't create admin user

**Solution**:
1. Ensure Email provider is enabled in Authentication → Providers
2. Check "Enable Email provider" is toggled ON
3. Try using "Auto Confirm User" to skip email verification for testing

### Issue: SQL schema fails to run

**Solution**:
1. Check for syntax errors in the SQL
2. Ensure you selected the correct database (usually `public`)
3. Try running each section separately to isolate the error
4. Check Supabase logs in Dashboard → Logs

### Issue: Connection times out

**Solution**:
1. Check your internet connection
2. Verify you're using the correct region (Southeast US for Indiana)
3. Try accessing Supabase dashboard in an incognito window
4. Check Supabase status page: https://status.supabase.com

---

## What's Next?

Your Supabase database is now set up! Here's what you can do:

### Immediate Next Steps

1. ✅ **Deploy to Vercel**: Follow the `DEPLOYMENT.md` guide
2. ✅ **Test the Signup Form**: Submit a test signup
3. ✅ **Verify Admin Dashboard**: Login and view signups

### Optional Enhancements

1. **Add Realtime Subscriptions**: Get live updates when new signups come in
2. **Set up Database Functions**: Add more complex server-side logic
3. **Configure Storage**: Allow file uploads (e.g., resident ID verification)
4. **Enable Edge Functions**: Add server-side functions for complex operations

### Maintenance

1. **Regular Backups**: Supabase automatic backups are enabled on free tier
2. **Monitor Usage**: Check dashboard for storage and API usage
3. **Update RLS Policies**: Adjust as your security requirements evolve

---

## Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Next.js Integration**: https://supabase.com/docs/guides/with-nextjs

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Search Supabase GitHub Issues
3. Ask in Supabase Discord: https://supabase.com/discord
4. Review project MEMORY.md for current setup status

---

**Setup Complete!** 🎉

Your Supabase database is ready for the Pike2ThePolls application. The database schema, RLS policies, and admin authentication are all configured.

**Next**: Follow `DEPLOYMENT.md` to deploy your application to Vercel.
