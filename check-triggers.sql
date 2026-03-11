-- Check if database triggers exist
-- Run this in Supabase SQL Editor to verify setup

SELECT
    trigger_name,
    event_object_table,
    action_statement,
    action_timing
FROM
    information_schema.triggers
WHERE
    trigger_schema = 'public'
    AND trigger_name IN ('on_new_signup', 'on_new_volunteer')
ORDER BY
    event_object_table;

-- Check if pg_net extension is enabled
SELECT
    extname,
    extversion
FROM
    pg_extension
WHERE
    extname = 'pg_net';

-- Check if the notification functions exist
SELECT
    routine_name,
    routine_type
FROM
    information_schema.routines
WHERE
    routine_schema = 'public'
    AND routine_name IN ('notify_new_signup', 'notify_new_volunteer')
ORDER BY
    routine_name;

-- Sample manual trigger test (DO NOT RUN IN PRODUCTION)
-- This simulates what the trigger does
-- Uncomment to test if the Edge Function responds:

/*
SELECT net.http_post(
  url := 'https://vvzzorscnvoggeanfxtn.supabase.co/functions/v1/send-signup-notification',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2enpvcnNjbnZvZ2dlYW5meHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDI2MzgsImV4cCI6MjA4Nzc3ODYzOH0.O2VmLqDN860DxcXNqCsTUkoputpyv6WD6hExN466GuI'
  ),
  body := jsonb_build_object(
    'type', 'INSERT',
    'table', 'signups',
    'schema', 'public',
    'record', jsonb_build_object(
      'id', 'test-id-123',
      'first_name', 'Test',
      'last_name', 'User',
      'email', 'test@example.com',
      'created_at', NOW()
    ),
    'old_record', null
  )
) as response;
*/
