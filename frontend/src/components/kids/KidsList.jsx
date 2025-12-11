import { KidsGrid } from "./KidsProfileCard/KidsGrid";
import AddKids from "./AddKids";
import DeleteKids from "./DeleteKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";

export default function KidsList() {
  const { kids, isLoading, error, getKids } = useKids();
  const {
    selected,
    bulkMode,
    toggleSelect,
    handleDelete,
    cancelSelection,
    enterBulkMode,
  } = useBulkDelete(kids, getKids);

  if (isLoading) return <p className="text-center">Loading kids...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-5xl font-bold text-center my-8">Year 9 Listing</h2>

      <AddKids onKidAdded={getKids} />

      <DeleteKids
        bulkMode={bulkMode}
        selected={selected}
        enterBulkMode={enterBulkMode}
        cancelSelection={cancelSelection}
        handleDelete={handleDelete}
      />

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
