import { useState, useCallback, useRef } from "react";
import { getEvents } from "../api/events";

export default function useEvents(initialParams = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use ref to keep initialParams stable across renders
  const defaultParams = useRef(initialParams);

  const fetchEvents = useCallback(async (overrideParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Merge default params with any overrides (filters, sort, etc.)
      const params = { ...defaultParams.current, ...overrideParams };
      const response = await getEvents(params);
      setEvents(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, loading, error, fetchEvents, setEvents };
}
