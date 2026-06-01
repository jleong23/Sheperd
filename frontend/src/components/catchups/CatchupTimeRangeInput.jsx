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

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30";

  return (
    <div className="space-y-2">
      {isInvalid && (
        <p className="text-sm text-red-400">
          Start time must be earlier than end time.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium uppercase tracking-wide text-slate-500">
            Start Time
          </label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium uppercase tracking-wide text-slate-500">
            End Time
          </label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
