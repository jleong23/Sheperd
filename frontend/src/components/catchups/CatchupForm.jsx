import { useState } from "react";
import { KidSelect } from "./KidSelect";
import { TimeRangeInput } from "./CatchupTimeRangeInput";
import { CatchupActions } from "./CatchupActions";

export function CatchupForm({
  kids,
  isEdit,
  initialData,
  onSubmit,
  onCancel,
  onDelete,
}) {
  const [kidid, setKidid] = useState(initialData.kidid || "");
  const [purpose, setPurpose] = useState(initialData.purpose || "");
  const [comments, setComments] = useState(initialData.comments || "");
  const [date, setDate] = useState(initialData.date || "");
  const [startTime, setStartTime] = useState(initialData.startTime || "");
  const [endTime, setEndTime] = useState(initialData.endTime || "");

  return (
    <>
      <KidSelect
        kids={kids}
        value={kidid}
        disabled={isEdit}
        onChange={setKidid}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2"
      />

      <TimeRangeInput
        startTime={startTime}
        endTime={endTime}
        onStartChange={setStartTime}
        onEndChange={setEndTime}
      />

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

      <CatchupActions
        isEdit={isEdit}
        onDelete={onDelete}
        onCancel={onCancel}
        onSave={() =>
          onSubmit({
            kidid,
            catchupdate: date,
            catchuppurpose: purpose,
            catchupcomments: comments,
            catchupstarttime: startTime,
            catchupendtime: endTime,
          })
        }
      />
    </>
  );
}
