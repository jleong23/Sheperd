import { useState, useEffect, useMemo } from "react";
import { getUserProfile } from "../api/users";
import { useAuth } from "../context/AuthContext";

export default function useUser(userId) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Prevent fetching if we know it will fail (backend only allows fetching own profile)
    // Supabase IDs are strings (UUIDs), so we do not cast to Number()
    if (authUser && authUser.id !== userId) {
      console.warn(`Skipping fetch for user ${userId} (not authorized)`);
      setError(new Error("Cannot fetch other users"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getUserProfile(userId)
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  // Calculate Year Level dynamically based on graduation year
  const yearLevel = useMemo(() => {
    if (!user?.group_graduation_year) return null; // Return null or a default like "10"
    const currentYear = new Date().getFullYear();
    const calculated = 12 - (user.group_graduation_year - currentYear);
    return calculated > 0 ? `Year ${calculated}` : "Graduated";
  }, [user]);

  return { user, yearLevel, isLoading, error };
}
