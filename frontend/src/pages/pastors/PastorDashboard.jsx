import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaders } from "../../api/pastor.js";

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
    return <p className="p-6 text-gray-500">Loading leaders...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Pastor Dashboard
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          View leaders, their kids, attendance records, and catchup statistics.
        </p>

        {leaders.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="text-slate-500">No leaders found.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader) => (
              <Link
                key={leader.id}
                to={`/pastor/leaders/${leader.leader_id}`}
                className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {leader.user_name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">{leader.email}</p>

                {leader.group_graduation_year && (
                  <p className="mt-2 text-sm text-slate-600">
                    Graduation Year: {leader.group_graduation_year}
                  </p>
                )}

                <p className="mt-4 text-sm font-medium text-blue-600">
                  View stats →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
