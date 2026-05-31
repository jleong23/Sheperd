import { KidsGrid } from "./KidsProfileCard/KidsGrid";
import AddKids from "./AddKids";
import DeleteKids from "./DeleteKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";
import KidStatusFilter from "./KidStatusFilter";

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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                👥 Kids Management
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Manage Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Kids List
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                View profiles, update details, filter by status, and keep your
                youth ministry information organised in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
              <AddKids onKidAdded={getKids} />

              <DeleteKids
                bulkMode={bulkMode}
                selected={selected}
                enterBulkMode={enterBulkMode}
                cancelSelection={cancelSelection}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur">
          <KidStatusFilter value={status} onChange={setStatus} />
        </section>

        <KidsGrid
          kids={kids}
          selected={selected}
          toggleSelect={toggleSelect}
          bulkMode={bulkMode}
          refresh={getKids}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
