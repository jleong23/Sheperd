import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchKids } from "../../api/kids";
import { getCatchups } from "../../api/catchups";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CatchupModal } from "../catchups/CatchupModal";

export default function KidProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kid, setKid] = useState(null);
  const [catchups, setCatchups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatchup, setSelectedCatchup] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Kid Details
      const kidsData = await fetchKids();
      const foundKid = kidsData.find((k) => k.id === Number(id));
      setKid(foundKid);

      // 2. Fetch Catchups and Filter by Kid ID
      const res = await getCatchups();
      // Ensure we have an array (handle wrapped response or null)
      const allCatchups = Array.isArray(res) ? res : res?.data || [];
      const kidCatchups = allCatchups.filter(
        (c) => Number(c.kidid) === Number(id)
      );

      // Sort by date (newest first)
      kidCatchups.sort(
        (a, b) => new Date(b.catchupdate) - new Date(a.catchupdate)
      );

      setCatchups(kidCatchups);
    } catch (err) {
      console.error("Failed to load profile data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCatchup(null);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!kid) return <div className="p-6">Kid not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
      >
        &larr; Back
      </button>

      {/* Kid Details Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
            {kid.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kid.name}</h1>
            <p className="text-gray-500">Student Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Date of Birth
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.dateofbirth || "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Grade
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.grade || "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              School
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.school || "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Parent Name
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.parentname || "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Contact
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.parentcontact || "N/A"}
            </span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Address
            </span>
            <span className="block text-gray-900 mt-1">
              {kid.address || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Catchup History List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Catchup History
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            + Add Catchup
          </button>
        </div>

        {catchups.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No catchups recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {catchups.map((catchup) => (
              <div
                key={catchup.catchupid}
                onClick={() => {
                  setSelectedCatchup(catchup);
                  setIsModalOpen(true);
                }}
                className="bg-white border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-blue-600">
                    {catchup.catchuppurpose}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(catchup.catchupdate).toLocaleDateString()}
                  </span>
                </div>
                {catchup.catchupcomments && (
                  <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded text-sm">
                    {catchup.catchupcomments}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catchup Modal */}
      <CatchupModal
        open={isModalOpen}
        catchup={selectedCatchup}
        defaultKidId={Number(id)}
        onClose={handleCloseModal}
        onSaved={() => {
          loadData(); // Refresh list
          handleCloseModal();
        }}
      />
    </div>
  );
}
