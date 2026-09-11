import { useState, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import KidForm from "./KidForm";
import { getLeaders } from "../../api/pastor";

export default function AddKidModal({
  open,
  onClose,
  onAdded,
  loading,
  requireLeaderSelection = false,
}) {
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState("");
  const [leaderError, setLeaderError] = useState("");

  useEffect(() => {
    if (open && requireLeaderSelection) {
      setLeadersLoading(true);
      getLeaders()
        .then((data) => setLeaders(data))
        .catch((err) => console.error("Failed to fetch leaders:", err))
        .finally(() => setLeadersLoading(false));
    }
    if (!open) {
      setSelectedLeaderId("");
      setLeaderError("");
    }
  }, [open, requireLeaderSelection]);

  const handleSubmit = (formData) => {
    if (requireLeaderSelection) {
      if (!selectedLeaderId) {
        setLeaderError("Please select a leader to assign this kid to.");
        return;
      }
      onAdded(formData, selectedLeaderId);
    } else {
      onAdded(formData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            👥 New Kid Profile
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Add Kid{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Details
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            {requireLeaderSelection
              ? "Choose which leader this kid should be assigned to, then add their details."
              : "Add basic details so your team can keep track of this person."}
          </p>
        </div>

        {requireLeaderSelection && (
          <div className="mb-6 space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Assign to Leader
            </label>
            <select
              value={selectedLeaderId}
              onChange={(e) => {
                setSelectedLeaderId(e.target.value);
                setLeaderError("");
              }}
              disabled={leadersLoading}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="">
                {leadersLoading ? "Loading leaders..." : "Select a leader"}
              </option>
              {leaders.map((leader) => (
                <option key={leader.leader_id} value={leader.leader_id}>
                  {leader.user_name || leader.email}
                </option>
              ))}
            </select>
            {leaderError && (
              <p className="text-sm font-medium text-red-400">{leaderError}</p>
            )}
          </div>
        )}

        <KidForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          submitText="Add Kid"
        />
      </div>
    </Modal>
  );
}
