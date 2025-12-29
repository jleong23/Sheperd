import { useState, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import { fetchKids } from "../../api/kids";
import { addCatchup, updateCatchup, deleteCatchup } from "../../api/catchups";
import toast from "react-hot-toast";
import { CatchupForm } from "./CatchupForm";

export function CatchupModal({ open, catchup, onClose, onSaved }) {
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
      onClose();
    } catch {
      toast.error("Failed to save catchup");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCatchup(catchup.catchupid);
      toast.success("Catchup deleted");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to delete catchup");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {isEdit ? "Edit Catchup" : "Add Catchup"}
          </h2>

          <CatchupForm
            kids={kids}
            isEdit={isEdit}
            initialData={{
              kidid: catchup?.kidid,
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
          <p className="text-gray-600">
            Are you sure you want to delete this catchup? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
