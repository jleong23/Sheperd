import { useState } from "react";
import AddCatchup from "./AddCatchup";
import CatchupToolbar from "./CatchupToolBar";
import CatchupResults from "./CatchupResults";
import { CatchupModal } from "./CatchupModal";
import { useCatchups } from "../../hooks/useCatchups";
import CatchupPageSkeleton from "./CatchupPageSkeleton.jsx";

export default function CatchupList() {
  const {
    loading,
    error,
    filteredCatchups,
    searchTerm,
    setSearchTerm,
    month,
    setMonth,
    year,
    setYear,
    fetchCatchups,
    removeCatchup,
  } = useCatchups();

  const [selectedCatchup, setSelectedCatchup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClearFilters = () => {
    const currentYear = new Date().getFullYear();

    setSearchTerm("");
    setMonth("");
    setYear(currentYear);

    fetchCatchups({
      searchTerm: "",
      month: "",
      year: currentYear,
    });
  };

  const openCreateModal = () => {
    setSelectedCatchup(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCatchup(null);
  };

  const handleSaved = () => {
    fetchCatchups();
    closeModal();
  };

  if (loading) return <CatchupPageSkeleton fullPage />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                💬 Catchup Management
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Manage{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Catchups
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Record conversations, pastoral care moments, and follow-up notes
                for your young people.
              </p>
            </div>

            <AddCatchup onClick={openCreateModal} />
          </div>
        </section>

        <CatchupToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onClear={handleClearFilters}
          onSearch={fetchCatchups}
        />

        <CatchupResults
          catchups={filteredCatchups}
          onSelect={setSelectedCatchup}
          onDelete={removeCatchup}
        />

        {(isModalOpen || selectedCatchup) && (
          <CatchupModal
            open
            catchup={selectedCatchup}
            onClose={closeModal}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
