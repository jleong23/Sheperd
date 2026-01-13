import { useEffect, useState } from "react";
import useEvents from "../../hooks/useEvents";
import useUser from "../../hooks/useUser";
import { fetchKidStats } from "../../api/kids";

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

  // Fetch user profile (ID 1 hardcoded for now)
  const { yearLevel } = useUser(1);

  const [stats, setStats] = useState({
    total_kids: 0,
    regular_kids: 0,
    baptised_kids: 0, // Placeholder until column exists
  });

  useEffect(() => {
    fetchEvents();

    // Fetch dynamic stats
    fetchKidStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, [fetchEvents]);

  return (
    <div className="p-8 space-y-16 max-w-7xl mx-auto">
      {/* Welcome + Attendance & New People Page Btn */}
      <Welcome />

      {/* Group Stats */}
      <GroupStats yearLevel={yearLevel || "11"} stats={stats} />

      {/* Events */}
      <UpcomingEvents events={events} loading={loading} />

      {/* Reminders */}
      <Reminders />
    </div>
  );
}
