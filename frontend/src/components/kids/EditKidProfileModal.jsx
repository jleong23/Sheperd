import { useState, useEffect } from "react";
import Modal from "../ui/Modals/Modal";
import { updateKid } from "../../api/kids";

export default function EditKidProfileModal({ open, onClose, kid, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    school: "",
    parentname: "",
    phone: "",
    parent_phone: "",
    address: "",
    status_code: "NP",
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
        status_code: kid.status_code || "",
      });
    }
  }, [kid, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting update:", formData);
    try {
      await updateKid(kid.id, formData);
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update kid", err);
      alert("Failed to update profile. Please check the console for details.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Student Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status Code
          </label>
          <select
            name="status_code"
            value={formData.status_code}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="CORE">Core</option>
            <option value="FRINGE">Fringe</option>
            <option value="NP">New People</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            School
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parent Name
          </label>
          <input
            type="text"
            name="parentname"
            value={formData.parentname}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parent Contact
            </label>
            <input
              type="text"
              name="parent_phone"
              value={formData.parent_phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
