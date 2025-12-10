import { useState, useEffect } from "react";
import { fetchKids } from "../api/kids";

export function useKids() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getKids = async () => {
    try {
      const data = await fetchKids();
      setKids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getKids();
  }, []);

  return { kids, isLoading, error, getKids };
}
