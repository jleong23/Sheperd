import { useState, useEffect, useMemo, useCallback } from "react";
import { getCatchups, deleteCatchup } from "../api/catchups";
import { toast } from "react-toastify";

export function useCatchups() {
  const [catchups, setCatchups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatchups = useCallback(
    async (override = {}) => {
      setLoading(true);

      try {
        const params = {
          month: override.month ?? month ?? undefined,
          year: override.year ?? year ?? undefined,
          purpose: searchTerm || undefined,
        };

        const res = await getCatchups(params);
        setCatchups(res?.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch catchups");
      } finally {
        setLoading(false);
      }
    },
    [month, year, searchTerm],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatchups({
        month,
        year,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [month, year, searchTerm]);

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
    month,
    setMonth,
    year,
    setYear,
    fetchCatchups,
    removeCatchup,
  };
}
