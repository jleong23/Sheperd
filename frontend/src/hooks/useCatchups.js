import { useState, useEffect, useMemo, useCallback } from "react";
import { getCatchups, deleteCatchup } from "../api/catchups";
import { toast } from "react-toastify";

export function useCatchups() {
  const [catchups, setCatchups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatchups = useCallback(async () => {
    setLoading(true);
    try {
      // Fix: Pass filter state to the backend API
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        purpose: searchTerm || undefined,
      };
      const res = await getCatchups(params);
      setCatchups(res?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch catchups");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, searchTerm]);

  useEffect(() => {
    // Debounce the fetch to prevent API calls on every keystroke
    const timer = setTimeout(() => {
      fetchCatchups();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchCatchups]);

  const filteredCatchups = useMemo(() => {
    // Backend now handles filtering and sorting, so we just return the data
    return catchups;
  }, [catchups]);

  const removeCatchup = async (id) => {
    try {
      await deleteCatchup(id);
      toast.success("Catchup deleted");
      fetchCatchups();
    } catch {
      toast.error("Failed to delete catchup");
    }
  };

  return {
    loading,
    error,
    filteredCatchups,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchCatchups,
    removeCatchup,
  };
}
