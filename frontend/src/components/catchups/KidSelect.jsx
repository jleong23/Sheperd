export function KidSelect({ kids = [], value, onChange, disabled = false }) {
  const isDisabled = disabled;

  return (
    <div className="space-y-2">
      <label
        htmlFor="kid-select"
        className="block text-sm font-medium text-slate-300"
      >
        Kid <span className="text-red-400">*</span>
      </label>

      <select
        id="kid-select"
        value={value || ""}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        className="w-full min-h-[44px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
      >
        <option value="">Select a kid</option>

        {kids.map((kid) => (
          <option key={kid.id} value={kid.id}>
            {kid.name}
          </option>
        ))}
      </select>
    </div>
  );
}
