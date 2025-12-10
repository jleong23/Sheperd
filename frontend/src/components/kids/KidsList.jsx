import { useState, useEffect } from "react";
import KidsCard from "./KidsCard";
import { fetchKids } from "../../api/kids";
import AddKids from "./AddKids";

export default function KidsList() {
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKids, setSelectedKids] = useState([]);

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

  if (isLoading) {
    return <p className="text-center">Loading kids...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  const toggleSelectKid = (id) => {
    setSelectedKids((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedKids.length === 0) return;

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
      getKids(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error deleting kids");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>
      <AddKids onKidAdded={getKids} />
      <button
        onClick={handleDeleteSelected}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4"
      >
        Delete Selected
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto mt-3">
        {kids.map((kid) => (
          <KidsCard
            key={kid.id}
            kid={kid}
            onKidDeleted={getKids}
            isSelected={selectedKids.includes(kid.id)}
            onSelect={toggleSelectKid}
          />
        ))}
      </div>
    </div>
  );
}
