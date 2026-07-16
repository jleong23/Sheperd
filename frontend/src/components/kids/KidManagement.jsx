import { useState } from "react";
import { Trash2 } from "lucide-react";
import KidListGrid from "./KidListGrid.jsx";
import EditKidModal from "./EditKidModal.jsx";
import TransferKidModal from "./TransferKidModal.jsx";
import KidProfileModal from "./KidProfileModal.jsx";
import Modal from "../ui/Modals/Modal.jsx";
import { updateKidForLeader } from "../../api/pastor.js";
import { deleteKid } from "../../api/kids.js";
import toast from "react-hot-toast";

export default function KidManagement({
  kids,
  onKidUpdated,
  onTransferKid,
  onKidDeleted,
}) {
  const [selectedKid, setSelectedKid] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditKid = (kid) => {
    setSelectedKid(kid);
    setEditOpen(true);
  };

  const handleTransferClick = (kid) => {
    setSelectedKid(kid);
    setTransferOpen(true);
  };

  const handleDeleteClick = (kid) => {
    setSelectedKid(kid);
    setDeleteConfirmOpen(true);
  };

  const handleCardClick = (kid) => {
    setSelectedKid(kid);
    setProfileOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteKid(selectedKid.id);
      toast.success("Kid profile deleted.");
      if (onKidDeleted) await onKidDeleted();
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete kid", err);
      toast.error("Failed to delete kid profile.");
    } finally {
      setLoading(false);
    }
  };

  const onSaved = async (formData) => {
    setLoading(true);
    try {
      await updateKidForLeader(selectedKid.id, formData);
      if (onKidUpdated) await onKidUpdated();
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update kid", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferConfirm = async (kidId, newLeaderId) => {
    setLoading(true);
    try {
      if (onTransferKid) {
        await onTransferKid(kidId, newLeaderId);
      }
      setTransferOpen(false);
    } catch (err) {
      console.error("Failed to transfer kid", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
        <KidListGrid
          kids={kids}
          onEdit={handleEditKid}
          onTransfer={handleTransferClick}
          onDelete={handleDeleteClick}
          actions={{ edit: true, delete: true, transfer: true }}
          linkToProfile={false}
          onCardClick={handleCardClick}
        />
      </div>

      <KidProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        kidId={selectedKid?.id}
        kid={selectedKid}
      />

      <EditKidModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        kid={selectedKid}
        onSaved={onSaved}
        loading={loading}
        showExtendedFields={true}
      />

      <TransferKidModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        kid={selectedKid}
        onTransfer={handleTransferConfirm}
        loading={loading}
      />

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-red-500/20 backdrop-blur sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300">
              <Trash2 size={24} />
            </div>

            <h3 className="text-2xl font-bold text-white">
              Delete Kid Profile?
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">{selectedKid?.name}</span>?
              This action cannot be undone and will remove all their data.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Profile"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
