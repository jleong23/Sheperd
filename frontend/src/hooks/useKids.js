import { useState, useEffect } from "react";
import { fetchKids } from "../api/kids";

export function useKids() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [error, setError] = useState(null);

  const getKids = async () => {
    try {
      const data = await fetchKids(status);
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
