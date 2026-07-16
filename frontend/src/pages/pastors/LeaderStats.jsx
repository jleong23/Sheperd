import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LeaderAttendancePanel from "./Attendance/LeaderAttendancePanel.jsx";
import LeaderKidsPanel from "./Statistics/LeaderKidsPanel.jsx";
import AddKidModal from "../../components/kids/AddKidModal.jsx";
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
import { ArrowLeft, Users, Calendar, MessageSquare, Plus } from "lucide-react";

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
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Kids",
      value: kids.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Attendance Records",
      value: attendance.length,
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Catchups",
      value: catchups.length,
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <Link
          to="/pastor"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Dashboard
        </Link>

        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {leader?.user_name}
            </h1>
            <p className="mt-2 text-lg text-slate-500">{leader?.email}</p>
          </div>

          <motion.button
            onClick={() => setAddModalOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300"
          >
            <Plus size={20} />
            Add Kid for Leader
          </motion.button>
        </header>

        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}
              >
                <card.icon size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {card.label}
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-900">
                {card.value}
              </h2>
            </motion.div>
          ))}
        </div>

        <div className="space-y-12">
          <LeaderAttendancePanel attendance={attendance} />

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
        </div>

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
