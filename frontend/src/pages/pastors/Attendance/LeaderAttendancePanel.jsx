import { useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import ExportAttendance from "../../../components/attendance/ExportAttendance.jsx";
// TODO: fix this path once confirmed — should point at your api/attendance.js
import { updateAttendance } from "../../../api/attendance.js";

function normalizeStatus(status) {
  return status?.toLowerCase().trim().replace(/\s+/g, "");
}

const STATUS_STYLES = {
  coming: "bg-emerald-50 text-emerald-700 border-emerald-200",
  maybe: "bg-amber-50 text-amber-700 border-amber-200",
  "not coming": "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_LABELS = {
  coming: "Coming",
  maybe: "Maybe",
  "not coming": "Not coming",
};

function AttendanceRow({ record, onSaved }) {
  const [status, setStatus] = useState(record.status || "maybe");
  const [reason, setReason] = useState(record.reason || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingReason, setSavingReason] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const previous = status;
    setStatus(newStatus);
    setSavingStatus(true);

    try {
      const updated = await updateAttendance(record.id, { status: newStatus });
      onSaved({ ...record, ...updated });
    } catch (err) {
      console.error("Failed to update status:", err);
      setStatus(previous);
      toast.error("Couldn't update status. Try again.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleReasonBlur = async () => {
    if (reason === (record.reason || "")) return;

    setSavingReason(true);
    try {
      const updated = await updateAttendance(record.id, { reason });
      onSaved({ ...record, ...updated });
    } catch (err) {
      console.error("Failed to update reason:", err);
      setReason(record.reason || "");
      toast.error("Couldn't update reason. Try again.");
    } finally {
      setSavingReason(false);
    }
  };

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/50">
      <td className="px-5 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">
        {record.name}
      </td>
      <td className="px-5 py-3">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={savingStatus}
          className={`text-xs font-bold rounded-full border px-3 py-1.5 outline-none cursor-pointer transition-opacity ${STATUS_STYLES[normalizeStatus(status) === "notcoming" ? "not coming" : status] || STATUS_STYLES.maybe} ${savingStatus ? "opacity-50" : ""}`}
        >
          <option value="coming">Coming</option>
          <option value="maybe">Maybe</option>
          <option value="not coming">Not coming</option>
        </select>
      </td>
      <td className="px-5 py-3">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={handleReasonBlur}
          disabled={savingReason}
          placeholder="No reason given"
          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-slate-600 placeholder:text-slate-400 outline-none transition-colors hover:border-slate-200 focus:border-indigo-400 focus:bg-white disabled:opacity-50"
        />
      </td>
    </tr>
  );
}

function WeekTable({ records, onRecordSaved }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Reason
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {records.map((record) => (
            <AttendanceRow
              key={record.id}
              record={record}
              onSaved={onRecordSaved}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeaderAttendancePanel({ attendance }) {
  const [localAttendance, setLocalAttendance] = useState(attendance);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [openWeek, setOpenWeek] = useState(null);

  useMemo(() => {
    setLocalAttendance(attendance);
  }, [attendance]);

  const handleRecordSaved = (updatedRecord) => {
    setLocalAttendance((prev) =>
      prev.map((r) =>
        r.id === updatedRecord.id ? { ...r, ...updatedRecord } : r,
      ),
    );
  };

  const availableYears = useMemo(() => {
    return [
      ...new Set(
        localAttendance
          .map((record) => Number(record.attendance_terms?.year ?? record.year))
          .filter(Boolean),
      ),
    ].sort((a, b) => b - a);
  }, [localAttendance]);

  const availableTerms = useMemo(() => {
    if (!selectedYear) return [];
    return [
      ...new Set(
        localAttendance
          .filter(
            (record) =>
              Number(record.attendance_terms?.year ?? record.year) ===
              Number(selectedYear),
          )
          .map((record) =>
            Number(record.attendance_terms?.term ?? record.term),
          ),
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a - b);
  }, [localAttendance, selectedYear]);

  useMemo(() => {
    if (!selectedYear && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useMemo(() => {
    if (!selectedYear || availableTerms.length === 0) return;
    if (!availableTerms.includes(Number(selectedTerm))) {
      setSelectedTerm(availableTerms.at(-1));
    }
  }, [availableTerms, selectedYear, selectedTerm]);

  const filteredAttendance = useMemo(() => {
    if (!selectedYear || !selectedTerm) return [];
    return localAttendance.filter((record) => {
      const recordYear = Number(record.attendance_terms?.year ?? record.year);
      const recordTerm = Number(record.attendance_terms?.term ?? record.term);
      return (
        recordYear === Number(selectedYear) &&
        recordTerm === Number(selectedTerm)
      );
    });
  }, [localAttendance, selectedYear, selectedTerm]);

  const groupedWeeks = useMemo(() => {
    return filteredAttendance.reduce((acc, record) => {
      if (!acc[record.week]) acc[record.week] = [];
      acc[record.week].push(record);
      return acc;
    }, {});
  }, [filteredAttendance]);

  const sortedWeeks = Object.entries(groupedWeeks).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  if (localAttendance.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Calendar size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          No attendance records
        </h3>
        <p className="mt-2 text-slate-500">
          Attendance data will appear here once recorded.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-6 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Attendance Summary
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Termly breakdown of weekly engagement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={selectedYear || ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="">Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedTerm || ""}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
              disabled={!selectedYear}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Term</option>
              {availableTerms.map((term) => (
                <option key={term} value={term}>
                  Term {term}
                </option>
              ))}
            </select>
          </div>

          <ExportAttendance
            attendance={filteredAttendance}
            label="Export Term"
          />
        </div>
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="p-16 text-center">
          <p className="text-slate-500 font-medium">
            No records found for the selected year and term.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sortedWeeks.map(([week, records]) => {
            const isOpen = openWeek === week;

            const coming = records.filter(
              (r) => normalizeStatus(r.status) === "coming",
            );
            const maybe = records.filter(
              (r) => normalizeStatus(r.status) === "maybe",
            );
            const notComing = records.filter(
              (r) => normalizeStatus(r.status) === "notcoming",
            );
            const attendanceRate =
              records.length > 0
                ? Math.round((coming.length / records.length) * 100)
                : 0;

            return (
              <div
                key={week}
                className="transition-colors hover:bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenWeek(isOpen ? null : week)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Week {week}
                      </h3>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {records.length} Students
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs font-bold text-indigo-600">
                          {attendanceRate}% Present
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-full p-2 transition-transform ${isOpen ? "rotate-180 bg-slate-100 text-slate-900" : "text-slate-400"}`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className="bg-slate-50/50 p-6 pt-0">
                    <div className="mb-6 grid gap-4 sm:grid-cols-4">
                      {[
                        {
                          label: "Coming",
                          val: coming.length,
                          color: "text-emerald-600",
                        },
                        {
                          label: "Maybe",
                          val: maybe.length,
                          color: "text-amber-500",
                        },
                        {
                          label: "Not Coming",
                          val: notComing.length,
                          color: "text-rose-500",
                        },
                        {
                          label: "Rate",
                          val: `${attendanceRate}%`,
                          color: "text-slate-900",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {stat.label}
                          </p>
                          <p
                            className={`mt-1 text-2xl font-black ${stat.color}`}
                          >
                            {stat.val}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4 flex">
                      <ExportAttendance
                        attendance={records}
                        label={`Export Week ${week}`}
                      />
                    </div>

                    <WeekTable
                      records={records}
                      onRecordSaved={handleRecordSaved}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
