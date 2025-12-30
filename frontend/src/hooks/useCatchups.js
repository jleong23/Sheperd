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
      const res = await getCatchups();
      setCatchups(res?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch catchups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatchups();
  }, [fetchCatchups]);

  const filteredCatchups = useMemo(() => {
    return catchups
      .filter((c) => {
        // text filter
        const textMatch =
          `${c.catchuppurpose || ""} ${c.catchupcommentes || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        // date filter
        const catchupDate = new Date(c.catchupDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        // make end date inclusive
        if (end) {
          end.setHours(23, 59, 59, 999);
        }
        const startMatch = !start || catchupDate >= start;
        const endMatch = !end || catchupDate <= end;

        return textMatch && startMatch && endMatch;
      })

      .sort((a, b) => new Date(b.catchupdate) - new Date(a.catchupdate));
  }, [catchups, searchTerm, startDate, endDate]);

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
