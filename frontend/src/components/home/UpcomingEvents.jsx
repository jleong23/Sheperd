import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function UpcomingEvents({ events, loading }) {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 md:mb-6 text-blue-900">
        Upcoming Events
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : events?.length === 0 ? (
        <p className="text-center mt-8 text-gray-500">
          No upcoming events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {events.map((event) => (
            <div
              key={event.eventid}
              className="bg-white rounded-xl shadow-md p-4 md:p-5 border text-center hover:shadow-xl transition cursor-pointer flex flex-col"
            >
              <h3 className="font-extrabold text-lg md:text-xl text-blue-900 mb-2">
                {event.eventname}
              </h3>

              <p className="text-gray-500 text-sm md:text-base mb-4">
                {new Date(event.eventstartdate).toLocaleDateString()}
              </p>

              <p className="text-gray-700 text-sm md:text-base">
                A brief description for {event.eventname} would go here.
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
