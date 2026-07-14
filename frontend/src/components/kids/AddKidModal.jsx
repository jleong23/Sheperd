import { motion } from "framer-motion";
import Modal from "../ui/Modals/Modal";
import KidForm from "./KidForm";

export default function AddKidModal({
  open,
  onClose,
  onAdded,
  loading,
  leaderId,
  showExtendedFields = false,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            👥 New Kid Profile
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight">
            Add Kid{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Details
            </span>
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            {leaderId
              ? "Add a new kid profile directly under this leader's care."
              : "Add basic details so your team can keep track of this person."}
          </p>
        </div>

        <KidForm
          onSubmit={onAdded}
          onCancel={onClose}
          loading={loading}
          submitText="Add Kid"
          showExtendedFields={showExtendedFields}
        />
      </div>
    </Modal>
  );
}
