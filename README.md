# Pike2ThePolls

A temporary web application for the Pike Township (Indiana, Marion County) Trustee's office to organize a driving campaign that provides residents with rides to polling places on election day.

## Client

**Trustee Annette Johnson**Pike Township, Marion County, Indiana

## Project Purpose

This application helps Pike Township residents sign up for transportation to polling places during election periods. Residents can:

-   Learn about the ride program
-   Complete a conversational form to request a ride
-   Find answers to common questions
-   (Admin) Manage and view ride requests

## Technology Stack

Component

Technology

Purpose

**Frontend**

React with TypeScript (Next.js)

Modern, fast web framework

**Backend**

Supabase (PostgreSQL)

Database, authentication, and Row-Level Security

**Styling**

Tailwind CSS

Utility-first CSS framework

**Hosting**

Vercel

Production deployment with HTTPS/SSL

**Forms**

React Hook Form + Zod

Type-safe form validation

## Application Pages

1.  **Welcome Page** (`/`) - Program overview and call-to-action
2.  **Sign Up Page** (`/signup`) - Conversational multi-step form (8 steps) for residents
3.  **FAQ Page** (`/faq`) - Frequently asked questions, privacy policy, and disclosures
4.  **Admin Page** (`/admin`) - Protected dashboard for managing ride requests
5.  **Volunteer Page** (`/volunteer`) - Volunteer information and opportunities
6.  **Volunteer Signup** (`/volunteer/signup`) - Volunteer signup form (5 steps)

## Prerequisites

Before running this project, ensure you have:

