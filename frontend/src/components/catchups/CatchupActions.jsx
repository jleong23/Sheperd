export function CatchupActions({ isEdit, onDelete, onCancel, onSave }) {
  return (
    <div className="flex justify-end gap-2">
      {isEdit && (
        <button
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
        onClick={onSave}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
