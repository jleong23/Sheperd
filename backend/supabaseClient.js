/**
 * supabaseClient.js - Request-scoped Supabase client factory
 * Creates a Supabase client instance per request and attaches the user's
 * JWT access token for authenticated database queries.
 *
 * Flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Create Supabase client using project credentials
 * 3. Inject JWT token into global request headers
 * 4. Return scoped Supabase client for database operations
 *
 * - Uses SUPABASE_ANON_KEY (not service role key)
 * - Token is forwarded to Supabase to respect Row Level Security (RLS)
 * - Enables secure per-user data filtering via auth.uid()
 */

const { createClient } = require("@supabase/supabase-js");

// Supabase Project Credentials
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Creates Supabase client by injecting user's JWT access token
const createSupabaseClient = (req) => {
    // 1. Extract Bearer token from Authorization header
    const token = req.headers.authorization?.replace("Bearer ", "");

    return createClient( // 2. Create Supabase client with auth context
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );
};

module.exports = createSupabaseClient;
