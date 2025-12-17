export default function EventFilter({
  filters,
  sortBy,
  order,
  onFilterChange,
  onSortChange,
}) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Event Name */}
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        />

        {/* Sorting */}
        <div className="flex gap-2">
          {/* Sort by Date / Name */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value, order)}
            className="border rounded px-2 py-2 flex-1"
          >
            <option value="eventstartdate">Start Date</option>
            <option value="eventenddate">End Date</option>
            <option value="eventname">Name</option>
          </select>

          {/* Sort by ASC / DESC */}
          <select
            value={order}
            onChange={(e) => onSortChange(sortBy, e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>
    </div>
  );
}
