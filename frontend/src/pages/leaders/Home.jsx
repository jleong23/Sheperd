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

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome + Attendance & New People Page Btn */}
        <Welcome />
        {/* Group Stats */}
        <GroupStats
          yearLevel={yearLevel || "11"}
          stats={stats}
          loading={statsLoading}
        />
        {/* Events */}
        <UpcomingEvents events={events} loading={loading} />
        {/* Reminders */}
        <Reminders />
      </div>
    </div>
  );
}
