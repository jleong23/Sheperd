import { useState, useEffect } from "react";
import { getEvents } from "../../api/events";
// Component Imports
import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import Reminders from "../../components/home/Reminders";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        // Fetch events sorted by start date, limit to a few upcoming ones
        const response = await getEvents({
          sortBy: "eventstartdate",
          order: "asc",
          limit: 5,
        });
        setEvents(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);
  return (
    <div className="p-8 space-y-16 max-w-7xl mx-auto">
      {/* Welcome + Attendance & New People Page Btn */}
      <Welcome />

      {/* Group Stats */}
      <GroupStats />

      {/* Events */}
      <UpcomingEvents events={events} loading={loading} />

      {/* Reminders */}
      <Reminders />
    </div>
  );
}
