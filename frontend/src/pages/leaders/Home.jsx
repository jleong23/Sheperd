import { BsCardChecklist } from "react-icons/bs";
import { IoCheckboxOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getEvents } from "../../api/events";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Welcome from "../../components/home/Welcome";
import GroupStats from "../../components/home/GroupStats";

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

      {/* Leader Stats */}
      <GroupStats />

      {/* Events */}

      <section className="xl:col-span-2">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Upcoming Events
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <div
                key={event.eventid}
                className="bg-white rounded-xl shadow-lg p-8 border text-center hover:shadow-2xl transition cursor-pointer flex flex-col"
              >
                <h3 className="font-extrabold text-2xl text-blue-900 mb-2">
                  {event.eventname}
                </h3>
                <p className="text-gray-500 text-md mb-4">
                  {new Date(event.eventstartdate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-lg">
                  A brief description for {event.eventname} would go here.
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

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
