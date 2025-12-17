import { addEvent } from "../../api/events";
import { useState } from "react";

export default function AddEvent({ onEventAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    const event = Object.fromEntries(formData.entries());

    try {
      await addEvent(event);
      setIsModalOpen(false);

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

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Add Event
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Add New Event
            </h3>

            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

              <Input label="Event Name" name="eventname" required />
              <Input label="Start Date" name="eventstartdate" type="date" />
              <Input label="End Date" name="eventenddate" type="date" />
              <Input label="Start Time" name="eventstarttime" type="time" />
              <Input label="End Time" name="eventendtime" type="time" />
              <Input label="Photo URL" name="eventphoto" />
              <Input label="Assigned People" name="eventassignedpeople" />

              <div className="flex items-center justify-between mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, type = "text", required }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
}
