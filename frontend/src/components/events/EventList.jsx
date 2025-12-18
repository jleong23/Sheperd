import { useEffect, useState, useCallback } from "react";
import { getEvents, deleteEvent } from "../../api/events";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import EventFilter from "./EventFilter";
import EditEventModal from "./EditEventModal";
import { toast } from "react-hot-toast";

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
  const [order, setOrder] = useState("desc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleFilterChange = (updatedFilters) => setFilters(updatedFilters);
  const handleSortChange = (newSortBy) =>
    setSortBy(newSortBy) ||
    setOrder(newSortBy === "eventname" ? "asc" : "desc");

  const fetchEvents = useCallback(
    async (currentFilters = {}) => {
      setLoading(true);
      try {
        const params = { sortBy, order, ...currentFilters };
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
    [sortBy, order]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const handleSearch = () => fetchEvents(filters);
  const handleClear = () => {
    setFilters({ name: "", startDate: "", endDate: "" });
    fetchEvents({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents(filters);
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event.");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
        <AddEvent onEventAdded={() => fetchEvents(filters)} />
      </div>

      {/* Filters */}
      <EventFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full p-6 text-center text-gray-500 bg-pink-50 rounded-lg shadow-2xl">
            No events found
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.eventid}
              className="bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 rounded-xl shadow-2xl transform hover:scale-105 transition p-5 flex flex-col justify-between"
            >
              {/* Event Image */}
              {event.eventphoto && (
                <img
                  src={event.eventphoto}
                  alt={event.eventname}
                  className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg"
                />
              )}

              {/* Event Details */}
              <div className="mb-4 space-y-1">
                <h2 className="text-xl font-bold text-purple-800">
                  {event.eventname}
                </h2>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Dates:</span>{" "}
                  {new Date(event.eventstartdate).toLocaleDateString()} -{" "}
                  {new Date(event.eventenddate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Times:</span>{" "}
                  <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                    {event.eventstarttime || "N/A"}
                  </span>{" "}
                  -{" "}
                  <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
                    {event.eventendtime || "N/A"}
                  </span>
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Assigned:</span>{" "}
                  <span className="bg-pink-200 text-pink-800 px-2 py-0.5 rounded">
                    {event.eventassignedpeople || "None"}
                  </span>
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Last updated:{" "}
                  {event.updated_at
                    ? new Date(event.updated_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setEditOpen(true);
                  }}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                >
                  Edit
                </button>
                <DeleteEvent eventId={event.eventid} onDeleted={handleDelete} />
              </div>

              {/* Edit Modal */}
              <EditEventModal
                open={editOpen && selectedEvent?.eventid === event.eventid}
                event={selectedEvent}
                onClose={() => setEditOpen(false)}
                onUpdated={fetchEvents}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
