export default function DeleteCatchup({ catchupId, onDeleted }) {
  const handleClick = async (e) => {
    e.stopPropagation(); // <-- prevent parent <li> click
    if (confirm("Are you sure you want to delete this event?")) {
      await onDeleted(catchupId);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="bg-red-600 px-4 py-2 border rounded text-white  "
    >
      Delete Catchup
    </button>
  );
}
