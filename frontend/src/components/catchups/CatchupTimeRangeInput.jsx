export function TimeRangeInput({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}) {
  const toMinutes = (t) => {
    if (!t) return null;
    const [hours, minutes] = t.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const hasBoth = start !== null && end !== null;
  const isInvalid = hasBoth && start >= end;

  return (
    <div>
      {isInvalid && (
        <p className="text-sm text-red-600">
          Start time must be earlier than end time.
        </p>
      )}
      <div className="flex gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
    </div>
  );
}
