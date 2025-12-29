export default function CatchupToolbar({
  searchTerm,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 mb-2">
        <input
          type="text"
          placeholder="Search by purpose or comments..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <button
        onClick={onClear}
        className="bg-blue-500 text-white rounded-md px-4 py-2 mb-4"
      >
        Clear filters
      </button>
    </>
  );
}
