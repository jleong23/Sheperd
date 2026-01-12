import { IoCheckboxOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getEvents } from "../../api/events";
import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";
import UpcomingEvents from "../../components/home/UpcomingEvents";

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
      <section className="bg-blue-900 text-white p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-10">Reminders</h2>
        {[
          {
            title: "Send in attendance by 9pm Friday",
          },
          {
            title: "Tell Ryan he's handsome",
          },
          {
            title: "Update Pastoral Care Logs",
          },
        ].map(({ title }, id) => (
          <div key={id} className="text-2xl flex gap-3 text-center">
            <IoCheckboxOutline />
            {title}
          </div>
        ))}
        <div></div>
      </section>
    </div>
  );
}
