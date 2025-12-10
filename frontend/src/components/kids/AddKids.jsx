import { useState } from "react";

const DEFAULT_PHOTO = "https://pngtree.com/so/profile-icon";

export default function AddKids({ onKidAdded }) {
  // Use a single state object for all form fields
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    school: "",
    phone: "",
    parentPhone: "",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleAddKid = async () => {
    if (!formData.name.trim()) return alert("Enter a name");

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
        return;
      }

      alert(`Added kid: ${data.name}`);
      onKidAdded?.();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error adding kid");
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded shadow-md bg-white">
      {[
        { label: "Name", name: "name", type: "text" },
        { label: "Birthday", name: "birthday", type: "date" },
        { label: "School", name: "school", type: "text" },
        { label: "Phone", name: "phone", type: "text" },
        { label: "Parent Phone", name: "parentPhone", type: "text" },
        { label: "Photo URL (optional)", name: "photo", type: "text" },
      ].map(({ label, name, type }) => (
        <input
          key={name}
          type={type}
          name={name}
          placeholder={label}
          value={formData[name]}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded"
        />
      ))}

      <button
        onClick={handleAddKid}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
      >
        Add Kid
      </button>
    </div>
  );
}
