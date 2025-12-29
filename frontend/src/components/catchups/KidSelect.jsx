export function KidSelect({ kids, value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      className="w-full border rounded p-2"
    >
      <option value="">Select a kid</option>
      {kids.map((kid) => (
        <option key={kid.id} value={kid.id}>
          {kid.name}
        </option>
      ))}
    </select>
  );
}
