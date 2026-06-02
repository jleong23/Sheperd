import { useState, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import { fetchKids } from "../../api/kids";
import { addCatchup, updateCatchup, deleteCatchup } from "../../api/catchups";
import toast from "react-hot-toast";
import { CatchupForm } from "./CatchupForm";

export function CatchupModal({
  open,
  catchup,
  onClose,
  onSaved,
  defaultKidId,
}) {
  const isEdit = Boolean(catchup);
  const [kids, setKids] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;

    fetchKids()
      .then(setKids)
      .catch(() => toast.error("Failed to fetch kids"));
  }, [open]);

  const handleSubmit = async (payload) => {
    const data = {
      ...payload,
      kidid: Number(payload.kidid),
    };

    try {
      if (isEdit) {
        await updateCatchup(catchup.catchupid, data);
        toast.success("Catchup updated successfully");
      } else {
        await addCatchup(data);
        toast.success("Catchup added successfully");
      }
      onSaved();
    } catch {
      toast.error("Failed to save catchup");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCatchup(catchup.catchupid);
      toast.success("Catchup deleted");
      onSaved();
    } catch {
      toast.error("Failed to delete catchup");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              💬 {isEdit ? "Edit Catchup" : "New Catchup"}
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {isEdit ? "Update" : "Add"}{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Catchup Details
              </span>
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Record conversations, follow-ups and pastoral care notes.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              <span className="text-red-400">*</span> Required fields
            </p>
          </div>

          <CatchupForm
            kids={kids}
            isEdit={isEdit}
            initialData={{
              kidid: catchup?.kidid || defaultKidId,
              purpose: catchup?.catchuppurpose,
              comments: catchup?.catchupcomments,
              date: catchup?.catchupdate,
              startTime: catchup?.catchupstarttime,
              endTime: catchup?.catchupendtime,
            }}
            onSubmit={handleSubmit}
            onCancel={onClose}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        </div>
      </Modal>

      {/* Reusing Modal for Delete Confirmation */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-red-500/20 backdrop-blur sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300">
              ⚠️
            </div>

            <h3 className="text-2xl font-bold text-white">Delete Catchup?</h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this catchup? This action cannot
              be undone.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-500"
            >
              Delete Catchup
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
