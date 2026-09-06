import { useEffect, useState } from "react";
import useEvents from "../../hooks/useEvents";
import { fetchKidStats } from "../../api/kids";

// Component Imports
import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import Reminders from "../../components/home/Reminders";

const eventOptions = {
  sortBy: "eventstartdate",
  order: "asc",
  limit: 5,
};

export default function Home() {
  const { events, loading, fetchEvents } = useEvents(eventOptions);
  const [statsLoading, setStatsLoading] = useState(true);

  // Default year level for now (since backend user profile doesn't have it yet)
  const yearLevel = "11";

  const [stats, setStats] = useState({
    total_kids: 0,
    regular_kids: 0,
    baptised_kids: 0, // Placeholder until column exists
  });

  useEffect(() => {
    fetchEvents();

    setStatsLoading(true);

    fetchKidStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => console.error("Failed to fetch stats:", err))
      .finally(() => {
        setStatsLoading(false);
      });
  }, [fetchEvents]);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 blur-[120px]" />
      <div className="absolute top-96 right-20 w-72 h-72 bg-purple-500/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome + Attendance & New People Page Btn */}
        <Welcome />

        {/* Group Stats + Upcoming Events side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <GroupStats
            yearLevel={yearLevel || "11"}
            stats={stats}
            loading={statsLoading}
          />
          <UpcomingEvents events={events} loading={loading} />
        </div>

        {/* Reminders full-width below */}
        <Reminders />

        {/* Future: latest added kid showcase — drop it here as its own
            full-width card, or fold it into the grid above as a 3rd column
            (lg:grid-cols-3) once you're ready to add it */}
      </div>
    </div>
  );
}
