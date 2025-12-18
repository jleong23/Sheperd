import { BsCardChecklist } from "react-icons/bs";
import { IoCheckboxOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getEvents } from "../../api/events";

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
      {/* Attendance + New People checklist */}
      <section className="bg-blue-200 rounded-xl p-14 text-center text-blue-900 shadow-xl transform transition duration-500 hover:scale-[1.02]">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Welcome to Dreamers Youth
        </h1>
        <p className="text-2xl max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow">
          “Do nothing out of selfish ambition or vain conceit. Rather, in
          humility value others above yourselves, not looking to your own
          interests but each of you to the interests of the others.”
        </p>
        <div className="inline-flex flex-wrap justify-center gap-8">
          <a
            href="/attendance"
            className="bg-black text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-yellow-600 hover:scale-105 transform transition"
          >
            <BsCardChecklist className="inline mr-2 text-2xl" /> Attendance
          </a>
          <a
            href="/new-people"
            className="bg-black text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-pink-600 hover:scale-105 transform transition"
          >
            <BsCardChecklist className="inline mr-2 text-2xl" /> New People
          </a>
        </div>
      </section>

      {/* Leader Stats */}
      <section className="bg-gray-200 p-12 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-10 text-blue-900">
          Leader Stats
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Level */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              🏫
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">Year Level</p>
              <p className="text-3xl font-bold text-[#E07B13]">9</p>
            </div>
          </div>

          {/* Number of Kids */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              🤦🏼‍♂️
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">
                Number of kids in this group
              </p>
              <p className="text-3xl font-bold text-[#E07B13]">13</p>
            </div>
          </div>

          {/* Kids Baptised */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              💧
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">Kids Baptised</p>
              <p className="text-3xl font-bold text-[#E07B13]">12</p>
            </div>
          </div>

          {/* Comes Sunday Service */}
          <div className="flex items-center p-6 bg-white rounded-xl shadow hover:shadow-xl transition-shadow">
            <div className="bg-[#E07B13] text-white w-12 h-12 flex items-center justify-center rounded-full mr-4">
              ⛪️
            </div>
            <div>
              <p className="text-gray-500 font-medium text-lg">
                Comes Sunday Service
              </p>
              <p className="text-3xl font-bold text-[#E07B13]">5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}

      <section className="xl:col-span-2">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Upcoming Events
        </h2>
        {loading ? (
          <p>Loading events...</p>
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
