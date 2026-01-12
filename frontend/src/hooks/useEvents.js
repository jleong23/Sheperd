import { useState, useCallback, useRef } from "react";
import { getEvents } from "../api/events";

/**
 * Custom hook for fetching events with stable default parameters
 */
export default function useEvents(initialParams = {}) {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  /**
   * useRef keeps default params stable across renders
   * - Does NOT trigger re-renders
   * - Prevents dependency issues in useCallback / useEffect
   */
  const defaultParams = useRef(initialParams);

  /**
   * Fetch events from the API
   * overrideParams allows dynamic filters without mutating defaults
   */
  const fetchEvents = useCallback(async (overrideParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      /**
       * Merge default params with runtime overrides
       * overrideParams takes priority
       */
      const params = {
        ...defaultParams.current,
        ...overrideParams,
      };

      const response = await getEvents(params);

      /**
       * Always store a valid array in state
       * Prevents runtime rendering errors
       */
      setEvents(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);

      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []); // Safe due to useRef + stable setters

  return {
    events,
    loading,
    error,
    fetchEvents,
    setEvents, // Allows optimistic updates or manual state control
  };
}
