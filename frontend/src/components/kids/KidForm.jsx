import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import FormActions from "./FormActions";

export default function KidForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Save Changes",
  showExtendedFields = false,
}) {
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
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };

      setFormData((prev) => ({
        ...prev,
        ...initialData,
        birthday: initialData.birthday ? formatDate(initialData.birthday) : "",
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required.";
    }
    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format.";
    }
    if (formData.parent_phone && !/^\+?[\d\s-]+$/.test(formData.parent_phone)) {
      newErrors.parent_phone = "Invalid parent phone format.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        {showExtendedFields && (
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
        )}

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

        {showExtendedFields && (
          <FormInput
            label="Parent Name"
            name="parentname"
            value={formData.parentname}
            onChange={handleChange}
          />
        )}

        <FormInput
          label="Contact"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <FormInput
          label="Parent Contact"
          name="parent_phone"
          value={formData.parent_phone}
          onChange={handleChange}
          error={errors.parent_phone}
        />

        {showExtendedFields && (
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
        )}
      </div>

      {showExtendedFields && (
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
      )}

      <FormActions
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
        loading={loading}
        submitText={submitText}
      />
    </form>
  );
}
