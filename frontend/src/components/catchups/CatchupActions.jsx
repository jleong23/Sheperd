export function CatchupActions({
  isEdit,
  onDelete,
  onCancel,
  onSave,
  onChange,
}) {
  return (
    <div className="flex justify-end gap-2">
      {isEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      )}
      <button onClick={onCancel} className="px-4 py-2 border rounded">
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!onChange}
        className={`px-4 py-2 rounded text-white ${
          onChange
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Save
      </button>
    </div>
  );
}
