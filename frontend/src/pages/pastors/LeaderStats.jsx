import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getLeaderById,
  getLeaderKids,
  getLeaderAttendance,
  getLeaderCatchups,
} from "../../api/pastor.js";
import LeaderAttendancePanel from "./LeaderAttendancePanel.jsx";

export default function LeaderStats() {
  const { leaderId } = useParams();

  const [leader, setLeader] = useState(null);
  const [kids, setKids] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [catchups, setCatchups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderData() {
      try {
        const [leaderData, kidsData, attendanceData, catchupsData] =
          await Promise.all([
            getLeaderById(leaderId),
            getLeaderKids(leaderId),
            getLeaderAttendance(leaderId),
            getLeaderCatchups(leaderId),
          ]);

        setLeader(leaderData);
        setKids(kidsData);
        setAttendance(attendanceData);
        setCatchups(catchupsData);
      } catch (error) {
        console.error("Error fetching leader stats:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderData();
  }, [leaderId]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading leader stats...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-5xl">
        <Link to="/pastor" className="mb-4 inline-block text-sm text-blue-600">
          ← Back to Pastor Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">
          {leader?.user_name}
        </h1>

        <p className="mb-6 text-sm text-slate-500">{leader?.email}</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Kids</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {kids.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Attendance Records</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {attendance.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Catchups</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {catchups.length}
            </h2>
          </div>
        </div>

        <LeaderAttendancePanel attendance={attendance} />
      </section>
    </main>
  );
}
