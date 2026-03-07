# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ IMPORTANT - Read Before Starting Work

**ALL AGENTS: Before starting ANY task, you MUST read these files in order:**

1. **MEMORY.md** - Current project progress, context, and phase status
2. **TEAM.md** - Agent team configuration and your role
3. **CLAUDE.md** (this file) - Project guidance and architecture
4. **Plan file**: `C:\Users\pkf428\.claude\plans\linear-sleeping-manatee.md` - Detailed implementation plan

**After completing ANY task, update MEMORY.md with:**
- What you completed
- Any decisions made
- Current status
- Next steps or blockers

## Project Overview

**Pike2ThePolls** is a temporary web application for the Pike Township (Indiana, Marion County) Trustee Annette Johnson. It helps organize a driving campaign to transport residents to polling places on election day.

**Deployment**: Temporary (< 1 year), low-traffic application**Domain**: pike2thepolls.com**Hosting**: Vercel with HTTPS/SSL

## Purpose

The application allows Pike Township residents to sign up for rides to polling places through a conversational, multi-step form. Admin users can view and manage ride requests through a protected dashboard.

## Technology Stack

-   **Frontend**: React with TypeScript (Next.js framework)
-   **Backend/Database**: Supabase (PostgreSQL + Auth + Row-Level Security)
-   **Styling**: Tailwind CSS
-   **Hosting**: Vercel
-   **Accessibility**: WCAG 2.1 AA compliance (strict enforcement)

## Development Commands

```bash
# Install dependenciesnpm install# Run development server (http://localhost:3000)npm run dev# Build for productionnpm run build# Run production build locallynpm start# Run linternpm run lint# Type checkingnpm run type-check
```

## Application Structure

### Pages (4 routes)

1.  **`/`** - Welcome page explaining the program
2.  **`/signup`** - Conversational multi-step form for residents
3.  **`/faq`** - FAQ, privacy policy, and disclosures
4.  **`/admin`** - Protected dashboard for managing signups

### Conversational Form Flow

The signup form uses progressive disclosure with conditional branching:

1.  **Resident Check**: Yes/No - If no, show eligibility message and exit
2.  **Name**: First + Last name validation - Both required
3.  **Voter Registration**: Yes/No - If no, show registration link and exit
4.  **Voting Date**: Early Voting (with date selection) or Election Day
5.  **Preferred Time**: Selection from 8 AM - 6 PM options
6.  **Contact Info**: Email, phone, pickup address (optional)
7.  **Confirmation**: Thank you message + submit to Supabase

Each step must validate before proceeding. Clear messages for ineligibility with helpful next steps.

### Database Schema (Supabase)

**`signups` table**:

-   `id`, `created_at`, `first_name`, `last_name`
-   `is_pike_resident` (boolean)
-   `is_registered_voter` (boolean)
-   `voting_date` (early-voting-date-1, early-voting-date-2, election-day)
-   `preferred_time` (8:00 AM - 6:00 PM)
-   `email`, `phone`, `address`, `notes` (optional)
-   `status` (pending, confirmed, cancelled)

**Authentication**: Supabase Auth with Row-Level Security (RLS) for admin users

## Key Architectural Patterns

### Component Organization

```
src/├── app/              # Next.js app directory with pages
│   ├── admin/         # Admin dashboard pages
│   │   ├── login/     # Admin login page
│   │   ├── layout.tsx # Admin layout with auth protection
│   │   └── page.tsx   # Admin dashboard page
│   ├── signup/        # Sign up form page
│   ├── faq/           # FAQ page
│   └── page.tsx       # Welcome page
├── components/
│   ├── form/          # Multi-step form components
│   ├── admin/         # Admin dashboard components
│   ├── ui/            # Reusable UI primitives
│   └── layout/        # Header, Footer, Navigation
├── hooks/
│   └── useAuth.ts     # Authentication hook for admin users
├── lib/
│   ├── supabase.ts    # Supabase client configuration
│   ├── validation.ts  # Form validation schemas (Zod)
│   └── utils.ts       # Helper functions
└── types/             # TypeScript type definitions
```

### Admin Component Architecture

The admin dashboard uses a protected route pattern with authentication:

**Authentication Hook** (`src/hooks/useAuth.ts`):
- Provides `useAuth()` hook with authentication state
- Manages user session via Supabase Auth
- Checks admin status based on email domain
- Exports: `signIn`, `signOut`, `clearError`, and auth state (`user`, `session`, `isAuthenticated`, `isAdmin`, `isLoading`, `error`)

**Protected Route Wrapper** (`src/components/admin/AdminProtected.tsx`):
- Wraps admin pages to enforce authentication
- Redirects to `/admin/login` if not authenticated
- Shows "Access Denied" if authenticated but not admin
- Usage: Wrap any protected admin content with `<AdminProtected>`

**Admin Login Page** (`src/app/admin/login/page.tsx`):
- Login form with email and password
- Error handling for common auth failures
- Redirects to dashboard on successful login
- Includes "Back to Home" link

**Admin Layout** (`src/app/admin/layout.tsx`):
- Wraps all admin pages with `<AdminProtected>`
- Ensures authentication before rendering admin content

**Admin Dashboard** (`src/app/admin/page.tsx`):
- Main dashboard page accessible at `/admin`
- Displays user email and sign out button
- Shows statistics and signup list
- Protected by admin layout

### Form State Management

-   Use React hooks (`useState`, `useReducer`) or Formik
-   Keep form state in parent component, pass to step components
-   Validate each step before allowing progression
-   Show progress indicator (e.g., "Step 2 of 5")
-   Allow back navigation to previous steps

