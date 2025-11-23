import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUsers() {
  try {
    // Create admin user
    console.log('Creating admin user...');
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@vibe.com',
      password: '1234',
      email_confirm: true,
      user_metadata: {
        is_admin: true,
      },
    });

    if (adminError) {
      console.error('Error creating admin user:', adminError.message);
    } else {
      console.log('✓ Admin user created:', adminData.user.email);
    }

    // Create guest user
    console.log('Creating guest user...');
    const { data: guestData, error: guestError } = await supabase.auth.admin.createUser({
      email: 'guest@vibe.com',
      password: '1234',
      email_confirm: true,
      user_metadata: {
        is_admin: false,
      },
    });

    if (guestError) {
      console.error('Error creating guest user:', guestError.message);
    } else {
      console.log('✓ Guest user created:', guestData.user.email);
    }

    console.log('\n✓ All users created successfully!');
    console.log('\nCredentials:');
    console.log('Admin - Email: admin@vibe.com, Password: 1234');
    console.log('Guest - Email: guest@vibe.com, Password: 1234');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createUsers();
