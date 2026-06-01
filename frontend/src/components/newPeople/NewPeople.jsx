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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8">
          <div>
            <div className="mb-4 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              ✨ New People Follow Up
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Manage{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                New People
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Track first and second follow-up calls, record feedback, and help
              new people stay connected.
            </p>
          </div>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Total New People</p>
            <h3 className="mt-2 text-3xl font-bold text-white">
              {kids.length}
            </h3>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">First Calls Done</p>
            <h3 className="mt-2 text-3xl font-bold text-green-400">
              {kids.filter((k) => k.first_call).length}
            </h3>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Second Calls Done</p>
            <h3 className="mt-2 text-3xl font-bold text-indigo-400">
              {kids.filter((k) => k.second_call).length}
            </h3>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
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
    </div>
  );
}