-   **Node.js** version 18.x or higher ([Download](https://nodejs.org/))
-   **npm** (comes with Node.js)
-   **Git** for version control
-   A Supabase account ([Sign up free](https://supabase.com/))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/pike2polls.gitcd pike2polls
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_urlNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To get these values:

1.  Go to [Supabase Dashboard](https://supabase.com/dashboard)
2.  Create a new project or select existing
3.  Navigate to Project Settings → API
4.  Copy the URL and anon/public key

### 4. Set Up Supabase Database

Run the database migration script (located in `supabase/migrations/`):

```bash
# Apply the database schemanpx supabase db push
```

Or manually create the `signups` table in the Supabase SQL editor:

```sql
CREATE TABLE signups (  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  created_at TIMESTAMPTZ DEFAULT NOW(),  first_name TEXT NOT NULL,  last_name TEXT NOT NULL,  is_pike_resident BOOLEAN NOT NULL,  is_registered_voter BOOLEAN NOT NULL,  voting_date TEXT NOT NULL,  preferred_time TEXT NOT NULL,  email TEXT NOT NULL,  phone TEXT NOT NULL,  address TEXT NOT NULL,  notes TEXT,  liability_waiver_agreed BOOLEAN NOT NULL,  disclaimer_agreed BOOLEAN NOT NULL,  status TEXT DEFAULT 'pending');-- Enable Row-Level SecurityALTER TABLE signups ENABLE ROW LEVEL SECURITY;-- Public can insert (for signups)CREATE POLICY "Allow public insert" ON signups  FOR INSERT WITH CHECK (true);-- Only authenticated admins can readCREATE POLICY "Allow admin read" ON signups  FOR SELECT USING (auth.role() = 'authenticated');-- Volunteers tableCREATE TABLE volunteers (  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  created_at TIMESTAMPTZ DEFAULT NOW(),  first_name TEXT NOT NULL,  last_name TEXT NOT NULL,  email TEXT NOT NULL,  phone TEXT NOT NULL,  is_driver BOOLEAN NOT NULL,  is_logistical_support BOOLEAN NOT NULL,  may_2 BOOLEAN NOT NULL,  may_3 BOOLEAN NOT NULL,  may_5 BOOLEAN NOT NULL,  all_days BOOLEAN NOT NULL,  time_slots TEXT[] NOT NULL,  notes TEXT,  status TEXT DEFAULT 'pending');-- Enable Row-Level SecurityALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
```

### 5. Create Admin User

1.  Go to Supabase Dashboard → Authentication
2.  Create a new user with email and password
3.  This user will access the admin dashboard

## Development Commands

```bash
# Start development server (http://localhost:3000)npm run dev# Build for productionnpm run build# Run production build locallynpm start# Run linternpm run lint# Type checkingnpm run type-check
```

## Project Structure

```
pike2polls/├── src/│   ├── app/              # Next.js app directory with pages│   │   ├── page.tsx      # Welcome page (/)│   │   ├── signup/       # Sign up form page (/signup)│   │   ├── faq/          # FAQ page (/faq)│   │   └── admin/        # Admin dashboard (/admin)│   ├── components/│   │   ├── form/         # Multi-step form components│   │   ├── admin/        # Admin dashboard components│   │   ├── ui/           # Reusable UI primitives│   │   └── layout/       # Header, Footer, Navigation│   ├── lib/│   │   ├── supabase.ts   # Supabase client configuration│   │   ├── validation.ts # Form validation schemas (Zod)│   │   └── utils.ts      # Helper functions│   └── types/            # TypeScript type definitions├── public/               # Static assets├── .env.local           # Environment variables (not committed)├── tailwind.config.ts   # Tailwind configuration├── next.config.ts       # Next.js configuration└── package.json         # Dependencies and scripts
```

## Conversational Form Flow

The signup form uses progressive disclosure with conditional branching:

1.  **Resident Check** - Confirms Pike Township residency
2.  **Name** - Collects first and last name
3.  **Voter Registration** - Verifies registered voter status
4.  **Voting Date** - Early voting (May 2-3, 2026) or election day (May 5, 2026) selection
5.  **Preferred Time** - Time slot selection (conditional: early voting 11 AM-6 PM, election day 8 AM-6 PM)
6.  **Contact Info** - Email, phone, pickup address (required), notes (optional)
7.  **Waiver Agreement** - Liability waiver and disclaimer (both required)
8.  **Confirmation** - Summary display, print functionality, and submission

Each step validates before proceeding. Clear messages guide ineligible users.

## Accessibility

This project is committed to **WCAG 2.1 AA compliance**:

-   Semantic HTML structure
-   Full keyboard navigation
-   Screen reader compatible
-   ARIA labels and live regions
-   Focus management
-   Color contrast meets 4.5:1 ratio
-   Touch targets minimum 44x44px

## Deployment

### Production Domain

**pike2thepolls.com** (HTTPS/SSL enabled)

### Deploy to Vercel

```bash
# Install Vercel CLInpm i -g vercel# Deploy to productionvercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments on push to `main`.

### Environment Variables on Vercel

Add these in Vercel Project Settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_urlNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Admin Dashboard

### Access

The admin dashboard is located at `/admin` and provides authorized staff with tools to manage ride requests.

**Note**: Admin access is restricted to users with email addresses ending in:

-   `@pike2thepolls.com`

### Features

-   **Login**: Secure authentication via Supabase Auth
-   **Statistics**: View total signups, pending requests, and confirmed rides
-   **Signup List**: Browse all ride requests with detailed information
-   **Filtering**: Filter by status (pending, confirmed, cancelled) and search by name/email
-   **Sorting**: Sort by date, name, or voting date
-   **Status Management**: Confirm, cancel, or delete ride requests
-   **Export**: Download all signups as CSV for backup or analysis

### Creating Admin Users

To create a new admin user:

1.  Log in to the Supabase project dashboard
2.  Navigate to **Authentication** → **Users**
3.  Click **Add user** → **Create new user**
4.  Enter the user's email (must use an authorized domain)
5.  Set a temporary password or send an email invite
6.  The user can then log in at `/admin/login`

### Documentation

For detailed admin documentation, including:

-   Step-by-step login instructions
-   Dashboard feature overview
-   Managing ride requests
-   Filtering, searching, and exporting data
-   Troubleshooting common issues
-   Security best practices

See: [Admin Guide](docs/ADMIN_GUIDE.md)

## Security

-   Row-Level Security (RLS) enabled on all Supabase tables
-   Admin routes protected by Supabase Auth
-   Environment variables never committed to git
-   Input validation on client and server
-   HTTPS enforced in production

## Contributing

1.  Create a feature branch from `main`
2.  Make your changes
3.  Ensure accessibility compliance (WCAG 2.1 AA)
4.  Run tests and linter
5.  Submit a pull request for review

## License

Copyright (c) 2026 Pike2ThePolls. All rights reserved.

## Support

For questions or issues related to this project, contact:

**Phone**: (317) 978-1131**Email**: support[@pike2thepolls.com](mailto:trustee@pike2thepolls.com)

---

**Built for the Pike Township community**