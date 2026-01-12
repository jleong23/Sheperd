import { useEffect } from "react";
import useEvents from "../../hooks/useEvents";
// Component Imports
import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import Reminders from "../../components/home/Reminders";

export default function Home() {
  const { events, loading, fetchEvents } = useEvents({
    sortBy: "eventstartdate",
    order: "asc",
    limit: 5,
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
