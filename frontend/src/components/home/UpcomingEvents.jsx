import { motion } from "framer-motion";

const SKELETON_COUNT = 4;

// Placeholder card that mirrors the real event card layout
function EventCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      {/* Event name */}
      <div className="h-6 w-3/4 rounded-lg bg-white/10" />

      {/* Date */}
      <div className="mt-3 h-4 w-1/3 rounded-md bg-white/10" />

      {/* Description */}
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full rounded-md bg-white/10" />
        <div className="h-4 w-2/3 rounded-md bg-white/10" />
      </div>
    </div>
  );
}

export default function UpcomingEvents({ events, loading }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        Upcoming Events
      </h2>

      {loading ? (
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          aria-busy="true"
          aria-label="Loading upcoming events"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : !events?.length ? (
        <p className="mt-8 text-center text-gray-500">
          No upcoming events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event) => (
            <motion.div
              key={event.eventid}
              whileHover={{ scale: 1.03, y: -5 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            >
              <h3 className="text-xl font-bold text-white">
                {event.eventname}
              </h3>

              <p className="mt-1 text-slate-400">
                {new Date(event.eventstartdate).toLocaleDateString()}
              </p>

              <p className="mt-4 text-slate-400">
                Event description for {event.eventname}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
