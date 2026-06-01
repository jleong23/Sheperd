import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "../ui/Modals/Modal";
import { addEvent } from "../../api/events";

const initialForm = {
  eventname: "",
  eventstartdate: "",
  eventenddate: "",
  eventstarttime: "",
  eventendtime: "",
  eventassignedpeople: "",
};

export default function AddEvent({ open, onClose, onEventAdded }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

  const fields = [
    {
      label: "Event Name",
      name: "eventname",
      type: "text",
      placeholder: "Youth Night",
      required: true,
    },
    {
      label: "Start Date",
      name: "eventstartdate",
      type: "date",
      required: true,
    },
    {
      label: "End Date",
      name: "eventenddate",
      type: "date",
      required: true,
    },
    {
      label: "Start Time",
      name: "eventstarttime",
      type: "time",
    },
    {
      label: "End Time",
      name: "eventendtime",
      type: "time",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.eventname.trim()) {
      alert("Event name is required.");
      return;
    }

    if (!form.eventstartdate) {
      alert("Start date is required.");
      return;
    }

    if (!form.eventenddate) {
      alert("End date is required.");
      return;
    }

    if (new Date(form.eventenddate) < new Date(form.eventstartdate)) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      setLoading(true);

      await addEvent({
        eventname: form.eventname.trim(),
        eventstartdate: form.eventstartdate,
        eventenddate: form.eventenddate,
        eventstarttime: form.eventstarttime || null,
        eventendtime: form.eventendtime || null,
        eventassignedpeople: form.eventassignedpeople.trim() || null,
      });

      onEventAdded?.();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to add event:", err);
      alert(err.response?.data?.error || "Failed to add event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            📅 New Event
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Add{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Event Details
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Create an event and assign the people responsible for it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Event Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Event Name <span className="text-red-400">*</span>
              </label>

              <input
                type="t`ext"
                name="eventname"
                value={form.eventname}
                onChange={handleChange}
                placeholder="Youth Night"
                className={inputClass}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Start Date <span className="text-red-400">*</span>
                </label>

                <input
                  type="date"
                  name="eventstartdate"
                  value={form.eventstartdate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  End Date <span className="text-red-400">*</span>
                </label>

                <input
                  type="date"
                  name="eventenddate"
                  value={form.eventenddate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Start Time
                </label>

                <input
                  type="time"
                  name="eventstarttime"
                  value={form.eventstarttime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  End Time
                </label>

                <input
                  type="time"
                  name="eventendtime"
                  value={form.eventendtime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Assigned People */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Assigned People
              </label>

              <textarea
                name="eventassignedpeople"
                value={form.eventassignedpeople}
                onChange={handleChange}
                rows="3"
                placeholder="Example: Carolina, Matthew, Pete"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Preview
            </p>

            <h3 className="text-lg font-bold text-white">
              {form.eventname || "Event Name"}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {form.eventstartdate || "Start Date"} →{" "}
              {form.eventenddate || "End Date"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {form.eventstarttime || "Start Time"} -{" "}
              {form.eventendtime || "End Time"}
            </p>

            <p className="mt-3 text-sm text-slate-400">
              Assigned: {form.eventassignedpeople || "None yet"}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <motion.button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{
                y: -2,
                scale: 1.02,
                boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Event"}
            </motion.button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
