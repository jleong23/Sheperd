import { useState } from "react";
export function useBulkDelete(kids, refresh) {
  const [selected, setSelected] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      setBulkMode(!bulkMode);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selected.length} kids?`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`http://localhost:4000/kids/${id}`, { method: "DELETE" })
        )
      );

      alert(`${selected.length} kids deleted successfully`);
      setSelected([]);
      setBulkMode(false);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting kids");
    }
  };

  return { selected, bulkMode, toggleSelect, handleDelete };
}
