import { useState, useCallback } from "react";
import api from "../api"; // adjust to your existing axios/fetch wrapper

export default function useWeeklySummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/attendance/summary/this-week");
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch weekly summary:", err);
      setSummary({ active: false });
    } finally {
      setLoading(false);
    }
  }, []);

  return { summary, loading, fetchSummary };
}
