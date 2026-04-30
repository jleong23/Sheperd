import React, { useState, useEffect } from "react";
import { fetchNewPeopleKids, updateKid, deleteKid } from "../../api/kids";

import KidCard from "../../components/newPeople/KidCard";
import KidCardSkeleton from "../../components/newPeople/KidCardSkeleton";

export default function NewPeople() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadKids();
  }, []);

  const loadKids = async () => {
    try {
      setLoading(true);
      const data = await fetchNewPeopleKids();
      setKids(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCall = async (kid, field) => {
    const updatedKid = { ...kid, [field]: !kid[field] };

    setKids((prev) => prev.map((k) => (k.id === kid.id ? updatedKid : k)));

    try {
      await updateKid(kid.id, updatedKid);
    } catch (err) {
      setKids((prev) => prev.map((k) => (k.id === kid.id ? kid : k)));
      alert("Failed to update status");
    }
  };

  const handleFeedbackChange = (id, field, value) => {
    setKids((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: value } : k)),
    );
  };

  const handleSaveFeedback = async (kid) => {
    try {
      await updateKid(kid.id, kid);
    } catch {
      alert("Failed to save feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteKid(id);
      setKids((prev) => prev.filter((k) => k.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">New People Follow-up</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <KidCardSkeleton key={i} />)
        ) : kids.length === 0 ? (
          <p>No new people found.</p>
        ) : (
          kids.map((kid) => (
            <KidCard
              key={kid.id}
              kid={kid}
              onToggleCall={handleToggleCall}
              onFeedbackChange={handleFeedbackChange}
              onSave={handleSaveFeedback}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
