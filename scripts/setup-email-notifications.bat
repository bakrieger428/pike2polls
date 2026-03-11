@echo off
REM Email Notifications Setup Script for Windows
REM This script helps set up the email notification system for rider and volunteer signups

setlocal enabledelayedexpansion

echo ==================================
echo Pike2ThePolls Email Notifications Setup
echo ==================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo X Supabase CLI is not installed
    echo.
    echo Please install Supabase CLI first:
    echo   Windows: scoop install supabase
    echo   Or download from: https://supabase.com/docs/guides/cli
    echo.
    pause
    exit /b 1
)

echo OK Supabase CLI is installed
echo.

REM Check if user is logged in to Supabase
echo Checking Supabase authentication...
supabase projects list >nul 2>&1
if %errorlevel% neq 0 (
    echo X Not logged in to Supabase
    echo.
    echo Please login first:
    echo   supabase login
    echo.
    pause
    exit /b 1
)

echo OK Authenticated with Supabase
echo.

REM Get project info
echo Fetching your Supabase projects...
echo.
supabase projects list
echo.

REM Ask for project ref
echo Enter your Supabase project reference (the ID from your project URL):
echo Example: If URL is https://abcdefgh.supabase.co, enter: abcdefgh
set /p PROJECT_REF="Project ref: "

if "!PROJECT_REF!"=="" (
    echo X Project ref is required
    pause
    exit /b 1
)

echo.
echo Linking to project: !PROJECT_REF!

REM Link to project
supabase link --project-ref !PROJECT_REF!

echo.
echo OK Linked to Supabase project
echo.

REM Check for RESEND_API_KEY
echo.
echo ==================================
echo Resend API Key Setup
echo ==================================
echo.
echo You need a Resend API key to send emails.
echo.
echo 1. Go to https://resend.com/api-keys
echo 2. Click 'Create API Key'
echo 3. Copy the API key (starts with 're_')
echo.
set /p RESEND_API_KEY="Enter your Resend API key: "

if "!RESEND_API_KEY!"=="" (
    echo X RESEND_API_KEY is required
    pause
    exit /b 1
)

REM Set the secret in Supabase
echo.
echo Setting RESEND_API_KEY in Supabase...
supabase secrets set RESEND_API_KEY=!RESEND_API_KEY!

echo.
echo OK Environment variable set in Supabase
echo.

REM Deploy the Edge Function
echo.
echo ==================================
echo Deploying Edge Function
echo ==================================
echo.

if not exist "supabase\functions\send-signup-notification" (
    echo X Edge function directory not found
    echo    Expected: supabase\functions\send-signup-notification
    pause
    exit /b 1
)

echo Deploying send-signup-notification function...
supabase functions deploy send-signup-notification

echo.
echo OK Edge Function deployed
echo.

REM Get Supabase URL and Anon Key for the migration
echo.
echo ==================================
echo Database Trigger Setup
echo ==================================
echo.

REM Extract project info from .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="NEXT_PUBLIC_SUPABASE_URL" set SUPABASE_URL=%%b
    if "%%a"=="NEXT_PUBLIC_SUPABASE_ANON_KEY" set SUPABASE_ANON_KEY=%%b
)

if "!SUPABASE_URL!"=="" if "!SUPABASE_ANON_KEY!"=="" (
    echo X Could not find Supabase URL or Anon Key in .env.local
    echo.
    echo Please update the SQL migration file manually:
    echo   File: supabase-migrations\add-email-notification-triggers.sql
    echo.
    echo Replace:
    echo   YOUR_SUPABASE_PROJECT_ID with your project ID
    echo   YOUR_SUPABASE_ANON_KEY with your anon key
    echo.
    pause
    exit /b 1
)

REM Extract project ID from URL
for /f "tokens=2 delims=/" %%a in ("!SUPABASE_URL!") do set PROJECT_ID=%%a
for /f "tokens=1 delims=." %%a in ("!PROJECT_ID!") do set PROJECT_ID=%%a

echo Your Supabase project ID: !PROJECT_ID!
echo.

REM Update the migration file
set MIGRATION_FILE=supabase-migrations\add-email-notification-triggers.sql

if not exist "!MIGRATION_FILE!" (
    echo X Migration file not found: !MIGRATION_FILE!
    pause
    exit /b 1
)

REM Backup original migration
copy "!MIGRATION_FILE!" "!MIGRATION_FILE!.backup" >nul

REM Replace placeholders (using PowerShell for better regex support)
powershell -Command "(gc '!MIGRATION_FILE!') -replace 'YOUR_SUPABASE_PROJECT_ID', '!PROJECT_ID!' -replace 'YOUR_SUPABASE_ANON_KEY', '!SUPABASE_ANON_KEY!' | Out-File -encoding ASCII '!MIGRATION_FILE!'"

echo OK Updated migration file with your Supabase credentials
echo.

REM Ask if user wants to run the migration
echo.
echo The database triggers need to be set up to send emails.
echo.
set /p RUN_MIGRATION="Do you want to view the migration SQL now? (y/n): "

if /i "!RUN_MIGRATION!"=="y" (
    echo.
    echo Migration SQL:
    echo ---
    type "!MIGRATION_FILE!"
    echo ---
    echo.
    echo Copy this into your Supabase SQL Editor:
    echo https://supabase.com/dashboard/project/!PROJECT_ID!/sql/new
    echo.
    echo Or use Supabase CLI:
    echo   supabase db push
    echo.
) else (
    echo.
    echo Migration skipped. You can run it later:
    echo   1. Go to: https://supabase.com/dashboard/project/!PROJECT_ID!/sql/new
    echo   2. Copy contents of: !MIGRATION_FILE!
    echo   3. Paste and run
    echo.
)

REM Final summary
echo.
echo ==================================
echo Setup Complete!
echo ==================================
echo.
echo OK Edge Function deployed
echo OK Environment variables configured
echo OK Migration file ready
echo.
echo Next Steps:
echo   1. Complete the migration (if not done already)
echo   2. Test by submitting a signup form
echo   3. Check email at support@pike2thepolls.com
echo.
echo For troubleshooting, see:
echo   supabase\functions\send-signup-notification\README.md
echo.
echo Edge Function URL:
echo   https://!PROJECT_ID!.supabase.co/functions/v1/send-signup-notification
echo.

pause
