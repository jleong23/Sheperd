export default function AttendanceSort({
  selectedYear,
  selectedTerm,
  availableYears,
  availableTerms,
  onYearChange,
  onTermChange,
  hideWeek = false,
}) {
  return (
    <div className="flex flex-wrap gap-10 mb-8 px-8 text-2xl">
      {/* Year Selection */}
      <div className="flex flex-col">
        <label className="font-semibold mb-2">Year</label>
        <select
          className="p-2 border rounded-lg"
          value={selectedYear || ""}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          <option value="">Select Year</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Term Selection */}
      <div className="flex flex-col">
        <label className="font-semibold mb-2">Term</label>
        <select
          className="p-2 border rounded-lg"
          value={selectedTerm || ""}
          onChange={(e) => onTermChange(Number(e.target.value))}
          disabled={!selectedYear}
        >
          <option value="">Select Term</option>
          {availableTerms.map((term) => (
            <option key={term} value={term}>
              Term {term}
            </option>
          ))}
        </select>
      </div>

      {/* Week selection is now hidden */}
      {!hideWeek && (
        <div className="flex flex-col">
          <label className="semi-bold mb-2">Week</label>
          {/* you can keep old week dropdown if needed */}
        </div>
      )}
    </div>
  );
}