### Accessibility Requirements

**Non-negotiable requirements**:

-   Semantic HTML (`<main>`, `<nav>`, `<section>`, etc.)
-   All form inputs have associated `<label>` or `aria-label`
-   Keyboard navigation works for all interactive elements
-   Focus visible indicator on all focusable elements
-   Skip navigation link at top of page
-   ARIA live regions for form errors and success messages
-   Color contrast minimum 4.5:1 for text, 3:1 for large text
-   Touch targets minimum 44x44px
-   Test with screen reader (NVDA/JAWS) and keyboard only

### Responsive Design

-   Mobile-first approach
-   Breakpoints: `< 640px` (mobile), `640px - 1024px` (tablet), `> 1024px` (desktop)
-   Form must be fully functional on mobile devices
-   Large, touch-friendly buttons and inputs

### Security

-   All admin routes protected by Supabase Auth
-   Environment variables in `.env.local` (never commit)
-   Row-Level Security enabled on all Supabase tables
-   Input validation on client and server side
-   HTTPS enforced in production (automatic via Vercel)

## Important Conventions

### Naming

-   Components: PascalCase (`MultiStepForm.tsx`)
-   Utilities: camelCase (`formatPhoneNumber.ts`)
-   Constants: UPPER_SNAKE_CASE (`EARLY_VOTING_DATES`)
-   CSS/Tailwind classes: Use kebab-case for custom classes

### Code Style

-   Use TypeScript strict mode
-   Prefer function components with hooks
-   Keep components under 200 lines - split if larger
-   Extract reusable logic to custom hooks
-   Use Zod for runtime validation schemas
-   Write descriptive prop interfaces

### Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

**Note**: Mapbox token is required for the rider dispatch feature (geocoding).

Never commit `.env.local` to git.

### Git Workflow

-   `main` branch is for production
-   Create feature branches from `main`
-   Use conventional commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
-   PRs required for merging to `main`

## Common Tasks

### Adding a Form Step

1.  Create component in `src/components/form/NewStep.tsx`
2.  Add validation schema to `src/lib/validation.ts`
3.  Register step in `MultiStepForm.tsx` step order
4.  Test keyboard navigation and screen reader accessibility
5.  Update progress indicator if step count changed

### Updating Admin Dashboard

1.  Modify query in `src/app/admin/page.tsx` or component
2.  Update `SignupCard.tsx` if displaying new fields
3.  Test RLS policies to ensure data security
4.  Verify responsive layout on mobile

### Adding Admin Users

**Admin User Email Requirements**:

Admin access is restricted to specific email domains:
- `@pike2thepolls.com`
- `@trustee.pike.in.gov`

**To create a new admin user**:

1.  Go to Supabase dashboard → Authentication → Users
2.  Click **Add user** → **Create new user**
3.  Enter the user's email (must use an authorized domain above)
4.  Set a temporary password or send an email invite
5.  The user can then log in at `/admin/login`
6.  On first login, the user should change their password

**Important**: The admin role check is performed by the `isAdminUser()` function in `useAuth.ts`. This checks the user's email domain against the authorized domains list. If you need to add new admin domains, update the `adminDomains` array in that function.

### Deployment

```bash
# Deploy to Vercel (connected to git)git push origin main# Vercel automatically deploys on push to main# Preview deployments available for PRs
```

## Critical Files

**Core Application:**
-   `src/lib/supabase.ts` - Supabase client, don't break auth
-   `src/app/signup/page.tsx` - Main form entry point
-   `src/lib/validation.ts` - All form validation logic
-   `.env.local` - Environment secrets (never commit)
-   `vercel.json` - Production deployment config
-   `src/components/form/MultiStepForm.tsx` - Form state machine

**Dispatch Feature:**
-   `src/lib/grouping.ts` - Persistent rider grouping algorithm
-   `src/lib/mapbox.ts` - Mapbox geocoding and distance calculations
-   `src/components/admin/DispatchTab.tsx` - Main dispatch interface
-   `src/components/admin/RiderGroupCard.tsx` - Group display with driver info
-   `supabase-migrations/add-dispatch-tables.sql` - Database schema

## Testing Checklist

Before committing changes:

-    Form flows complete successfully (all branches)
-    Admin authentication works
-    No console errors
-    Keyboard navigation works
-    Mobile responsive (test at 375px width)
-    Color contrast passes (use axe DevTools)
-    TypeScript builds without errors (`npm run build`)

## Accessibility Testing

Use these tools:

-   **axe DevTools** - Chrome extension for automated scanning
-   **WAVE** - WebAIM's accessibility evaluator
-   **Keyboard only** - Unplug mouse and test full flow
-   **Screen reader** - NVDA (Windows) or VoiceOver (Mac)

## Domain & Deployment

-   **Domain**: pike2thepolls.com (already purchased)
-   **DNS**: Configure in Vercel project settings
-   **SSL**: Automatic via Vercel
-   **Branch preview**: Auto-generated for PRs

## Project Status

**Current Phase**: ✅ **CORE FEATURES COMPLETE** - Production-ready

**Completed Features**:
- ✅ Welcome page and basic layout
- ✅ Conversational multi-step signup form
- ✅ FAQ page with privacy policy
- ✅ Admin authentication with domain-based access control
- ✅ Admin dashboard with full CRUD for signups and volunteers
- ✅ Volunteer driver information tracking
- ✅ **Rider Dispatch Feature** - Persistent grouping, driver assignment, route manifests

**Next Steps**:
- Add Mapbox token to Vercel environment variables
- Deploy to production
- Monitor Mapbox API usage (100K free requests/month)