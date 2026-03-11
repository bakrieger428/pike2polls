-- Email Notification Triggers for Rider and Volunteer Signups
-- This migration sets up database webhooks to trigger the Supabase Edge Function
-- that sends email notifications via Resend API when new signups are created.

-- Enable the pg_net extension if not already enabled
-- This allows Supabase to make HTTP requests to Edge Functions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to trigger Edge Function for new signups
CREATE OR REPLACE FUNCTION notify_new_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to Supabase Edge Function
  -- This will be triggered on INSERT to the signups table
  PERFORM net.http_post(
    url := 'https://vvzzorscnvoggeanfxtn.supabase.co/functions/v1/send-signup-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enpvcnNjbnZvZ2dlYW5meHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDI2MzgsImV4cCI6MjA4Nzc3ODYzOH0.O2VmLqDN860DxcXNqCsTUkoputpyv6WD6hExN466GuI'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'signups',
      'schema', 'public',
      'record', to_jsonb(NEW),
      'old_record', null
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger Edge Function for new volunteers
CREATE OR REPLACE FUNCTION notify_new_volunteer()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to Supabase Edge Function
  -- This will be triggered on INSERT to the volunteers table
  PERFORM net.http_post(
    url := 'https://vvzzorscnvoggeanfxtn.supabase.co/functions/v1/send-signup-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enpvcnNjbnZvZ2dlYW5meHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDI2MzgsImV4cCI6MjA4Nzc3ODYzOH0.O2VmLqDN860DxcXNqCsTUkoputpyv6WD6hExN466GuI'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'volunteers',
      'schema', 'public',
      'record', to_jsonb(NEW),
      'old_record', null
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_new_signup ON signups;
DROP TRIGGER IF EXISTS on_new_volunteer ON volunteers;

-- Create triggers for signups table
CREATE TRIGGER on_new_signup
  AFTER INSERT ON signups
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_signup();

-- Create triggers for volunteers table
CREATE TRIGGER on_new_volunteer
  AFTER INSERT ON volunteers
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_volunteer();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT EXECUTE ON FUNCTION notify_new_signup() TO postgres;
GRANT EXECUTE ON FUNCTION notify_new_volunteer() TO postgres;

-- Add comments for documentation
COMMENT ON FUNCTION notify_new_signup() IS 'Triggers Edge Function to send email notification for new rider signups';
COMMENT ON FUNCTION notify_new_volunteer() IS 'Triggers Edge Function to send email notification for new volunteer signups';

-- Note: Configuration complete for project:
--   Project ID: vvzzorscnvoggeanfxtn
--   Edge Function URL: https://vvzzorscnvoggeanfxtn.supabase.co/functions/v1/send-signup-notification
--   This migration is ready to run in Supabase SQL Editor
