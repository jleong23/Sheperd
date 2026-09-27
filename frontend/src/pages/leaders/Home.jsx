import { useEffect, useState } from "react";
import useEvents from "../../hooks/useEvents";
import useWeeklySummary from "../../hooks/useWeeklySummary";
import { useAuth } from "../../context/AuthContext";
import { fetchKidStats, fetchYearLevels } from "../../api/kids";

import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";
import UpcomingEvents from "../../components/home/UpcomingEvents";
import WeeklySummary from "../../components/home/WeeklySummary";
import Reminders from "../../components/home/Reminders";
import MinistryStats from "../../components/home/MinistryStats";

const eventOptions = {
  sortBy: "eventstartdate",
  order: "asc",
  limit: 5,
};

export default function Home() {
  const { events, loading, fetchEvents } = useEvents(eventOptions);
  const [statsLoading, setStatsLoading] = useState(true);
  const { summary, loading: summaryLoading, fetchSummary } = useWeeklySummary();
  const { role } = useAuth();

  const [yearLevels, setYearLevels] = useState([]);
  const [yearLevelsLoading, setYearLevelsLoading] = useState(true);

  const [stats, setStats] = useState({
    total_kids: 0,
    regular_kids: 0,
    baptised_kids: 0,
  });

  useEffect(() => {
    fetchEvents();
    fetchSummary();

    setStatsLoading(true);
    fetchKidStats()
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err))
      .finally(() => setStatsLoading(false));

    setYearLevelsLoading(true);
    fetchYearLevels()
      .then((data) => setYearLevels(data.year_levels || []))
      .catch((err) => console.error("Failed to fetch year levels:", err))
      .finally(() => setYearLevelsLoading(false));
  }, [fetchEvents, fetchSummary]);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 blur-[120px]" />
      <div className="absolute top-96 right-20 w-72 h-72 bg-purple-500/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Welcome />

        <WeeklySummary summary={summary} loading={summaryLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <GroupStats
            yearLevels={yearLevels}
            stats={stats}
            loading={statsLoading || yearLevelsLoading}
          />
          <UpcomingEvents events={events} loading={loading} />
        </div>

        {role?.toLowerCase() === "pastor" && <MinistryStats />}

        <Reminders />
      </div>
    </div>
  );
}
