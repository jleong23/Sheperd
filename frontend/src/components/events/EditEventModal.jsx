import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../ui/Modals/Modal";
import { updateEvent } from "../../api/events";
import { toast } from "react-hot-toast";

export default function EditEventModal({
  open,
  event,
  onClose,
  onUpdated,
  showToast,
}) {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";
  useEffect(() => {
    if (event)
      setFormData({
        ...event,
        eventstartdate: event.eventstartdate
          ? event.eventstartdate.split("T")[0]
          : "",
        eventenddate: event.eventenddate
          ? event.eventenddate.split("T")[0]
          : "",
      });
  }, [event]);

  if (!event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...formData };
      // Ensure dates are saved as UTC ISO strings to prevent timezone shifts
      if (payload.eventstartdate && !payload.eventstartdate.includes("T")) {
        payload.eventstartdate = `${payload.eventstartdate}T00:00:00.000Z`;
      }
      if (payload.eventenddate && !payload.eventenddate.includes("T")) {
        payload.eventenddate = `${payload.eventenddate}T00:00:00.000Z`;
      }

      await updateEvent(event.eventid, payload);
      toast.success("Event updated successfully");
      onUpdated(); // refresh list
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            ✏️ Edit Event
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Update{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Event Details
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Keep event information accurate and up to date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Event Name
            </label>

            <input
              name="eventname"
              value={formData.eventname || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="Event name"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-300">
              Assigned People
            </label>

            <textarea
              name="eventassignedpeople"
              value={formData.eventassignedpeople || ""}
              onChange={handleChange}
              rows="3"
              className={inputClass}
              placeholder="Example: Carolina, Matthew, Pete"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Event Start Date
            </label>

            <input
              type="date"
              name="eventstartdate"
              value={formData.eventstartdate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Event End Date
            </label>

            <input
              type="date"
              name="eventenddate"
              value={formData.eventenddate || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Event Start Time
            </label>

            <input
              type="time"
              name="eventstarttime"
              value={formData.eventstarttime || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Event End Time
            </label>

            <input
              type="time"
              name="eventendtime"
              value={formData.eventendtime || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-sm text-gray-500 mt-4">
          Last updated:{" "}
          {event.updated_at
            ? new Date(event.updated_at).toLocaleString()
            : "N/A"}
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <motion.button
            type="button"
            onClick={onClose}
            disabled={saving}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </motion.button>

          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            whileHover={{
              y: -2,
              scale: 1.02,
              boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
            }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
