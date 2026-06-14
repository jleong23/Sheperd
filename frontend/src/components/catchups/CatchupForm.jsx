import { useState, useMemo } from "react";
import { KidSelect } from "./KidSelect";
import { TimeRangeInput } from "./CatchupTimeRangeInput";
import { CatchupActions } from "./CatchupActions";

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

export function CatchupForm({
  kids,
  isEdit,
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
}) {
  const initial = useMemo(
    () => ({
      kidid: initialData.kidid || "",
      date: initialData.date || "",
      purpose: initialData.purpose || "",
      comments: initialData.comments || "",
      startTime: initialData.startTime || "",
      endTime: initialData.endTime || "",
    }),
    [initialData],
  );
  const [kidid, setKidid] = useState(initialData.kidid || "");
  const [purpose, setPurpose] = useState(initialData.purpose || "");
  const [comments, setComments] = useState(initialData.comments || "");
  const [date, setDate] = useState(initialData.date || "");
  const [startTime, setStartTime] = useState(initialData.startTime || "");
  const [endTime, setEndTime] = useState(initialData.endTime || "");

  const hasChanges =
    kidid !== initial.kidid ||
    date !== initial.date ||
    purpose !== initial.purpose ||
    comments !== initial.comments ||
    startTime !== initial.startTime ||
    endTime !== initial.endTime;

  return (
    <div className="space-y-6">
      <KidSelect
        kids={kids}
        value={kidid}
        disabled={isEdit}
        onChange={setKidid}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Catchup Date <span className="text-red-400">*</span>
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <TimeRangeInput
            startTime={startTime}
            endTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Catchup Purpose <span className="text-red-400">*</span>
        </label>

        <textarea
          rows={2}
          placeholder="Follow up, pastoral care, prayer request, school discussion..."
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Catchup Comments
        </label>

        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={5}
          className={INPUT_CLASS}
        />
      </div>

      <CatchupActions
        isEdit={isEdit}
        onDelete={onDelete}
        onCancel={onCancel}
        isDirty={hasChanges}
        onSave={() => {
          if (!kidid || !date || !purpose.trim()) {
            alert("Please fill in all required fields.");
            return;
          }

          if (!hasChanges) return;

          onSubmit({
            kidid,
            catchupdate: date,
            catchuppurpose: purpose,
            catchupcomments: comments,
            catchupstarttime: startTime,
            catchupendtime: endTime,
          });
        }}
      />
    </div>
  );
}
