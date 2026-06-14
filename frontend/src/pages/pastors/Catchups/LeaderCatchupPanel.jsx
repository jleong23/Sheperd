import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import AddCatchup from "../../../components/catchups/AddCatchup.jsx";
import PastorCatchupModal from "./PastorCatchupModal.jsx";
import { CatchupCard } from "../../../components/catchups/CatchupCard.jsx";

export default function LeaderCatchupPanel({
  catchups,
  leaderId,
  kids = [],
  onCatchupAdded,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatchup, setSelectedCatchup] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredCatchups = useMemo(() => {
    return catchups.filter((catchup) =>
      (catchup.kidName || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [catchups, searchTerm]);

  const latestCatchup =
    catchups.length > 0
      ? [...catchups].sort(
          (a, b) =>
            new Date(b.catchupdate).getTime() -
            new Date(a.catchupdate).getTime(),
        )[0]
      : null;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyCatchups = catchups.filter((catchup) => {
    const date = new Date(catchup.catchupdate);

    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const openCreateModal = () => {
    setSelectedCatchup(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCatchup(null);
  };

  const handleSaved = async () => {
    await onCatchupAdded?.();
    closeModal();
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <MessageCircle size={22} />
            Catchup Overview
          </h2>

          <p className="text-sm text-slate-500">
            Pastoral care conversations and follow-ups.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by kid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
          />

          <AddCatchup onClick={openCreateModal} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-slate-500">Total Catchups</p>
          <h3 className="mt-2 text-3xl font-bold">{catchups.length}</h3>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-slate-500">This Month</p>
          <h3 className="mt-2 text-3xl font-bold">{monthlyCatchups.length}</h3>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-slate-500">Latest Catchup</p>
          <h3 className="mt-2 text-sm font-bold">
            {latestCatchup
              ? new Date(latestCatchup.catchupdate).toLocaleDateString()
              : "No catchups"}
          </h3>
        </div>
      </div>

      {filteredCatchups.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
          No catchups found.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredCatchups.map((catchup) => (
            <CatchupCard
              key={catchup.catchupid}
              catchup={catchup}
              onClick={() => {
                setSelectedCatchup(catchup);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <PastorCatchupModal
          open={showModal}
          leaderId={leaderId}
          catchup={selectedCatchup}
          kids={kids}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
