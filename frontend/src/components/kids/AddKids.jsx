import { useState, useRef, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import FormInput from "./FormInput";
import FormActions from "./FormActions";

const DEFAULT_PHOTO = "https://pngtree.com/so/profile-icon";

export default function AddKids({ onKidAdded }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    school: "",
    phone: "",
    parentPhone: "",
    photo: "",
  });

  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Birthday", name: "birthday", type: "date" },
    { label: "School", name: "school", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Parent Phone", name: "parentPhone", type: "text" },
    { label: "Photo URL (Optional)", name: "photo", type: "text" },
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
      photo: "",
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone format.";
    if (formData.parentPhone && !/^\+?[\d\s-]+$/.test(formData.parentPhone))
      newErrors.parentPhone = "Invalid parent phone format.";
    if (formData.photo && !/^https?:\/\/.+/.test(formData.photo))
      newErrors.photo = "Photo must be a valid URL.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddKid = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          birthday: formData.birthday || null,
          school: formData.school || "",
          phone: formData.phone || "",
          parent_phone: formData.parentPhone || "",
          photo: formData.photo || DEFAULT_PHOTO,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to add kid");
        setLoading(false);
        return;
      }

      onKidAdded?.();
      resetForm();
      setOpen(false);
    } catch {
      alert("Error adding kid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const closeIfOutside = (e) => {
      if (open && modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeIfOutside);
    return () => document.removeEventListener("mousedown", closeIfOutside);
  }, [open]);

  return (
    <div className="text-center">
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-0.5"
      >
        Add New User
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          ref={modalRef}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl transform transition-all duration-300 ease-out scale-100 opacity-100"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Add Kid Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map((f) => (
              <FormInput
                key={f.name}
                label={f.label}
                name={f.name}
                type={f.type}
                value={formData[f.name]}
                onChange={handleChange}
                error={errors[f.name]}
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
    </div>
  );
}
