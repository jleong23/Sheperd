import Modal from "../ui/Modals/Modal";
import KidProfile from "./KidProfile";

export default function KidProfileModal({ open, onClose, kidId, kid }) {
  if (!kidId && !kid) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-4">
        <KidProfile id={kidId || kid?.id} kid={kid} />
      </div>
    </Modal>
  );
}
