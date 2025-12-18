import { addEvent } from "../../api/events";
import { useState } from "react";

export default function AddEvent({ open, onClose, onEventAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // Track errors per field

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    const event = Object.fromEntries(formData.entries());

    // Client-side validation for required fields
    const newFieldErrors = {};
    if (!event.eventname?.trim())
      newFieldErrors.eventname = "Event name is required";
    if (!event.eventstartdate?.trim())
      newFieldErrors.eventstartdate = "Start date is required";

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) {
      setIsSubmitting(false);
      return; // Stop submission if validation fails
    }

    try {
      await addEvent(event);
      onClose(); // Close modal on success
      setFieldErrors({});

      if (onEventAdded) {
        onEventAdded(); // parent decides how to refresh
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Add New Event
        </h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <Input
            label="Event Name"
            name="eventname"
            required
            error={fieldErrors.eventname}
          />
          <Input
            label="Start Date"
            name="eventstartdate"
            type="date"
            required
            error={fieldErrors.eventstartdate}
          />
          <Input label="End Date" name="eventenddate" type="date" />
          <Input label="Start Time" name="eventstarttime" type="time" />
          <Input label="End Time" name="eventendtime" type="time" />
          <Input label="Photo URL" name="eventphoto" />
          <Input label="Assigned People" name="eventassignedpeople" />

          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", required, error }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
