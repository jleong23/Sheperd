import { KidsGrid } from "./KidsProfileCard/KidsGrid";
import AddKids from "./AddKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";

export default function KidsList() {
  const { kids, isLoading, error, getKids } = useKids();
  const { selected, bulkMode, toggleSelect, handleDelete, cancelSelection } =
    useBulkDelete(kids, getKids);

  if (isLoading) return <p className="text-center">Loading kids...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>

      <AddKids onKidAdded={getKids} />

      {/* Cancel Selection Button */}
      <div className="flex gap-2 mb-4">
        {bulkMode && (
          <button
            onClick={cancelSelection}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          {selected.length > 0
            ? `Delete Selected (${selected.length})`
            : "Delete Users"}
        </button>
      </div>

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
