import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modals/Modal.jsx";
import { getLeaders, transferKidToLeader } from "../../../api/pastor.js";

export default function PastorTransferKidModal({
  open,
  kid,
  currentLeader,
  onClose,
  onTransferred,
}) {
  const [leaders, setLeaders] = useState([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadLeaders() {
      try {
        const data = await getLeaders();
        setLeaders(data);
      } catch (error) {
        console.error("Failed to load leaders:", error);
        toast.error("Failed to load leaders");
      }
    }

    setSelectedLeaderId("");
    loadLeaders();
  }, [open]);

  const transferOptions = useMemo(() => {
    return leaders.filter(
      (leader) => leader.leader_id !== currentLeader?.leader_id,
    );
  }, [leaders, currentLeader]);

  const handleTransfer = async () => {
    if (!kid || !selectedLeaderId) return;

    setLoading(true);

    try {
      await transferKidToLeader(kid.id, selectedLeaderId);
      toast.success(`${kid.name} transferred successfully`);
      await onTransferred?.();
      onClose();
    } catch (error) {
      console.error("Failed to transfer kid:", error);
      toast.error("Failed to transfer kid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            Transfer Kid
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            {kid?.name || "Selected kid"}
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Move this kid to another leader&apos;s group.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Leader
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {currentLeader?.user_name || "Unknown leader"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Transfer To <span className="text-red-400">*</span>
            </label>

            <select
              value={selectedLeaderId}
              onChange={(event) => setSelectedLeaderId(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="">Select a leader</option>
              {transferOptions.map((leader) => (
                <option key={leader.leader_id} value={leader.leader_id}>
                  {leader.user_name || leader.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={!selectedLeaderId || loading}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            {loading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
