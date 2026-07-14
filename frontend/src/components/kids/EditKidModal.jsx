import { motion } from "framer-motion";
import Modal from "../ui/Modals/Modal";
import KidForm from "./KidForm";

export default function EditKidModal({
  open,
  onClose,
  kid,
  onSaved,
  loading,
  showExtendedFields = true,
}) {
  if (!kid) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            ✏️ Edit Kid Profile
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Update{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Profile Details
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Keep this kid's information accurate and up to date.
          </p>
        </div>

        <KidForm
          initialData={kid}
          onSubmit={onSaved}
          onCancel={onClose}
          loading={loading}
          submitText="Save Changes"
          showExtendedFields={showExtendedFields}
        />
      </div>
    </Modal>
  );
}
