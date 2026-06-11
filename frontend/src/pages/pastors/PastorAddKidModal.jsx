import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modals/Modal.jsx";
import FormInput from "../../components/kids/FormInput.jsx";
import FormActions from "../../components/kids/FormActions.jsx";
import { createKidForLeader } from "../../api/pastor";

export default function PastorAddKidModal({ leaderId, onKidAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    school: "",
    phone: "",
    parentPhone: "",
  });

  const [errors, setErrors] = useState({});

  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Birthday", name: "birthday", type: "date" },
    { label: "School", name: "school", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Parent Phone", name: "parentPhone", type: "text" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      birthday: "",
      school: "",
      phone: "",
      parentPhone: "",
    });

    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format.";
    }

    if (formData.parentPhone && !/^\+?[\d\s-]+$/.test(formData.parentPhone)) {
      newErrors.parentPhone = "Invalid parent phone format.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddKid = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await createKidForLeader(leaderId, {
        name: formData.name,
        birthday: formData.birthday || null,
        school: formData.school || "",
        phone: formData.phone || "",
        parent_phone: formData.parentPhone || "",
      });

      toast.success("Kid added to leader successfully.");
      onKidAdded?.();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error adding kid for leader:", err);
      toast.error(err.message || "Error adding kid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
      >
        + Add Kid for Leader
      </motion.button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              👥 Pastor Kid Assignment
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              Add Kid to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Leader
              </span>
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              This kid will be assigned directly to the selected leader.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {inputFields.map((field) => (
              <FormInput
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
              />
            ))}
          </div>

          <FormActions
            onCancel={() => {
              resetForm();
              setOpen(false);
            }}
            onSubmit={handleAddKid}
            loading={loading}
            submitText="Add Kid"
          />
        </div>
      </Modal>
    </>
  );
}
