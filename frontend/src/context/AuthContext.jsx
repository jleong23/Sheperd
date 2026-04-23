import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { syncUser } from "../api/users";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) syncUser().catch(console.error);
      setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session) {
        syncUser().catch(console.error);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ token: session?.access_token, user, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
