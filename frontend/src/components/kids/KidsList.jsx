import { KidsGrid } from "./KidsProfileCard/KidsGrid";
import AddKids from "./AddKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";

export default function KidsList() {
  const { kids, isLoading, error, getKids } = useKids();
  const { selected, bulkMode, toggleSelect, handleDelete } = useBulkDelete(
    kids,
    getKids
  );

  if (isLoading) return <p className="text-center">Loading kids...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>

      <AddKids onKidAdded={getKids} />

      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4 transition"
      >
        {bulkMode
          ? selected.length > 0
            ? `Delete Selected (${selected.length})`
            : "Cancel Selection"
          : "Delete Users"}
      </button>

      <KidsGrid
        kids={kids}
        selected={selected}
        toggleSelect={toggleSelect}
        bulkMode={bulkMode}
        refresh={getKids}
      />
    </div>
  );
}
