import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modals/Modal.jsx";
import { CatchupForm } from "../../../components/catchups/CatchupForm";
import {
  createCatchupForLeader,
  deleteCatchupForLeader,
  getLeaderKids,
  updateCatchupForLeader,
} from "../../../api/pastor.js";

export default function PastorCatchupModal({
  open,
  leaderId,
  catchup,
  kids: providedKids,
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(catchup);
  const [kids, setKids] = useState(providedKids || []);

  useEffect(() => {
    if (!open) return;

    if (providedKids) {
      setKids(providedKids);
      return;
    }

    async function loadKids() {
      try {
        const leaderKids = await getLeaderKids(leaderId);
        setKids(leaderKids);
      } catch {
        toast.error("Failed to load leader kids");
      }
    }

    loadKids();
  }, [open, leaderId, providedKids]);

  const handleSubmit = async (payload) => {
    try {
      const data = {
        kidid: Number(payload.kidid),
        catchupdate: payload.catchupdate,
        catchupstarttime: payload.catchupstarttime,
        catchupendtime: payload.catchupendtime,
        catchuppurpose: payload.catchuppurpose,
        catchupcomments: payload.catchupcomments,
      };

      if (isEdit) {
        await updateCatchupForLeader(leaderId, catchup.catchupid, data);
        toast.success("Catchup updated");
      } else {
        await createCatchupForLeader(leaderId, data);
        toast.success("Catchup created");
      }

      await onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Failed to update catchup" : "Failed to create catchup");
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!window.confirm("Delete this catchup?")) return;

    try {
      await deleteCatchupForLeader(leaderId, catchup.catchupid);
      toast.success("Catchup deleted");
      await onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete catchup");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            💬 Pastor Catchup
          </div>

          <h2 className="text-3xl font-extrabold">
            {isEdit ? "Edit Catchup for Leader" : "Add Catchup for Leader"}
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            {isEdit
              ? "Update this leader catchup record."
              : "Create a catchup record for this leader."}
          </p>
        </div>

        <CatchupForm
          kids={kids}
          isEdit={isEdit}
          initialData={{
            kidid: catchup?.kidid || "",
            date: catchup?.catchupdate || "",
            purpose: catchup?.catchuppurpose || "",
            comments: catchup?.catchupcomments || "",
            startTime: catchup?.catchupstarttime || "",
            endTime: catchup?.catchupendtime || "",
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          onDelete={handleDelete}
        />
      </div>
    </Modal>
  );
}
