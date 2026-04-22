export default function CatchupToolbar({
  searchTerm,
  onSearchChange,
  month,
  year,
  onMonthChange,
  onYearChange,
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
        {/* Month Selector */}
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Year Input */}
        <input
          type="number"
          placeholder="Year (e.g. 2026)"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
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
