import { KidsGrid } from "./KidsProfileCard/KidsGrid";
import AddKids from "./AddKids";
import DeleteKids from "./DeleteKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";
import KidStatusFilter from "./KidStatusFilter";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function KidsList() {
  const { kids, isLoading, error, getKids, status, setStatus } = useKids();
  const {
    selected,
    bulkMode,
    toggleSelect,
    handleDelete,
    cancelSelection,
    enterBulkMode,
  } = useBulkDelete(kids, getKids);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-semibold">Catchup History</h1>

      <div className="flex gap-4 ">
        <AddKids onKidAdded={getKids} />

        <DeleteKids
          bulkMode={bulkMode}
          selected={selected}
          enterBulkMode={enterBulkMode}
          cancelSelection={cancelSelection}
          handleDelete={handleDelete}
        />
      </div>
      <KidStatusFilter value={status} onChange={setStatus} />

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
