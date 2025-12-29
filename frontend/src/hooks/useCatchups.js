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
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getCatchups(params);
      setCatchups(res?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch catchups");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCatchups();
  }, [fetchCatchups]);

  const filteredCatchups = useMemo(() => {
    return catchups
      .filter((c) =>
        `${c.catchuppurpose || ""} ${c.catchupcomments || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.catchupdate) - new Date(a.catchupdate));
  }, [catchups, searchTerm]);

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
