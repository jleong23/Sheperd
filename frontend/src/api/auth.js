/**
 * api/auth.js
 * Handles all client-side authentication operations using Supabase Auth
 * This module provides:
 * - Email/password login
 * - User registration (signup)
 * - Fetching the currently authenticated user
 * - Logout functionality
 */
import { supabase } from "../supabaseClient";

/**
 * @function login
 * @description Login user with email and password
 * 1. Send credentials to Supabase Auth
 * 2. Supabase validates user credentials
 * 3. Returns session + user data if successful
 * @returns {Promise<Object>} Supabase auth response (session + user)
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * @function signup
 * @description Register a new user with Supabase Auth
 * 1. Creates a new auth user in Supabase
 * 2. Stores additional metadata (user_name) in user metadata
 * 3. Returns created user/session data
 */
export async function signup({ email, password, userName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName,
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * @function getCurrentUser
 * @description Fetch the currently authenticated user
 * 1. Calls Supabase Auth to retrieve current session user
 * 2. Returns user object if authenticated
 * 3. Returns null if no active session or error occurs
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user;
}

/**
 * @function logout
 * @description Log out the current authenticated user
 * 1. Invalidates Supabase session
 * 2. Removes local auth state
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
