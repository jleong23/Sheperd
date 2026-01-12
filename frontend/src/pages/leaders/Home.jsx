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

  /**
   * DYNAMIC YEAR LEVEL CALCULATION
   * To make this dynamic, fetch 'graduation_year' from your user profile in the DB.
   *
   * Example: If they are Year 10 in 2026, they graduate Year 12 in 2028.
   * Formula: Current Year Level = 12 - (Graduation Year - Current Year)
   */
  // TODO: Replace this hardcoded 2028 with data from your user API
  const targetGraduationYear = 2028;
  const currentYear = new Date().getFullYear();
  // Assuming Year 12 is the final year
  const calculatedYearLevel = 12 - (targetGraduationYear - currentYear);
  const displayYearLevel =
    calculatedYearLevel > 0 ? `Year ${calculatedYearLevel}` : "Graduated";

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="p-8 space-y-16 max-w-7xl mx-auto">
      {/* Welcome + Attendance & New People Page Btn */}
      <Welcome />

      {/* Group Stats */}
      <GroupStats yearLevel={displayYearLevel} />

      {/* Events */}
      <UpcomingEvents events={events} loading={loading} />

      {/* Reminders */}
      <Reminders />
    </div>
  );
}
