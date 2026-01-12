/**
 * useEvents customHook
 * - Fetching events from backend
 * - Managing loading and error state
 * - Handling filters and query parameters
 * - Reusing the same logic in multiple components (EventList, UpcomingEvents, etc.)
 */
import { useState, useCallback } from "react";
import { getEvents } from "../api/events";

export default function useEvents(initialParams = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch events from the API
   * overrideParams allows dynamic filters (search, date, etc.)
   */
  const fetchEvents = useCallback(
    async (overrideParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        // New object that combines default iniPararms & runtime overParams
        const params = { ...initialParams, ...overrideParams };

        // Removing empty filters: Only send meaningful filters to the API.
        Object.keys(params).forEach(
          (key) => params[key] === "" && delete params[key]
        );

        const response = await getEvents(params); // Call the API with cleaned parameters
        setEvents(Array.isArray(response?.data) ? response.data : []); // Safe state updates using optional chaining(?.) to avoid crashes
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    },
    [initialParams]
  );
  return {
    events,
    loading,
    error,
    fetchEvents,
    setEvents, // optional: Useful for optimistic UI updates
  };
}
