const STATUSES = [
  { value: "ALL", label: "All" },
  { value: "CORE", label: "Core" },
  { value: "FRINGE", label: "Fringe" },
  { value: "NP", label: "New People" },
];

export default function KidStatusFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {STATUSES.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition
            ${
              value === status.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
