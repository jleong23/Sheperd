import { useState, useEffect } from "react";
import { fetchKids } from "../../api/kids";
import { addCatchup, updateCatchup, deleteCatchup } from "../../api/catchups";
import toast from "react-hot-toast";
import { CatchupForm } from "./CatchupForm";
export function CatchupModal({ catchup, onClose, onSaved }) {
  const isEdit = Boolean(catchup);
  const [kids, setKids] = useState([]);

  useEffect(() => {
    fetchKids()
      .then(setKids)
      .catch(() => {
        toast.error("Failed to fetch kids");
      });
  }, []);

  const handleSubmit = async (payload) => {
    // Ensure kidid is a number (backend expects integer)
    const data = { ...payload };
    if (data.kidid) {
      data.kidid = Number(data.kidid);
    }

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

  const handleDelete = async () => {
    await deleteCatchup(catchup.catchupid);
    toast.success("Catchup deleted");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
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
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
