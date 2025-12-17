import { useEffect, useState, useCallback } from "react";
import { getEvents, deleteEvent } from "../../api/events";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [sortBy, setSortBy] = useState("eventstartdate");
  const [order, setOrder] = useState("asc");

  // const fetchEvents = useCallback(async () => {
  //   setLoading(true);

  //   try {
  //     const params = {
  //       sortBy,
  //       order,
  //     };

  //     if (filters.name) params.name = filters.name;
  //     if (filters.startDate) params.startDate = filters.startDate;
  //     if (filters.endDate) params.endDate = filters.endDate;

  //     const data = await getEvents(params);
  //     setEvents(data);
  //     setError(null);
  //   } catch (err) {
  //     setError("Failed to Fetch Events");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [filters, sortBy, order]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getEvents();
      console.log("Events API response:", data);

      const eventsArray = Array.isArray(data?.data) ? data.data : [];

      setEvents(eventsArray);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id); // call backend
      fetchEvents(); // refresh list
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
        <AddEvent onEventAdded={fetchEvents} />
      </div>

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
