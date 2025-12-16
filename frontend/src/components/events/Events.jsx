import { useEffect, useState } from "react";
import { getEvents } from "../../api/events";
import AddEvent from "../../components/events/AddEvent";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to Fetch Events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AddEvent />
      {events.map((event) => (
        <div key={event.eventid}>{event.eventname}</div>
      ))}
    </div>
  );
}
