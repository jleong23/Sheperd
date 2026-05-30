import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";

export default function UpcomingEvents({ events, loading }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center text-3xl font-bold text-white mb-6">
        Upcoming Events
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : events?.length === 0 ? (
        <p className="text-center mt-8 text-gray-500">
          No upcoming events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => (
            <motion.div
              key={event.eventid}
              whileHover={{
                scale: 1.03,
                y: -5,
              }}
              className="
          bg-white/5
          border border-white/10
          backdrop-blur-md
          rounded-2xl
          p-5
          hover:border-purple-400/50
          hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]
          transition
        "
            >
              <h3 className="text-xl font-bold text-white">
                {event.eventname}
              </h3>

              <p className="text-slate-400 mt-1">
                {new Date(event.eventstartdate).toLocaleDateString()}
              </p>

              <p className="text-slate-400 mt-4">
                Event description for {event.eventname}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
