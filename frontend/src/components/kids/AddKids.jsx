import { useState } from "react";
import { motion } from "framer-motion";
import Modal from "../ui/Modals/Modal";
import FormInput from "./FormInput";
import FormActions from "./FormActions";
import { createKid } from "../../api/kids";

export default function AddKids({ onKidAdded }) {
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
      await createKid({
        name: formData.name,
        birthday: formData.birthday || null,
        school: formData.school || "",
        phone: formData.phone || "",
        parent_phone: formData.parentPhone,
      });

      onKidAdded?.();
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Error adding kid:", err);
      alert(err.response?.data?.error || "Error adding kid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="max-h-[85vh] w-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl shadow-indigo-500/20 backdrop-blur sm:p-8">
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
              Add basic details so your team can keep track of this person.
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
          />
        </div>
      </Modal>
    </>
  );
}
