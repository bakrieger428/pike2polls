#!/bin/bash

# Email Notifications Setup Script
# This script helps set up the email notification system for rider and volunteer signups

set -e

echo "=================================="
echo "Pike2ThePolls Email Notifications Setup"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo ""
    echo "Please install Supabase CLI first:"
    echo "  macOS:   brew install supabase/tap/supabase"
    echo "  Windows: scoop install supabase"
    echo "  Linux:   curl https://get.supabase.com | sh"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI is installed"
echo ""

# Check if user is logged in to Supabase
echo "Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase"
    echo ""
    echo "Please login first:"
    echo "  supabase login"
    echo ""
    exit 1
fi

echo "✅ Authenticated with Supabase"
echo ""

# Get project info
echo "Fetching your Supabase projects..."
echo ""
supabase projects list
echo ""

# Ask for project ref
echo "Enter your Supabase project reference (the ID from your project URL):"
echo "Example: If URL is https://abcdefgh.supabase.co, enter: abcdefgh"
read -p "Project ref: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project ref is required"
    exit 1
fi

echo ""
echo "Linking to project: $PROJECT_REF"

# Link to project
supabase link --project-ref "$PROJECT_REF"

echo ""
echo "✅ Linked to Supabase project"
echo ""

# Check for RESEND_API_KEY
echo ""
echo "=================================="
echo "Resend API Key Setup"
echo "=================================="
echo ""
echo "You need a Resend API key to send emails."
echo ""
echo "1. Go to https://resend.com/api-keys"
echo "2. Click 'Create API Key'"
echo "3. Copy the API key (starts with 're_')"
echo ""
read -p "Enter your Resend API key: " RESEND_API_KEY

if [ -z "$RESEND_API_KEY" ]; then
    echo "❌ RESEND_API_KEY is required"
    exit 1
fi

# Set the secret in Supabase
echo ""
echo "Setting RESEND_API_KEY in Supabase..."
supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"

echo ""
echo "✅ Environment variable set in Supabase"
echo ""

# Deploy the Edge Function
echo ""
echo "=================================="
echo "Deploying Edge Function"
echo "=================================="
echo ""

if [ ! -d "supabase/functions/send-signup-notification" ]; then
    echo "❌ Edge function directory not found"
    echo "   Expected: supabase/functions/send-signup-notification"
    exit 1
fi

echo "Deploying send-signup-notification function..."
supabase functions deploy send-signup-notification

echo ""
echo "✅ Edge Function deployed"
echo ""

# Get Supabase URL and Anon Key for the migration
echo ""
echo "=================================="
echo "Database Trigger Setup"
echo "=================================="
echo ""

# Extract project info
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Could not find Supabase URL or Anon Key in .env.local"
    echo ""
    echo "Please update the SQL migration file manually:"
    echo "  File: supabase-migrations/add-email-notification-triggers.sql"
    echo ""
    echo "Replace:"
    echo "  YOUR_SUPABASE_PROJECT_ID with your project ID"
    echo "  YOUR_SUPABASE_ANON_KEY with your anon key"
    echo ""
    exit 1
fi

# Extract project ID from URL
PROJECT_ID=$(echo "$SUPABASE_URL" | sed 's/https:\/\/\([^.]*\).supabase.co/\1/')

echo "Your Supabase project ID: $PROJECT_ID"
echo ""

# Update the migration file
MIGRATION_FILE="supabase-migrations/add-email-notification-triggers.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Backup original migration
cp "$MIGRATION_FILE" "${MIGRATION_FILE}.backup"

# Replace placeholders
sed -i "s|YOUR_SUPABASE_PROJECT_ID|$PROJECT_ID|g" "$MIGRATION_FILE"
sed -i "s|YOUR_SUPABASE_ANON_KEY|$SUPABASE_ANON_KEY|g" "$MIGRATION_FILE"

echo "✅ Updated migration file with your Supabase credentials"
echo ""

# Ask if user wants to run the migration
echo ""
echo "The database triggers need to be set up to send emails."
echo ""
read -p "Do you want to run the migration now? (y/n): " RUN_MIGRATION

if [ "$RUN_MIGRATION" = "y" ] || [ "$RUN_MIGRATION" = "Y" ]; then
    echo ""
    echo "Running migration..."
    echo ""
    echo "Copy and paste this into your Supabase SQL Editor:"
    echo "https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    echo ""
    echo "---"
    cat "$MIGRATION_FILE"
    echo "---"
    echo ""
    echo "Or use Supabase CLI:"
    echo "  supabase db push"
    echo ""
else
    echo ""
    echo "Migration skipped. You can run it later:"
    echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    echo "  2. Copy contents of: $MIGRATION_FILE"
    echo "  3. Paste and run"
    echo ""
fi

# Final summary
echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "✅ Edge Function deployed"
echo "✅ Environment variables configured"
echo "✅ Migration file ready"
echo ""
echo "Next Steps:"
echo "  1. Complete the migration (if not done already)"
echo "  2. Test by submitting a signup form"
echo "  3. Check email at support@pike2thepolls.com"
echo ""
echo "For troubleshooting, see:"
echo "  supabase/functions/send-signup-notification/README.md"
echo ""
echo "Edge Function URL:"
echo "  https://$PROJECT_ID.supabase.co/functions/v1/send-signup-notification"
echo ""
