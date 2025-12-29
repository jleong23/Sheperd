export function TimeRangeInput({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}) {
  return (
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
  );
}
