import { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import AddCatchup from "./AddCatchup";
import CatchupToolbar from "./CatchupToolBar";
import CatchupResults from "./CatchupResults";
import { CatchupModal } from "./CatchupModal";
import { useCatchups } from "../../hooks/useCatchups";

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

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-semibold">Catchup Logs</h1>

      <AddCatchup
        onClick={() => {
          setSelectedCatchup(null);
          setIsModalOpen(true);
        }}
      />

      <CatchupToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onClear={() => {
          const currentYear = new Date().getFullYear();
          setSearchTerm("");
          setMonth("");
          setYear(currentYear);
          fetchCatchups(); // IMPORTANT
        }}
        onSearch={fetchCatchups}
      />

      <CatchupResults
        catchups={filteredCatchups}
        onSelect={setSelectedCatchup}
        onDelete={removeCatchup}
      />

      {(isModalOpen || selectedCatchup) && (
        <CatchupModal
          open={true}
          catchup={selectedCatchup}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCatchup(null);
          }}
          onSaved={() => {
            fetchCatchups();
            setIsModalOpen(false);
            setSelectedCatchup(null);
          }}
        />
      )}
    </div>
  );
}
