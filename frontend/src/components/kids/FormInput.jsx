export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full rounded-xl border
          bg-slate-950
          px-4 py-3
          text-white
          placeholder:text-slate-500
          transition-all duration-200
          outline-none

          ${
            error
              ? "border-red-500 focus:ring-red-500/30"
              : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30"
          }

          focus:ring-2
        `}
      />

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}
    </div>
  );
}
