import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchKidById } from "../../api/kids";
import { getCatchups } from "../../api/catchups";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CatchupModal } from "../catchups/CatchupModal";
import KidStatusBadge from "../ui/KidStatusBadge";
import KidFlagBadge from "../ui/KidFlagBadge";

export default function KidProfile({ id: propId, kid: propKid }) {
  const { id: paramId } = useParams();
  const location = useLocation();
  const id = propId || paramId;
  const navigate = useNavigate();

  // Prefer propKid, then location.state.kid, then null
  const initialKid = propKid || location.state?.kid || null;

  const [kid, setKid] = useState(initialKid);
  const [catchups, setCatchups] = useState([]);
  const [loading, setLoading] = useState(!initialKid);
  const [loadingCatchups, setLoadingCatchups] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatchup, setSelectedCatchup] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadData = async (forceFetchKid = false) => {
    try {
      if (forceFetchKid || !kid) {
        setLoading(true);
        const kidData = await fetchKidById(id);
        setKid(kidData);
      }
    } catch (err) {
      console.error("Failed to load kid data", err);
    } finally {
      setLoading(false);
    }

    try {
      setLoadingCatchups(true);
      const catchupsResponse = await getCatchups({ kidid: id });
      const kidCatchups = catchupsResponse.data || [];

      kidCatchups.sort(
        (a, b) => new Date(b.catchupdate) - new Date(a.catchupdate),
      );

      setCatchups(kidCatchups);
    } catch (err) {
      console.error("Failed to load catchups", err);
    } finally {
      setLoadingCatchups(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (propKid) {
      setKid(propKid);
      setLoading(false);
    } else if (location.state?.kid) {
      setKid(location.state.kid);
      setLoading(false);
    }
  }, [propKid, location.state?.kid]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCatchup(null);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const details = [
    { label: "Date of Birth", value: formatDate(kid?.birthday), icon: "🎂" },
    { label: "School", value: kid?.school || "N/A", icon: "🏫" },
    { label: "Parent Name", value: kid?.parentname || "N/A", icon: "👨‍👩‍👧" },
    { label: "Contact", value: kid?.phone || "N/A", icon: "📞" },
    { label: "Parent Contact", value: kid?.parent_phone || "N/A", icon: "☎️" },
    { label: "Address", value: kid?.address || "N/A", icon: "📍" },
  ];

  const Skeleton = () => (
    <div className="animate-pulse">
      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-20 w-20 rounded-3xl bg-slate-800" />
            <div className="space-y-3">
              <div className="h-6 w-32 rounded-full bg-slate-800" />
              <div className="h-10 w-64 rounded-xl bg-slate-800" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-800" />
                <div className="h-6 w-20 rounded-full bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-800/50" />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-slate-800" />
            <div className="h-4 w-64 rounded-lg bg-slate-800" />
          </div>
          <div className="h-12 w-32 rounded-full bg-slate-800" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && !kid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (!kid) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
          Kid not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {!propId && (
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="mb-6 rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
          >
            ← Back
          </motion.button>
        )}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-3xl font-extrabold text-white shadow-lg shadow-indigo-500/20">
                {kid.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="mb-3 w-fit rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                  👤 Student Profile
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {kid.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <KidStatusBadge status={kid.status_code} />
                  {kid.baptised && <KidFlagBadge flag="BAPTISED" />}
                  {kid.sunday_regulars && (
                    <KidFlagBadge flag="SUNDAY_REGULAR" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  boxShadow: "0px 0px 24px rgba(99,102,241,0.18)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {item.icon} {item.label}
                </span>
                <span className="mt-2 block break-words text-sm font-semibold text-slate-200">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Catchup History</h2>
              <p className="mt-1 text-sm text-slate-400">
                View and record past follow-ups for this kid.
              </p>
            </div>

            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{
                y: -3,
                scale: 1.03,
                boxShadow: "0px 0px 24px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500"
            >
              + Add Catchup
            </motion.button>
          </div>

          {loadingCatchups ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-800/50" />
              ))}
            </div>
          ) : catchups.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
              <p className="text-lg font-semibold text-white">
                No catchups recorded yet
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Add the first catchup to start tracking pastoral care history.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {catchups.map((catchup) => (
                <motion.div
                  key={catchup.catchupid}
                  onClick={() => {
                    setSelectedCatchup(catchup);
                    setIsModalOpen(true);
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                    boxShadow: "0px 0px 24px rgba(99,102,241,0.2)",
                    borderColor: "rgba(99,102,241,0.55)",
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/50 p-5 transition"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-lg font-bold text-indigo-300">
                      {catchup.catchuppurpose}
                    </h3>

                    <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                      {formatDate(catchup.catchupdate)}
                    </span>
                  </div>

                  {catchup.catchupcomments && (
                    <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm leading-6 text-slate-300">
                      {catchup.catchupcomments}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      <CatchupModal
        open={isModalOpen}
        catchup={selectedCatchup}
        defaultKidId={Number(id)}
        onClose={handleCloseModal}
        onSaved={() => {
          loadData(true);
          handleCloseModal();
        }}
      />
    </div>
  );
}
