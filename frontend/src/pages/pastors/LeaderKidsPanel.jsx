import { Baby, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import PastorEditKidModal from "./PastorEditKidModal";

function BooleanBadge({ value, trueLabel, falseLabel }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        value ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function StatusBadge({ status }) {
  const statusStyles = {
    NP: "bg-blue-100 text-blue-700",
    CG: "bg-purple-100 text-purple-700",
    FT: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "N/A"}
    </span>
  );
}

export default function LeaderKidsPanel({ kids, onKidUpdated }) {
  const [selectedKid, setSelectedKid] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditKid = (kid) => {
    setSelectedKid(kid);
    setEditOpen(true);
  };

  if (kids.length === 0) {
    return (
      <section className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
        <Baby className="mx-auto mb-3 text-slate-300" size={36} />
        <p className="font-semibold text-slate-700">No kids found</p>
        <p className="text-sm text-slate-400">
          This leader does not have any assigned kids yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Leader Kids</h2>
        <p className="text-sm text-slate-500">
          Kids currently assigned to this leader.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kids.map((kid) => (
          <article
            key={kid.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{kid.name}</h3>
                <p className="text-sm text-slate-500">
                  {kid.school || "No school added"}
                </p>
              </div>
              <button
                onClick={() => handleEditKid(kid)}
                className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-500"
              >
                Edit Kid
              </button>

              <StatusBadge status={kid.status_code} />
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Birthday:</span>{" "}
                {kid.birthday || "Not added"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">Phone:</span>{" "}
                {kid.phone || "Not added"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">Parent:</span>{" "}
                {kid.parentname || "Not added"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">
                  Parent Phone:
                </span>{" "}
                {kid.parent_phone || "Not added"}
              </p>

              <p>
                <span className="font-semibold text-slate-700">Address:</span>{" "}
                {kid.address || "Not added"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <BooleanBadge
                value={kid.baptised}
                trueLabel="Baptised"
                falseLabel="Not Baptised"
              />

              <BooleanBadge
                value={kid.sunday_regulars}
                trueLabel="Sunday Regular"
                falseLabel="Not Regular"
              />
            </div>
          </article>
        ))}
      </div>
      <PastorEditKidModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        kid={selectedKid}
        onSaved={onKidUpdated}
      />
    </section>
  );
}
