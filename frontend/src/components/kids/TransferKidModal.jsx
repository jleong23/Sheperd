import { useState, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import FormActions from "./FormActions";
import { getLeaders } from "../../api/pastor";

export default function TransferKidModal({
  open,
  onClose,
  kid,
  onTransfer,
  loading,
}) {
  const [leaders, setLeaders] = useState([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState("");
  const [fetchingLeaders, setFetchingLeaders] = useState(false);

  useEffect(() => {
    if (open) {
      const loadLeaders = async () => {
        setFetchingLeaders(true);
        try {
          const data = await getLeaders();
          setLeaders(data || []);
        } catch (err) {
          console.error("Failed to load leaders", err);
        } finally {
          setFetchingLeaders(false);
        }
      };
      loadLeaders();
    }
  }, [open]);

  if (!kid) return null;

  const handleSubmit = () => {
    if (!selectedLeaderId) return;
    onTransfer(kid.id, selectedLeaderId);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 text-white shadow-2xl backdrop-blur">
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 w-fit rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              🔄 Transfer Kid
            </div>
            <h2 className="text-2xl font-bold">Transfer {kid.name}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Move this kid to another leader's list. Their profile and history
              will be transferred.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Select New Leader
              </label>
              <select
                value={selectedLeaderId}
                onChange={(e) => setSelectedLeaderId(e.target.value)}
                disabled={fetchingLeaders}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
              >
                <option value="">-- Choose a leader --</option>
                {leaders
                  .filter((l) => l.id !== kid.leader_id)
                  .map((leader) => (
                    <option key={leader.leader_id} value={leader.leader_id}>
                      {leader.user_name}
                    </option>
                  ))}
              </select>
              {fetchingLeaders && (
                <p className="text-xs text-slate-500 italic">
                  Loading leaders...
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <FormActions
              onCancel={onClose}
              onSubmit={handleSubmit}
              loading={loading}
              submitText="Confirm Transfer"
              submitColor="emerald"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
