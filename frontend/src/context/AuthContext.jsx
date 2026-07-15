/**
 * context/AuthContext.jsx - Global Authentication State Manager
 * This context handles:
 * - Supabase session management
 * - Auth state persistence across refresh
 * - Real-time auth state updates (login/logout)
 * - User synchronization with backend database
 *
 * It acts as the single source of truth for authentication state
 * across the entire frontend application.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { syncUser } from "../api/users";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * Provider: AuthProvider
 * Wraps the application and injects authentication state
 *
 * Responsibilities:
 * 1. Hydrate session on initial app load
 * 2. Subscribe to Supabase auth state changes
 * 3. Keep local state (session + user) in sync
 * 4. Sync authenticated user to backend database
 * 5. Expose auth state to all child components
 */
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await syncUser();

      setProfile(response.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // 1. Check if user is already existed on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session) {
        fetchProfile().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Auth state listener ( Handles login, logout, token refresh, and session updates )
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session) {
        await fetchProfile();
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      // Cleanup subscription on unmount
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Logout function
   * Clears supabase session and rest auth state
   */
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        token: session?.access_token,
        user,
        profile,
        role: profile?.role,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
