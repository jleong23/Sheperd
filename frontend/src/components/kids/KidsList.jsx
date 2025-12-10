import { useState, useEffect } from "react";
import KidsCard from "./KidsProfileCard/KidsCard";
import AddKids from "./AddKids";
import { fetchKids } from "../../api/kids";

export default function KidsList() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKids, setSelectedKids] = useState([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  const getKids = async () => {
    try {
      const data = await fetchKids();
      setKids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getKids();
  }, []);

  const toggleSelectKid = (id) => {
    setSelectedKids((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedKids.length === 0) {
      // If no selection, toggle bulk delete mode
      setBulkDeleteMode(!bulkDeleteMode);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedKids.length} kids?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedKids.map((id) =>
          fetch(`http://localhost:4000/kids/${id}`, { method: "DELETE" })
        )
      );

      alert(`${selectedKids.length} kids deleted successfully`);
      setSelectedKids([]);
      setBulkDeleteMode(false);
      getKids();
    } catch (err) {
      console.error(err);
      alert("Error deleting kids");
    }
  };

  if (isLoading) return <p className="text-center">Loading kids...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>

      <AddKids onKidAdded={getKids} />

      {/* Bulk Delete Button */}
      <button
        onClick={handleDeleteSelected}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4 transition"
      >
        {bulkDeleteMode
          ? selectedKids.length > 0
            ? `Delete Selected (${selectedKids.length})`
            : "Cancel Selection"
          : "Delete Users"}
      </button>

      {/* Kids Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto mt-3">
        {kids.map((kid) => (
          <KidsCard
            key={kid.id}
            kid={kid}
            onKidDeleted={getKids}
            showCheckbox={bulkDeleteMode}
            isSelected={selectedKids.includes(kid.id)}
            onSelect={toggleSelectKid}
          />
        ))}
      </div>
    </div>
  );
}
