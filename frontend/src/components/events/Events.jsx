import { useEffect, useState, useCallback } from "react";
import { getEvents } from "../../api/events";
import AddEvent from "../../components/events/AddEvent";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    // Keep previous events while loading new ones to avoid flicker
    // setLoading(true); 
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to Fetch Events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventAdded = () => {
    fetchEvents();
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <AddEvent onEventAdded={handleEventAdded} />
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event.eventid} className="p-4 hover:bg-gray-50">
                <p className="font-semibold">{event.eventname}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.eventstartdate).toLocaleDateString()} - {new Date(event.eventenddate).toLocaleDateString()}
                </p>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No events found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
