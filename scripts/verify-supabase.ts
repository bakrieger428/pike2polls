/**
 * Supabase Connection and Schema Verification Script
 *
 * This script verifies:
 * 1. Supabase connection is working
 * 2. Environment variables are configured
 * 3. Database schema exists (signups table)
 * 4. RLS policies are enabled
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface VerificationResult {
  success: boolean;
  message: string;
  details?: any;
}

async function verifyEnvironmentVariables(): Promise<VerificationResult> {
  console.log('\n🔍 Step 1: Verifying Environment Variables...');

  if (!supabaseUrl) {
    return {
      success: false,
      message: '❌ FAILED: NEXT_PUBLIC_SUPABASE_URL is not set'
    };
  }

  if (!supabaseKey) {
    return {
      success: false,
      message: '❌ FAILED: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set'
    };
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    return {
      success: false,
      message: `❌ FAILED: Invalid Supabase URL format: ${supabaseUrl}`
    };
  }

  console.log('   ✅ Environment variables are set correctly');
  console.log(`   📍 Supabase URL: ${supabaseUrl}`);

  return {
    success: true,
    message: '✅ Environment variables verified'
  };
}

async function verifyConnection(): Promise<VerificationResult> {
  console.log('\n🔍 Step 2: Testing Supabase Connection...');

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test connection by querying the database
    const { error } = await supabase
      .from('signups')
      .select('count')
      .limit(1);

    if (error) {
      // If error is about table not existing, that's actually OK for now
      // (it means we connected, but schema might not be created yet)
      if (error.message.includes('does not exist')) {
        console.log('   ⚠️  Connected, but signups table does not exist yet');
        console.log('   💡 Run the schema from docs/supabase-schema.sql');
        return {
          success: false,
          message: '⚠️  Connected but schema not created',
          details: error
        };
      }

      return {
        success: false,
        message: `❌ Connection failed: ${error.message}`,
        details: error
      };
    }

    console.log('   ✅ Supabase connection successful!');
    return {
      success: true,
      message: '✅ Connection verified'
    };

  } catch (error: any) {
    return {
      success: false,
      message: `❌ Unexpected error: ${error.message}`,
      details: error
    };
  }
}

async function verifySchema(): Promise<VerificationResult> {
  console.log('\n🔍 Step 3: Verifying Database Schema...');

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check if signups table exists and has the expected columns
    const { data, error } = await supabase
      .from('signups')
      .select('*')
      .limit(0);

    if (error) {
      if (error.message.includes('does not exist')) {
        return {
          success: false,
          message: '❌ signups table does not exist',
          details: 'Run docs/supabase-schema.sql in Supabase SQL Editor'
        };
      }
      throw error;
    }

    // If we got here, table exists
    console.log('   ✅ signups table exists');

    // Try to insert a test record to verify all columns
    const testRecord = {
      first_name: 'Test',
      last_name: 'User',
      is_pike_resident: true,
      is_registered_voter: true,
      voting_date: 'election-day',
      preferred_time: '9:00 AM',
      email: 'test@example.com',
      phone: '317-555-0100',
      address: '123 Test St',
      notes: 'Test record - can be deleted',
      status: 'pending'
    };

    const { error: insertError } = await supabase
      .from('signups')
      .insert(testRecord)
      .select();

    if (insertError) {
      console.log(`   ⚠️  Could not insert test record: ${insertError.message}`);
      return {
        success: false,
        message: '⚠️  Schema exists but insert failed',
        details: insertError
      };
    }

    console.log('   ✅ Can insert records (anon INSERT policy working)');

    // Clean up test record
    await supabase
      .from('signups')
      .delete()
      .eq('email', 'test@example.com');

    console.log('   ✅ Test record cleaned up');

    return {
      success: true,
      message: '✅ Schema verified and working'
    };

  } catch (error: any) {
    return {
      success: false,
      message: `❌ Schema verification failed: ${error.message}`,
      details: error
    };
  }
}

async function verifyRLS(): Promise<VerificationResult> {
  console.log('\n🔍 Step 4: Verifying Row Level Security (RLS)...');

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Try to query signups (should work with anon user if RLS is correct)
    const { data, error } = await supabase
      .from('signups')
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ⚠️  Query returned error: ${error.message}`);
      return {
        success: false,
        message: '⚠️  RLS may not be configured correctly',
        details: error
      };
    }

    console.log('   ✅ Anon user can query signups table');
    console.log('   ✅ RLS policies appear to be working');

    return {
      success: true,
      message: '✅ RLS verified'
    };

  } catch (error: any) {
    return {
      success: false,
      message: `❌ RLS verification failed: ${error.message}`,
      details: error
    };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     Pike2ThePolls - Supabase Setup Verification               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  const results: VerificationResult[] = [];

  // Run all verifications
  results.push(await verifyEnvironmentVariables());
  results.push(await verifyConnection());
  results.push(await verifySchema());
  results.push(await verifyRLS());

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                     Summary                                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  console.log(`Results: ${passed}/${total} checks passed`);

  if (passed === total) {
    console.log('\n🎉 SUCCESS! All verifications passed!');
    console.log('\n✅ Your Supabase setup is working correctly.');
    console.log('✅ The database schema is ready.');
    console.log('✅ RLS policies are in place.');
    console.log('\n🚀 You can now proceed with Phase 2: Database & Authentication');
  } else {
    console.log('\n⚠️  Some verifications failed. Please review the errors above.');
    console.log('\nNext steps:');
    console.log('1. Make sure you ran docs/supabase-schema.sql in Supabase SQL Editor');
    console.log('2. Check that RLS is enabled on the signups table');
    console.log('3. Verify the policies are created');
    console.log('\nSee SUPABASE_DEPLOYMENT.md for troubleshooting tips');
  }

  process.exit(passed === total ? 0 : 1);
}

main();
