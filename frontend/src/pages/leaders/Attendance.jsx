import { useState, useEffect } from "react";
import axios from "axios";
import AttendanceList from "../../components/attendance/AttendanceList.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";
import AddYearTerm from "../../components/attendance/AddYearTerm.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

export default function Attendance() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);

  // -----------------------------
  // Fetch ALL attendance and kids
  // -----------------------------
  const fetchAllAttendance = async (newRecords) => {
    if (newRecords) {
      const normalizedNewRecords = newRecords.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));

      setAllAttendance((prev) => {
        const merged = [...prev, ...normalizedNewRecords];
        const unique = merged.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i,
        );
        return unique;
      });
      return;
    }

    try {
      const res = await axios.get("/attendance");
      const normalized = res.data.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));
      setAllAttendance(normalized);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllAttendance();
      try {
        const res = await axios.get("/kids");
        console.log("Fetched kids:", res.data); // DEBUG
        setKids(res.data);
      } catch (err) {
        console.error("Failed to fetch kids:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // -----------------------------
  // Auto-select latest year
  // -----------------------------
  useEffect(() => {
    if (allAttendance.length > 0 && !selectedYear) {
      const latestYear = Math.max(...allAttendance.map((a) => a.year));
      setSelectedYear(latestYear);
    }
  }, [allAttendance, selectedYear]);

  // -----------------------------
  // Auto-select latest term
  // -----------------------------
  useEffect(() => {
    if (selectedYear) {
      const terms = allAttendance
        .filter((a) => a.year === selectedYear)
        .map((a) => a.term);
      if (terms.length > 0) {
        setSelectedTerm(Math.max(...terms));
      }
    }
  }, [selectedYear]);

  // -----------------------------
  // Filter attendance by year + term
  // -----------------------------
  useEffect(() => {
    // wait until kids are loaded
    if (!selectedYear || !selectedTerm || kids.length === 0) return;

    const filtered = allAttendance
      .filter(
        (a) =>
          a.year === Number(selectedYear) && a.term === Number(selectedTerm),
      )
      .map((record) => {
        const kid = kids.find(
          (k) => Number(k.id) === Number(record.kidId ?? record.kidid),
        );
        return {
          ...record,
          name: kid
            ? kid.name
            : `Unknown (ID: ${record.kidId ?? record.kidid})`,
          photo: kid?.photo ?? null,
        };
      })
      .sort((a, b) => b.week - a.week);

    setCurrentAttendance(filtered);
  }, [selectedYear, selectedTerm, allAttendance, kids]);

  // -----------------------------
  // Toggle Status
  // -----------------------------
  const handleStatusChange = async (recordId, newStatus) => {
    const record = currentAttendance.find((r) => r.id === recordId);
    if (!record) return;

    try {
      const updated = await axios.patch(`/attendance/${recordId}`, {
        status: newStatus,
      });
      updateAttendanceRecord(updated.data);
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  // -----------------------------
  // Reason Handlers
  // -----------------------------
  const handleReasonChange = (recordId, reason) => {
    setCurrentAttendance((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, reason } : r)),
    );
  };

  const handleReasonSubmit = async (recordId) => {
    const record = currentAttendance.find((r) => r.id === recordId);
    if (!record) return;

    try {
      const updated = await axios.patch(`/attendance/${recordId}`, {
        reason: record.reason,
      });
      updateAttendanceRecord(updated.data);
      alert(`Reason for ${record.name} updated!`);
    } catch (err) {
      console.error("Failed to update reason:", err);
      alert("Failed to update reason.");
    }
  };

  // -----------------------------
  // Update attendance record everywhere
  // -----------------------------
  const updateAttendanceRecord = (updatedRecord) => {
    const kidId = updatedRecord.kidid ?? updatedRecord.kidId;
    const kid = kids.find((k) => Number(k.id) === Number(kidId));

    const fullRecord = {
      ...updatedRecord,
      kidId,
      name: kid ? kid.name : `Unknown (ID: ${kidId})`,
      photo: kid?.photo ?? null,
    };

    const updateState = (setter) =>
      setter((prev) =>
        prev.map((r) => (r.id === fullRecord.id ? fullRecord : r)),
      );

    updateState(setAllAttendance);
    updateState(setCurrentAttendance);
  };

  // -----------------------------
  // Dropdown Options
  // -----------------------------
  const availableYears = [...new Set(allAttendance.map((a) => a.year))].sort(
    (a, b) => b - a,
  );

  const availableTerms = selectedYear
    ? [
        ...new Set(
          allAttendance
            .filter((a) => a.year === selectedYear)
            .map((a) => a.term),
        ),
      ].sort((a, b) => a - b)
    : [];

  // -----------------------------
  // Render
  // -----------------------------
  if (loading) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="p-8">
      <AttendanceSort
        selectedYear={selectedYear}
        selectedTerm={selectedTerm}
        availableYears={availableYears}
        availableTerms={availableTerms}
        onYearChange={setSelectedYear}
        onTermChange={setSelectedTerm}
        hideWeek={true}
        refreshAttendance={fetchAllAttendance}
      />

      {selectedYear && selectedTerm ? (
        currentAttendance.length > 0 ? (
          <AttendanceList
            currentAttendance={currentAttendance}
            onStatusChange={handleStatusChange}
            onAttendanceUpdate={updateAttendanceRecord}
            onReasonChange={handleReasonChange}
            onReasonSubmit={handleReasonSubmit}
          />
        ) : (
          <p className="text-center mt-8 text-gray-500">
            No attendance found for selected Year and Term.
          </p>
        )
      ) : (
        <p className="text-center mt-8 text-gray-500">
          Please select Year and Term.
        </p>
      )}
    </div>
  );
}
