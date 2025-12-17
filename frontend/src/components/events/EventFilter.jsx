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
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        {/* Event Name */}
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border rounded px-3 py-2"
        />

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border rounded px-3 py-2"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          className="border rounded px-3 py-2"
        />

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="eventstartdate">Sort by Start Date</option>
          <option value="eventname">Sort by Name</option>
        </select>

        {/* Action Buttons */}
        <div className="flex gap-2 md:col-span-2">
          <button
            onClick={onSearch}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 flex-1"
          >
            Search
          </button>
          <button
            onClick={onClear}
            className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 flex-1"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
