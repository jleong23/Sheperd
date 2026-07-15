import { useState, useEffect } from "react";
import { fetchAllKids } from "../api/kids";

export function useAllKids() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [error, setError] = useState(null);

  const getKids = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllKids(status);
      setKids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getKids();
  }, [status]);

  return { kids, isLoading, error, status, setStatus, getKids };
}
