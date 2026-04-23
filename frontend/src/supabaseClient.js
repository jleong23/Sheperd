/**
 * supabaseClient.js - Supabase Client Initialization
 *
 * This file creates and exports a single Supabase client instance
 * used across the entire frontend application.
 *
 * It is responsible for:
 * - Connecting the app to the Supabase backend
 * - Providing authentication APIs
 * - Enabling database queries and real-time subscriptions
 *
 * Environment variables are used to securely inject project credentials.
 */

/**
 * Supabase Configuration
 *
 * These values are injected at build time via Vite environment variables:
 * - VITE_SUPABASE_URL: Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Public anonymous API key
 *
 * NOTE:
 * - The anon key is safe for frontend use (Row Level Security still applies)
 * - Sensitive operations should still be protected via backend policies
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase Client Instance
 *
 * This is a singleton client used throughout the application.
 * It should NOT be recreated in multiple files to avoid duplicate sessions.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
