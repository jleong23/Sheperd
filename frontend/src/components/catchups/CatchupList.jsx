import { useState, useEffect, useMemo, useCallback } from "react";
import { getCatchups, deleteCatchup } from "../../api/catchups";
import { CatchupCard } from "./CatchupCard";
import { CatchupModal } from "./CatchupModal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toast } from "react-toastify";
import AddCatchup from "./AddCatchup";

export default function CatchupList() {
  const [catchups, setCatchups] = useState([]);
  const [selectedCatchup, setSelectedCatchup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchCatchups = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await getCatchups(params);
      setCatchups(response?.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch catchups");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCatchups();
  }, [fetchCatchups]);

  const filteredCatchups = useMemo(() => {
    return catchups
      .filter((c) => {
        const text =
          `${c.catchuppurpose || ""} ${c.catchupcomments || ""}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => new Date(b.catchupdate) - new Date(a.catchupdate));
  }, [catchups, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await deleteCatchup(id);
      toast.success("Catchup deleted successfully!");
      fetchCatchups(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete catchup.");
    }
  };

  if (loading) return <LoadingSpinner fullPage={true} />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Catchup History</h1>

      {/* Add Catchups */}
      <AddCatchup onClick={() => setIsAddOpen(true)} />

      {/* Search & Filters */}
      <div className="grid gap-4 md:grid-cols-3 mb-2">
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
        className="bg-blue-500 text-sm text-white rounded-md px-4 py-2 mb-4 hover:bg-blue-700 transition"
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
              key={catchup.catchupid}
              catchup={catchup}
              onClick={() => setSelectedCatchup(catchup)}
              onDelete={() => handleDelete(catchup.catchupid)}
            />
          ))}
        </div>
      )}
      {(isAddOpen || selectedCatchup) && (
        <CatchupModal
          catchup={selectedCatchup}
          onClose={() => {
            setSelectedCatchup(null);
            setIsAddOpen(false);
          }}
          onSaved={() => {
            fetchCatchups();
            setSelectedCatchup(null);
            setIsAddOpen(false);
          }}
        />
      )}
    </div>
  );
}
