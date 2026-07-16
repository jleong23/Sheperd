import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaders } from "../../api/pastor.js";
import { Users, Mail, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PastorDashboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const data = await getLeaders();
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaders:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-12">
      <section className="mx-auto max-w-6xl">
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Pastor Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Monitor leaders, track attendance, and oversee pastoral care across
            your community.
          </p>
        </header>

        {leaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No leaders found
            </h3>
            <p className="mt-2 text-slate-500">
              When you add leaders, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.leader_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/pastor/leaders/${leader.leader_id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl hover:ring-indigo-500/30"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Users size={24} />
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Leader
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600">
                    {leader.user_name}
                  </h2>

                  <div className="mt-4 space-y-3 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Mail size={16} className="text-slate-400" />
                      <span className="truncate">{leader.email}</span>
                    </div>

                    {leader.group_graduation_year && (
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <GraduationCap size={16} className="text-slate-400" />
                        <span>Graduation: {leader.group_graduation_year}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center font-bold text-indigo-600">
                    <span>View Stats</span>
                    <ChevronRight
                      size={18}
                      className="ml-1 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
