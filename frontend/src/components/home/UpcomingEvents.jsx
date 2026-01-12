import LoadingSpinner from "../../components/ui/LoadingSpinner";
export default function UpcomingEvents({ events, loading }) {
  return (
    <section className="xl:col-span-2">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">
        Upcoming Events
      </h2>
      {loading ? (
        <LoadingSpinner />
      ) : events?.length === 0 ? ( // Validate when no events are found
        <p className="text-center mt-8 text-gray-500">
          No upcoming events found.
        </p>
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
  );
}
