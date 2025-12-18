export default function DeleteEvent({ eventId, onDeleted }) {
  const handleClick = async (e) => {
    e.stopPropagation(); // <-- prevent parent <li> click
    if (confirm("Are you sure you want to delete this event?")) {
      await onDeleted(eventId);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
    >
      Delete
    </button>
  );
}
