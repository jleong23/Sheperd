export default function CatchupToolbar({
  searchTerm,
  onSearchChange,
  month,
  year,
  onMonthChange,
  onYearChange,
  onSearch,
  onClear,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-5 grid-cols-1 items-center mb-2">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by purpose or comments..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="rounded-md border px-5 py-2 text-sm"
      />

      {/* Month */}
      <select
        value={month}
        onChange={(e) =>
          onMonthChange(e.target.value ? Number(e.target.value) : "")
        }
        onKeyDown={handleKeyDown}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">All Months</option>
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      {/* Year */}
      <input
        type="number"
        placeholder="Year (e.g. 2026)"
        value={year}
        onChange={(e) =>
          onYearChange(e.target.value ? Number(e.target.value) : "")
        }
        onKeyDown={handleKeyDown}
        className="rounded-md border px-3 py-2 text-sm"
      />

      {/* Quick filters */}
      <button
        onClick={() => {
          const now = new Date();
          onMonthChange(now.getMonth() + 1);
          onYearChange(now.getFullYear());
          onSearch();
        }}
        className="bg-green-700 text-white rounded-md px-4 py-2 shadow hover:bg-green-800 transition"
      >
        This Month
      </button>

      <button
        onClick={() => {
          const now = new Date();
          onMonthChange("");
          onYearChange(now.getFullYear());
          onSearch();
        }}
        className="bg-green-700 text-white rounded-md px-4 py-2 shadow hover:bg-green-800 transition"
      >
        This Year
      </button>

      {/* Actions */}
      <div className="flex gap-2 md:col-span-2">
        <button
          onClick={onSearch}
          className="bg-blue-600 text-white rounded-md px-4 py-2 shadow hover:bg-blue-700 flex-1 transition"
        >
          Search
        </button>

        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 shadow hover:bg-gray-300 flex-1 transition"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
