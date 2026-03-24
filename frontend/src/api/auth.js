import { supabase } from "../supabaseClient";

/**
 * Login with Email and Password
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
 * Sign Up new user
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
 * Get the currently logged in user
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
 * Logout
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
