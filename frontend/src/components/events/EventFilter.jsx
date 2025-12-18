export default function EventFilter({
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
  onSearch,
  onClear,
}) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        {/* Event Name */}
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        />

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
        >
          <option value="eventstartdate">Sort by Start Date</option>
          <option value="eventname">Sort by Name</option>
        </select>

        {/* Action Buttons */}
        <div className="flex gap-2 md:col-span-2">
          <button
            onClick={onSearch}
            className="bg-blue-600 text-white rounded px-4 py-2 shadow hover:bg-blue-700 flex-1 transition"
          >
            Search
          </button>
          <button
            onClick={onClear}
            className="bg-gray-200 text-gray-700 rounded px-4 py-2 shadow hover:bg-gray-300 flex-1 transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
