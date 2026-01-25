import React, { useState, useEffect } from "react";
import { fetchNewPeopleKids, updateKid, deleteKid } from "../../api/kids";
import { FaTrash } from "react-icons/fa";

export default function NewPeople() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadKids();
  }, []);

  const loadKids = async () => {
    try {
      setLoading(true);
      const data = await fetchNewPeopleKids();
      setKids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCall = async (kid, field) => {
    // Optimistic update: update UI immediately
    const updatedKid = { ...kid, [field]: !kid[field] };
    setKids((prev) => prev.map((k) => (k.id === kid.id ? updatedKid : k)));

    try {
      // Send the full object because the backend PUT requires 'name' etc.
      await updateKid(kid.id, updatedKid);
    } catch (err) {
      console.error("Failed to update call status:", err);
      // Revert on failure
      setKids((prev) => prev.map((k) => (k.id === kid.id ? kid : k)));
      alert("Failed to update status. Please try again.");
    }
  };

  const handleFeedbackChange = (id, field, value) => {
    setKids((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k)),
    );
  };

  const handleSaveFeedback = async (kid) => {
    try {
      await updateKid(kid.id, kid);
      alert("Feedback saved successfully!");
    } catch (err) {
      console.error("Failed to save feedback:", err);
      alert("Failed to save feedback.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this person?")) return;

    try {
      await deleteKid(id);
      setKids((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete person. Please try again.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">New People Follow-up</h1>

      {kids.length === 0 ? (
        <p>No new people found.</p>
      ) : (
        <div className="grid gap-6">
          {kids.map((kid) => (
            <div
              key={kid.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{kid.name}</h2>
                  <p className="text-gray-600">Phone: {kid.phone || "N/A"}</p>
                  <p className="text-gray-600">
                    Parent: {kid.parentname} ({kid.parent_phone || "N/A"})
                  </p>
                  <p className="text-gray-600">Schol: {kid.school}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {kid.status_code}
                  </div>
                  <button
                    onClick={() => handleDelete(kid.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* First Call Section */}
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">First Call</h3>
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!kid.first_call}
                        onChange={() => handleToggleCall(kid, "first_call")}
                        className="w-4 h-4"
                      />
                      <span
                        className={
                          kid.first_call
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {kid.first_call ? "Done" : "Not Done"}
                      </span>
                    </label>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    placeholder="Enter feedback for first call..."
                    value={kid.first_call_feedback || ""}
                    onChange={(e) =>
                      handleFeedbackChange(
                        kid.id,
                        "first_call_feedback",
                        e.target.value,
                      )
                    }
                  />
                </div>

                {/* Second Call Section */}
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Second Call</h3>
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!kid.second_call}
                        onChange={() => handleToggleCall(kid, "second_call")}
                        className="w-4 h-4"
                      />
                      <span
                        className={
                          kid.second_call
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {kid.second_call ? "Done" : "Not Done"}
                      </span>
                    </label>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    placeholder="Enter feedback for second call..."
                    value={kid.second_call_feedback || ""}
                    onChange={(e) =>
                      handleFeedbackChange(
                        kid.id,
                        "second_call_feedback",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSaveFeedback(kid)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Save Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
