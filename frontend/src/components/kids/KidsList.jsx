import AddKidModal from "./AddKidModal";
import EditKidModal from "./EditKidModal";
import KidListGrid from "./KidListGrid";
import DeleteKids from "./DeleteKids";
import { useKids } from "../../hooks/useKids";
import { useBulkDelete } from "../../hooks/useBulkDelete";
import KidStatusFilter from "./KidStatusFilter";
import { useState } from "react";
import { createKid, updateKid } from "../../api/kids";
import { motion } from "framer-motion";

export default function KidsList() {
  const { kids, isLoading, error, getKids, status, setStatus } = useKids();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedKid, setSelectedKid] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    selected,
    bulkMode,
    toggleSelect,
    handleDelete,
    cancelSelection,
    enterBulkMode,
  } = useBulkDelete(kids, getKids);

  const handleAddKid = async (formData) => {
    setActionLoading(true);
    try {
      await createKid({
        name: formData.name,
        birthday: formData.birthday || null,
        school: formData.school || "",
        phone: formData.phone || "",
        parent_phone: formData.parent_phone,
      });
      await getKids();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding kid:", err);
      alert(err.response?.data?.error || "Error adding kid");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditKid = (kid) => {
    setSelectedKid(kid);
    setIsEditModalOpen(true);
  };

  const handleUpdateKid = async (formData) => {
    setActionLoading(true);
    try {
      await updateKid(selectedKid.id, formData);
      await getKids();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating kid:", err);
      alert(err.response?.data?.error || "Error updating kid");
    } finally {
      setActionLoading(false);
    }
  };

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
              <motion.button
                onClick={() => setIsAddModalOpen(true)}
                whileHover={{
                  y: -3,
                  scale: 1.03,
                  boxShadow: "0px 0px 28px rgba(99,102,241,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
              >
                + Add Kid
              </motion.button>

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

        <KidListGrid
          kids={kids}
          selected={selected}
          toggleSelect={toggleSelect}
          bulkMode={bulkMode}
          loading={isLoading}
          onEdit={handleEditKid}
          actions={{ edit: true, delete: false, transfer: false }}
        />
      </div>

      <AddKidModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleAddKid}
        loading={actionLoading}
      />

      <EditKidModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        kid={selectedKid}
        onSaved={handleUpdateKid}
        loading={actionLoading}
        showExtendedFields={false}
      />
    </div>
  );
}
