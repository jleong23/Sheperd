import { useState } from "react";

export function useBulkDelete(kids, refresh) {
  const [selected, setSelected] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);

  const enterBulkMode = () => {
    setBulkMode(true);
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      setBulkMode(true); // enter bulk mode if none selected
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
      setBulkMode(false); // exit bulk mode after deletion
      refresh();
    } catch (err) {
      console.error(err);
      alert("Error deleting kids");
    }
  };

  // CANCEL selection and revert to normal state
  const cancelSelection = () => {
    setSelected([]);
    setBulkMode(false); // exit bulk mode
  };

  return {
    selected,
    bulkMode,
    toggleSelect,
    handleDelete,
    cancelSelection,
    enterBulkMode,
  };
}
