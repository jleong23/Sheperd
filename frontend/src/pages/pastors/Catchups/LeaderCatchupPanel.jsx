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
    <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageCircle size={22} />
            </div>
            Catchup Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500 font-medium">
            Pastoral care conversations and follow-ups.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by kid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 pl-5 text-sm font-medium outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-64"
            />
          </div>

          <AddCatchup onClick={openCreateModal} />
        </div>
      </div>

      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {[
          {
            label: "Total Catchups",
            val: catchups.length,
            icon: MessageCircle,
            color: "text-slate-900",
          },
          {
            label: "This Month",
            val: monthlyCatchups.length,
            icon: MessageCircle,
            color: "text-indigo-600",
          },
          {
            label: "Latest Catchup",
            val: latestCatchup
              ? new Date(latestCatchup.catchupdate).toLocaleDateString()
              : "No catchups",
            icon: MessageCircle,
            color: "text-slate-900",
            isDate: true,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {item.label}
            </p>
            <h3
              className={`mt-2 ${item.isDate ? "text-lg" : "text-3xl"} font-black ${item.color}`}
            >
              {item.val}
            </h3>
          </div>
        ))}
      </div>

      {filteredCatchups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium">No catchups found.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
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
