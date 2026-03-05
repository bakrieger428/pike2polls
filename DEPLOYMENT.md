# Vercel Deployment Guide - Pike2ThePolls

## Prerequisites

Before deploying to Vercel, ensure the following are complete:

1. **GitHub Repository**: Project must be pushed to a GitHub repository
2. **Next.js Project**: Project must be initialized with Next.js
3. **Supabase Credentials**: Must have Supabase URL and anon key ready

## Step 1: Set Up GitHub Repository

The project needs to be on GitHub for Vercel to connect.

### Option A: Create New GitHub Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Pike2ThePolls project setup"

# Create repository on GitHub first, then add remote
gh repo create pike2polls --public --source=. --remote=origin --push

# OR manually if gh CLI is not available:
# 1. Go to https://github.com/new
# 2. Create repository named "pike2polls"
# 3. Run: git remote add origin https://github.com/YOUR_USERNAME/pike2polls.git
# 4. Run: git push -u origin main
```

### Option B: Connect Existing Repository

If a repository already exists, add it as a remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pike2polls.git
git push -u origin main
```

## Step 2: Create Vercel Project

### Option A: Using Vercel Dashboard (Recommended for First Setup)

1. **Sign Up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub account (recommended)

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import the `pike2polls` repository from GitHub
   - Vercel will auto-detect Next.js

3. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root of repository)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these in the project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a Vercel URL like: `https://pike2polls.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Your account
# - Link to existing project? N (create new)
# - Project name: pike2polls
# - In which directory is your code located? ./
# - Override settings? N (use detected Next.js settings)
```

## Step 3: Configure Custom Domain

### Add Domain: pike2thepolls.com

1. **In Vercel Dashboard**
   - Go to Project → Settings → Domains
   - Click "Add Domain"
   - Enter: `pike2thepolls.com`
   - Click "Add"

2. **DNS Configuration**

   Vercel will provide DNS records to add. Choose your setup:

   **Option A: Using Vercel as DNS Host (Recommended)**
   - Vercel will provide nameservers
   - Update nameservers at your domain registrar
   - Nameservers will look like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

   **Option B: Using Existing DNS Provider**
   - Add A record:
     - Type: A
     - Name: `@`
     - Value: `76.76.21.21` (Vercel's IP)
   - Add CNAME record (for www):
     - Type: CNAME
     - Name: `www`
     - Value: `cname.vercel-dns.com`

3. **Wait for DNS Propagation**
   - Can take 24-48 hours (usually < 1 hour)
   - Vercel will show status: "Valid Configuration" when ready
   - SSL certificate is automatically provisioned by Vercel

### Redirect www to non-www (Optional but Recommended)

Add `www.pike2thepolls.com` as a domain and set it to redirect to `pike2thepolls.com`:
- In Vercel Dashboard → Domains
- Add `www.pike2thepolls.com`
- Toggle "Redirect to pike2thepolls.com"

## Step 4: Configure Environment Variables

### In Vercel Dashboard

1. Go to Project → Settings → Environment Variables
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

### Using Vercel CLI

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# For preview deployments
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

## Step 5: Configure Branch Preview Deployments

Vercel automatically creates preview deployments for pull requests. To ensure they work properly:

1. **Ensure Git Integration is Active**
   - In Vercel Dashboard → Project → Git
   - Confirm repository is connected

2. **Preview Deployment Settings**
   - Framework detection: Automatic
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Environment Variables for Previews**
   - Use the same variables as production
   - OR use a separate Supabase project for testing

## Step 6: Set Up Production Deployment Pipeline

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to non-main branches (PRs)

### Deployment Protection

Enable deployment protection in Vercel Dashboard:
- Project → Settings → Git
- Enable "Protected Branches"
- Require checks for `main` branch

### Custom Build Settings (if needed)

The `vercel.json` file in the project root contains:
- Build command
- Output directory
- Security headers
- Environment variable references

## Step 7: Monitoring and Error Tracking

### Vercel Analytics

Enable in Dashboard:
- Project → Analytics
- Click "Enable Analytics"

### Vercel Log Drains

For external monitoring:
1. Project → Settings → Log Drains
2. Connect to:
   - Datadog
   - Loggly
   - Papertrail
   - Or any webhook URL

### Custom Error Tracking

Consider integrating:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **Posthog**: For analytics

## Step 8: Deploy to Production

### First Time Deployment

```bash
# Ensure you're on main branch
git checkout main

# Push to GitHub
git push origin main

# Vercel will automatically deploy
# Check deployment status at: https://vercel.com/dashboard
```

### Manual Deployment with Vercel CLI

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Verification Checklist

After deployment, verify:

- [ ] Site loads at `https://pike2thepolls.com`
- [ ] HTTPS is working (padlock icon in browser)
- [ ] All pages load (/, /signup, /faq, /admin)
- [ ] Environment variables are set correctly
- [ ] Form submission works (connects to Supabase)
- [ ] Admin authentication works
- [ ] Redirect www to non-www (if configured)
- [ ] Preview deployments work for PRs
- [ ] No console errors in browser
- [ ] Mobile responsive
- [ ] Accessibility compliance (WCAG 2.1 AA)

## Troubleshooting

### Build Failures

Check build logs in Vercel Dashboard:
- Project → Deployments → Click on failed deployment → Build Logs

Common issues:
- Missing dependencies → Run `npm install` locally first
- Type errors → Run `npm run build` locally
- Environment variables → Check they're set correctly

### DNS Issues

- Use `dig pike2thepolls.com` to check DNS
- Wait 24-48 hours for propagation
- Check nameservers are set correctly at registrar

### Environment Variable Issues

- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Redeploy after changing variables
- Check variable names match exactly (case-sensitive)

### SSL Certificate Issues

- Vercel automatically provisions SSL certificates
- If not working, check DNS configuration
- Certificate can take up to 24 hours to provision

## Deployment Status

**Current Status**: Not deployed yet
**Vercel Project URL**: TBD
**Custom Domain**: pike2thepolls.com
**SSL Certificate**: Pending (auto-provisioned by Vercel)
**Production URL**: https://pike2thepolls.com (pending)

## Next Steps

1. Create GitHub repository
2. Initialize Next.js project (Task #7 - Frontend Dev)
3. Get Supabase credentials (Task #9 - Database Engineer)
4. Create Vercel project and connect to GitHub
5. Configure environment variables in Vercel
6. Add custom domain and configure DNS
7. Deploy to production

## Notes

- Vercel free tier includes:
  - Unlimited deployments
  - Automatic HTTPS
  - Preview deployments
  - 100GB bandwidth/month
  - 6,000 minutes of execution time/month

- For this temporary project (< 1 year), Vercel's free tier should be sufficient

- Domain pike2thepolls.com is already purchased, just needs DNS configuration
