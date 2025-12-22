import { mockCatchups } from "./mockCatchups";
import { useState, useMemo } from "react";
import { CatchupCard } from "./CatchupCard";
import { CatchupModal } from "./CatchupModal";

export default function CatchupList() {
  const [selectedCatchup, setSelectedCatchup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredCatchups = useMemo(() => {
    return [...mockCatchups]
      .filter((c) => {
        const text = `${c.purpose} ${c.comments}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
      .filter((c) => {
        if (startDate && c.catchupDate < startDate) return false;
        if (endDate && c.catchupDate > endDate) return false;
        return true;
      })
      .sort((a, b) => new Date(b.catchupDate) - new Date(a.catchupDate));
  }, [searchTerm, startDate, endDate]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Catchup History</h1>

      {/* Search & Filters */}
      <div className=" grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search by purpose or comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring"
        />
      </div>
      <button
        onClick={() => {
          setSearchTerm("");
          setStartDate("");
          setEndDate("");
        }}
        className="bg-blue-500 text-sm text-white rounded-md px-4 py-2 my-2 hover:bg-blue-700 transition"
      >
        Clear filters
      </button>

      {/* Results */}
      {filteredCatchups.length === 0 ? (
        <p className="text-gray-500">No matching catchups found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredCatchups.map((catchup) => (
            <CatchupCard
              key={catchup.catchupId}
              catchup={catchup}
              onClick={() => setSelectedCatchup(catchup)}
            />
          ))}
        </div>
      )}

      <CatchupModal
        catchup={selectedCatchup}
        onClose={() => setSelectedCatchup(null)}
      />
    </div>
  );
}
