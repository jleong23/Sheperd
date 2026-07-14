import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LeaderAttendancePanel from "./Attendance/LeaderAttendancePanel.jsx";
import LeaderKidsPanel from "./Statistics/LeaderKidsPanel.jsx";
import AddKidModal from "../../components/kids/AddKidModal.jsx";
import TransferKidModal from "../../components/kids/TransferKidModal.jsx";
import LeaderCatchupPanel from "./Catchups/LeaderCatchupPanel.jsx";
import {
  getLeaderById,
  getLeaderKids,
  getLeaderAttendance,
  getLeaderCatchups,
  createKidForLeader,
  transferKidToLeader,
} from "../../api/pastor.js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function LeaderStats() {
  const { leaderId } = useParams();

  const [leader, setLeader] = useState(null);
  const [kids, setKids] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [catchups, setCatchups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const refreshLeaderCatchups = async () => {
    try {
      const catchupsData = await getLeaderCatchups(leaderId);
      setCatchups(catchupsData);
    } catch (error) {
      console.error("Failed to refresh leader catchups:", error.message);
    }
  };

  const refreshLeaderKids = async () => {
    try {
      const kidsData = await getLeaderKids(leaderId);
      setKids(kidsData);
    } catch (error) {
      console.error("Failed to refresh leader kids:", error.message);
    }
  };

  const handleAddKid = async (formData) => {
    setActionLoading(true);
    try {
      await createKidForLeader(leaderId, {
        name: formData.name,
        birthday: formData.birthday || null,
        school: formData.school || "",
        phone: formData.phone || "",
        parent_phone: formData.parent_phone || "",
      });

      toast.success("Kid added to leader successfully.");
      await refreshLeaderKids();
      setAddModalOpen(false);
    } catch (err) {
      console.error("Error adding kid for leader:", err);
      toast.error(err.message || "Error adding kid.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferConfirm = async (kidId, newLeaderId) => {
    setActionLoading(true);
    try {
      await transferKidToLeader(kidId, newLeaderId);
      toast.success("Kid transferred successfully.");
      await refreshLeaderKids();
      await refreshLeaderCatchups();
    } catch (err) {
      console.error("Failed to transfer kid", err);
      toast.error("Failed to transfer kid.");
    } finally {
      setActionLoading(false);
    }
  };

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

        <motion.button
          onClick={() => setAddModalOpen(true)}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 mt-6"
        >
          + Add Kid for Leader
        </motion.button>

        <LeaderKidsPanel
          kids={kids}
          onKidUpdated={refreshLeaderKids}
          onTransferKid={handleTransferConfirm}
          onKidDeleted={refreshLeaderKids}
        />
        <LeaderCatchupPanel
          catchups={catchups}
          leaderId={leaderId}
          kids={kids}
          onCatchupAdded={refreshLeaderCatchups}
        />

        <AddKidModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdded={handleAddKid}
          loading={actionLoading}
          leaderId={leaderId}
          showExtendedFields={true}
        />
      </section>
    </main>
  );
}
