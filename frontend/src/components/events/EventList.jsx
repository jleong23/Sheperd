import { useEffect, useState, useCallback } from "react";
import { getEvents, deleteEvent } from "../../api/events";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import EventFilter from "./EventFilter";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  // Default sort by start date in descending order
  const [sortBy, setSortBy] = useState("eventstartdate");
  const [order, setOrder] = useState("desc");

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  // Simplified sort handler
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Automatically set order based on the selected column
    if (newSortBy === "eventname") {
      setOrder("asc");
    } else {
      setOrder("desc");
    }
  };

  const fetchEvents = useCallback(
    async (currentFilters = {}) => {
      setLoading(true);

      try {
        const params = {
          sortBy,
          order,
          ...currentFilters,
        };

        // Clean up empty filter values so they aren't sent to the API
        if (!params.name) delete params.name;
        if (!params.startDate) delete params.startDate;
        if (!params.endDate) delete params.endDate;

        const response = await getEvents(params);

        setEvents(Array.isArray(response?.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    },
    [sortBy, order] // fetchEvents is recreated only when sorting changes
  );

  // Initial fetch on component mount and when sorting changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Manual search triggered by button
  const handleSearch = () => {
    fetchEvents(filters);
  };

  // Clear filters and refresh the list
  const handleClear = () => {
    setFilters({
      name: "",
      startDate: "",
      endDate: "",
    });
    fetchEvents({}); // Fetch with empty filters
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id); // call backend
      fetchEvents(filters); // refresh list with current filters
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <AddEvent onEventAdded={() => fetchEvents(filters)} />
      </div>

      <EventFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200 bg-white shadow rounded">
          {events.length === 0 && (
            <li className="p-4 text-center text-gray-500">No events found</li>
          )}

          {events.map((event) => (
            <li
              key={event.eventid}
              className="p-4 hover:bg-gray-50 flex justify-between"
            >
              <div>
                <p className="font-semibold">{event.eventname}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.eventstartdate).toLocaleDateString()} -{" "}
                  {new Date(event.eventenddate).toLocaleDateString()}
                </p>
              </div>

              <DeleteEvent eventId={event.eventid} onDeleted={handleDelete} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
