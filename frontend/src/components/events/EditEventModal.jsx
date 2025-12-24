import { useState, useEffect } from "react";
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
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="eventname"
          value={formData.eventname || ""}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Event name"
        />

        <input
          name="eventassignedpeople"
          value={formData.eventassignedpeople || ""}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Assigned people"
        />

        <input
          type="date"
          name="eventstartdate"
          value={formData.eventstartdate || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="eventenddate"
          value={formData.eventenddate || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="time"
          name="eventstarttime"
          value={formData.eventstarttime || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="time"
          name="eventendtime"
          value={formData.eventendtime || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 mt-4">
        Last updated:{" "}
        {event.updated_at ? new Date(event.updated_at).toLocaleString() : "N/A"}
      </p>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Close
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Modal>
  );
}
