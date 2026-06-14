import { useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import ExportAttendance from "../../../components/attendance/ExportAttendance.jsx";

function normalizeStatus(status) {
  return status?.toLowerCase().trim().replace(/\s+/g, "");
}

function StatusList({ title, records, emptyText }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-bold text-slate-700">{title}</h3>

      {records.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {records.map((record) => (
            <li
              key={record.id}
              className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
            >
              {record.name}
              {record.reason && (
                <p className="mt-1 text-xs text-slate-400">
                  Reason: {record.reason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LeaderAttendancePanel({ attendance }) {
  const [openWeek, setOpenWeek] = useState(null);

  const groupedWeeks = useMemo(() => {
    return attendance.reduce((acc, record) => {
      if (!acc[record.week]) acc[record.week] = [];
      acc[record.week].push(record);
      return acc;
    }, {});
  }, [attendance]);

  const sortedWeeks = Object.entries(groupedWeeks).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  if (attendance.length === 0) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="text-slate-500">No attendance records found.</p>
      </div>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Attendance Summary
          </h2>
          <p className="text-sm text-slate-500">
            Weekly breakdown of coming, maybe, and not coming kids.
          </p>
        </div>

        <ExportAttendance attendance={attendance} label="Export Term" />
      </div>

      {sortedWeeks.map(([week, records]) => {
        const isOpen = openWeek === week;

        const coming = records.filter(
          (record) => normalizeStatus(record.status) === "coming",
        );

        const maybe = records.filter(
          (record) => normalizeStatus(record.status) === "maybe",
        );

        const notComing = records.filter(
          (record) => normalizeStatus(record.status) === "notcoming",
        );

        const attendanceRate =
          records.length > 0
            ? Math.round((coming.length / records.length) * 100)
            : 0;

        return (
          <div key={week} className="border-b border-slate-200 last:border-b-0">
            <button
              onClick={() => setOpenWeek(isOpen ? null : week)}
              className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Calendar size={22} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Week {week}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {records.length} students
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`text-slate-400 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="space-y-5 bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Coming
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      {coming.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Maybe
                    </p>
                    <p className="mt-1 text-2xl font-bold text-yellow-500">
                      {maybe.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Not Coming
                    </p>
                    <p className="mt-1 text-2xl font-bold text-red-500">
                      {notComing.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Attendance Rate
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {attendanceRate}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ExportAttendance
                    attendance={records}
                    label={`Export Week ${week}`}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <StatusList
                    title="Coming"
                    records={coming}
                    emptyText="No kids marked as coming."
                  />

                  <StatusList
                    title="Maybe"
                    records={maybe}
                    emptyText="No kids marked as maybe."
                  />

                  <StatusList
                    title="Not Coming"
                    records={notComing}
                    emptyText="No kids marked as not coming."
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
