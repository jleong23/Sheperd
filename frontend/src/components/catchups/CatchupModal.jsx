import { useState, useEffect } from "react";
import { addCatchup, updateCatchup, deleteCatchup } from "../../api/catchups";
import { fetchKids } from "../../api/kids";
import toast from "react-hot-toast";
export function CatchupModal({ catchup, onClose, onSaved }) {
  const isEdit = Boolean(catchup);
  const [kids, setKids] = useState([]);
  const [kidid, setKidid] = useState("");
  const [kidname, setkidname] = useState("");
  const [purpose, setPurpose] = useState("");
  const [comments, setComments] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Fetch kids
  useEffect(() => {
    const getKids = async () => {
      try {
        const res = await fetchKids();
        setKids(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch kids");
      }
    };
    getKids();
  }, []);

  // Populate form
  useEffect(() => {
    if (catchup) {
      setKidid(catchup.kidid);
      setkidname(catchup.kidname);
      setPurpose(catchup.catchuppurpose || "");
      setComments(catchup.catchupcomments || "");
      setDate(catchup.catchupdate || "");
      setStartTime(catchup.catchupstarttime || "");
      setEndTime(catchup.catchupendtime || "");
    } else {
      // reset for Add mode
      setKidid("");
      setkidname("");
      setPurpose("");
      setComments("");
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  }, [catchup]);

  const handleSubmit = async () => {
    if (!kidid || !date) {
      toast.error("Kidid and date are required");
      return;
    }

    const payload = {
      kidid,
      catchupdate: date,
      catchuppurpose: purpose,
      catchupcomments: comments,
      catchupstarttime: startTime,
      catchupendtime: endTime,
    };

    try {
      if (isEdit) {
        await updateCatchup(catchup.catchupid, payload);
        toast.success("Catchup updated Succesfully");
      } else {
        await addCatchup(payload);
        toast.success("Catchup added Succesfully");
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save catchup");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCatchup(id);
      toast.success("Catchup deleted successfully!");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete catchup.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit Catchup" : "Add Catchup"}
        </h2>

        <select
          value={kidid}
          onChange={(e) => setKidid(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Select a kid</option>
          {kids.map((kid) => (
            <option key={kid.id} value={kid.id}>
              {kid.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded p-2"
        />

        <div className="flex gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <input
          type="text"
          placeholder="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full border rounded p-2"
        />

        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border rounded p-2"
        />

        <div className="flex justify-end gap-2">
          {isEdit && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this catchup?"
                  )
                ) {
                  handleDelete(catchup.catchupid);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
