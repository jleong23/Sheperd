import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../../components/ui/Modals/Modal.jsx";
import { updateKidForLeader } from "../../api/pastor.js";
import FormInput from "../../components/kids/FormInput.jsx";
import FormActions from "../../components/kids/FormActions.jsx";

export default function PastorEditKidModal({ open, onClose, kid, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    school: "",
    parentname: "",
    phone: "",
    parent_phone: "",
    address: "",
    status_code: "NP",
    baptised: false,
    sunday_regulars: false,
  });

  useEffect(() => {
    if (kid && open) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };

      setFormData({
        name: kid.name || "",
        birthday: formatDate(kid.birthday),
        school: kid.school || "",
        parentname: kid.parentname || "",
        phone: kid.phone || "",
        parent_phone: kid.parent_phone || "",
        address: kid.address || "",
        status_code: kid.status_code || "NP",
        baptised: kid.baptised ?? false,
        sunday_regulars: kid.sunday_regulars ?? false,
      });
    }
  }, [kid, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateKidForLeader(kid.id, formData);
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update kid", err);
      alert("Failed to update profile. Please check the console for details.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8"
      >
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
            Keep this kid&apos;s information accurate and up to date.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Status Code
              </label>

              <select
                name="status_code"
                value={formData.status_code}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="CORE">Core</option>
                <option value="FRINGE">Fringe</option>
                <option value="NP">New People</option>
              </select>
            </div>

            <FormInput
              label="Date of Birth"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
            />

            <FormInput
              label="School"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />

            <FormInput
              label="Parent Name"
              name="parentname"
              value={formData.parentname}
              onChange={handleChange}
            />

            <FormInput
              label="Contact"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <FormInput
              label="Parent Contact"
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleChange}
            />

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Participation
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900">
                <input
                  type="checkbox"
                  checked={formData.baptised}
                  onChange={(e) =>
                    handleCheckboxChange("baptised", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-slate-700 bg-slate-950 accent-indigo-600"
                />

                <div>
                  <p className="text-sm font-semibold text-white">Baptised</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Has completed water baptism.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900">
                <input
                  type="checkbox"
                  checked={formData.sunday_regulars}
                  onChange={(e) =>
                    handleCheckboxChange("sunday_regulars", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-slate-700 bg-slate-950 accent-indigo-600"
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Sunday Regular
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Attends Sunday services consistently.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <FormActions
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitText="Save Changes"
          />
        </form>
      </motion.div>
    </Modal>
  );
}
