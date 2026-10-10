/**
 * AddYearTerm Component
 * ---------------------------------------
 * Admin utility for managing attendance structure:
 * - Create a new academic year
 * - Create a new term under a year
 * - Update an existing term's start date
 * - Delete a term (removes all related attendance records)
 */

import { useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, Plus, Trash2 } from "lucide-react";
import {
  addYear,
  addTerm,
  deleteTerm,
  updateTermStartDate,
} from "../../api/attendance";
import { motion as Motion } from "framer-motion";

const INPUT_CLASS =
  "w-full min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white placeholder:text-slate-500 transition-all [color-scheme:dark] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <section className="space-y-4 px-6 py-6">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function AddYearTerm({
  onUpdate,
  availableYears = [],
  allTerms = [],
}) {
  const latestYear =
    availableYears.length > 0
      ? Math.max(...availableYears)
      : new Date().getFullYear();

  const [year, setYear] = useState(latestYear);
  const [newTerm, setNewTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  const nextYear = latestYear + 1;

  // Existing term matching the year + term inputs (if any)
  const matchedTerm = useMemo(
    () =>
      allTerms.find(
        (t) =>
          Number(t.year) === Number(year) && Number(t.term) === Number(newTerm),
      ),
    [allTerms, year, newTerm],
  );

  const hasTermInput = Boolean(year && newTerm);

  // Shared wrapper: loading state + error handling
  const run = async (task, fallbackMessage) => {
    setLoading(true);
    try {
      await task();
    } catch (err) {
      console.error(fallbackMessage, err);
      alert(err.response?.data?.error || err.message || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddYear = () => {
    if (!startDate) return alert("Please select a start date for Term 1.");
    if (
      !window.confirm(
        `Add year ${nextYear}? Term 1 will start on ${startDate} and attendance will be created for all current kids.`,
      )
    )
      return;

    run(async () => {
      const response = await addYear(nextYear, startDate);
      alert(`Year ${nextYear} added successfully!`);
      onUpdate(response.createdRecords);
    }, "Failed to add year.");
  };

  const handleAddTerm = () => {
    if (!newTerm || isNaN(Number(newTerm)))
      return alert("Please enter a valid term number.");
    if (!startDate) return alert("Please select a start date for the term.");
    if (
      !window.confirm(
        `Add term ${newTerm} to year ${year}, starting ${startDate}?`,
      )
    )
      return;

    run(async () => {
      await addTerm(Number(year), Number(newTerm), startDate);
      alert(`Term ${newTerm} for year ${year} added successfully!`);
      onUpdate();
    }, "Failed to add term.");
  };

  const handleUpdateTermStartDate = () => {
    if (!matchedTerm?.id)
      return alert("No existing term matches the selected year and term.");
    if (!startDate) return alert("Please select a start date for the term.");
    if (matchedTerm.start_date === startDate)
      return alert("The selected term already has this start date.");
    if (
      !window.confirm(
        `Update the start date for Year ${year}, Term ${newTerm} to ${startDate}? This changes the dates shown for all 10 weeks.`,
      )
    )
      return;

    run(async () => {
      await updateTermStartDate(matchedTerm.id, startDate);
      alert(`Start date for Term ${newTerm}, ${year} updated.`);
      onUpdate();
    }, "Failed to update term start date.");
  };

  const handleDeleteTerm = () => {
    if (!matchedTerm?.id) return alert("No matching term found to delete.");
    if (
      !window.confirm(
        `Delete ALL records for Year ${year}, Term ${newTerm}? This cannot be undone.`,
      )
    )
      return;

    run(async () => {
      const response = await deleteTerm(matchedTerm.id);
      alert(response.message || "Term deleted successfully!");
      onUpdate();
    }, "Failed to delete term.");
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-md"
    >
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">
            Years &amp; Terms
          </h2>
          <p className="text-xs text-slate-400">
            Create or adjust the academic calendar. Each term runs for 10 weeks.
          </p>
        </div>
      </header>

      <div className="divide-y divide-white/10">
        {/* Term details */}
        <Section
          title="Term details"
          description="Choose a year and term, then pick the date it starts."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Year">
              <input
                type="number"
                placeholder="e.g. 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Term">
              <input
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Start date">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          {/* Live status */}
          {hasTermInput && (
            <div
              className={`rounded-xl border px-4 py-3 text-xs ${
                matchedTerm
                  ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
                  : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {matchedTerm
                ? `Term ${newTerm}, ${year} already exists${
                    matchedTerm.start_date
                      ? ` and starts on ${matchedTerm.start_date}`
                      : ""
                  }.`
                : `Term ${newTerm}, ${year} doesn't exist yet. It's ready to be created.`}
            </div>
          )}
        </Section>

        {/* Create */}
        <Section
          title="Create"
          description={`Adding a year creates Term 1 using the start date above, with attendance for all current kids.`}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleAddTerm}
              disabled={loading || Boolean(matchedTerm)}
              className={`${BTN_BASE} ${BTN_PRIMARY}`}
            >
              <Plus className="h-4 w-4" />
              Add Term
            </button>
            <button
              onClick={handleAddYear}
              disabled={loading}
              className={`${BTN_BASE} ${BTN_SECONDARY}`}
            >
              <CalendarPlus className="h-4 w-4" />
              Add Year {nextYear}
            </button>
          </div>
        </Section>

        {/* Manage existing */}
        <Section
          title="Manage existing term"
          description="Applies to the year and term selected above."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleUpdateTermStartDate}
              disabled={loading || !matchedTerm}
              className={`${BTN_BASE} ${BTN_SECONDARY}`}
            >
              <CalendarDays className="h-4 w-4" />
              Update Start Date
            </button>
            <button
              onClick={handleDeleteTerm}
              disabled={loading || !matchedTerm}
              className={`${BTN_BASE} ${BTN_DANGER}`}
            >
              <Trash2 className="h-4 w-4" />
              Delete Term
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Deleting a term permanently removes all of its attendance records.
          </p>
        </Section>
      </div>
    </Motion.div>
  );
}

const BTN_BASE =
  "flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

const BTN_PRIMARY =
  "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50";

const BTN_SECONDARY =
  "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20";

const BTN_DANGER =
  "border border-red-400/20 bg-transparent text-red-300 hover:bg-red-500/10 hover:border-red-400/40";
