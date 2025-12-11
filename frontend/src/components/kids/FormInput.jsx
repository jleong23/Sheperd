export default function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}) {
  return (
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none text-gray-700
          ${error ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-400"}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
