import { useState, useEffect, useMemo, useCallback } from "react";
import { getCatchups, deleteCatchup } from "../api/catchups";
import { toast } from "react-toastify";

export function useCatchups() {
  const [catchups, setCatchups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCatchups = useCallback(
    async (overrideFilters = {}) => {
      setLoading(true);

      try {
        const finalSearchTerm =
          overrideFilters.searchTerm !== undefined
            ? overrideFilters.searchTerm
            : searchTerm;

        const finalMonth =
          overrideFilters.month !== undefined ? overrideFilters.month : month;

        const finalYear =
          overrideFilters.year !== undefined ? overrideFilters.year : year;

        const params = {
          month: finalMonth || undefined,
          year: finalYear || undefined,
          purpose: finalSearchTerm || undefined,
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

  // Optional: initial load only
  useEffect(() => {
    fetchCatchups();
  }, []);

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
    filteredCatchups: catchups,
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
