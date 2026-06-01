import { useEffect, useState } from "react";
import { deleteEvent } from "../../api/events";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import EventFilter from "./EventFilter";
import EditEventModal from "./EditEventModal";
import EventCardSkeleton from "./EventCardSkeleton.jsx";
import useEvents from "../../hooks/useEvents";

export default function EventList() {
  const { events, loading, error, fetchEvents } = useEvents({
    sortBy: "eventstartdate",
    order: "desc",
  });

  const [filters, setFilters] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [sortBy, setSortBy] = useState("eventstartdate");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchEvents({ ...filters, sortBy: newSort });
  };

  const handleSearch = () => fetchEvents({ ...filters, sortBy });

  const handleClear = () => {
    setFilters({ name: "", startDate: "", endDate: "" });
    setSortBy("eventstartdate");
    fetchEvents({ sortBy: "eventstartdate" });
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      handleSearch();
      toast.success("Event deleted successfully!");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                📅 Events Management
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Create, organise, filter, and update upcoming youth events in
                one simple place.
              </p>
            </div>

            <motion.button
              onClick={() => setAddOpen(true)}
              whileHover={{
                y: -3,
                scale: 1.03,
                boxShadow: "0px 0px 28px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 sm:w-fit"
            >
              + Add Event
            </motion.button>
          </div>
        </motion.section>

        {/* Filters */}
        <EventFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Event Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
          ) : events.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center">
              <p className="text-lg font-semibold text-white">
                No events found
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Try changing your filters or create a new event.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.eventid}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0px 0px 30px rgba(99,102,241,0.25)",
                  borderColor: "rgba(99,102,241,0.65)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-indigo-500/5 backdrop-blur"
              >
                <div className="flex flex-1 flex-col">
                  <div className="mb-4">
                    <h2 className="line-clamp-2 text-xl font-bold text-white">
                      {event.eventname}
                    </h2>

                    <p className="mt-2 text-xs text-slate-500">
                      Last updated:{" "}
                      {event.updated_at
                        ? new Date(event.updated_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Dates
                      </p>
                      <p className="mt-1 font-semibold text-slate-300">
                        {formatDate(event.eventstartdate)} -{" "}
                        {formatDate(event.eventenddate)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Start
                        </p>
                        <p className="mt-1 font-semibold text-indigo-300">
                          {event.eventstarttime || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          End
                        </p>
                        <p className="mt-1 font-semibold text-purple-300">
                          {event.eventendtime || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Assigned People
                      </p>
                      <p className="mt-1 line-clamp-2 font-semibold text-slate-300">
                        {event.eventassignedpeople || "None"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                    <motion.button
                      onClick={() => {
                        setSelectedEvent(event);
                        setEditOpen(true);
                      }}
                      whileHover={{
                        y: -2,
                        scale: 1.03,
                        boxShadow: "0px 0px 20px rgba(99,102,241,0.3)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-500"
                    >
                      Edit
                    </motion.button>

                    <DeleteEvent
                      eventId={event.eventid}
                      onDeleted={handleDelete}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <AddEvent
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onEventAdded={handleSearch}
      />

      <EditEventModal
        open={editOpen}
        event={selectedEvent}
        onClose={() => setEditOpen(false)}
        onUpdated={handleSearch}
      />
    </div>
  );
}
