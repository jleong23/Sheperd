import { useState, useEffect } from "react";
import axios from "axios";
import AttendanceList from "../../components/attendance/AttendanceList.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";

export default function Attendance() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [kids, setKids] = useState([]);

  // -----------------------------
  // Fetch ALL attendance
  // -----------------------------
  const fetchAllAttendance = (newRecords) => {
    if (newRecords) {
      const normalizedNewRecords = newRecords.map((r) => ({
        ...r,
        kidId: r.kidid ?? r.kidId,
      }));

      setAllAttendance((prev) => {
        const merged = [...prev, ...normalizedNewRecords];
        const unique = merged.filter(
          (v, i, a) => a.findIndex((x) => x.id === v.id) === i
        );
        return unique;
      });
      return;
    }

    axios
      .get("http://localhost:4000/attendance")
      .then((res) => {
        const normalized = res.data.map((r) => ({
          ...r,
          kidId: r.kidid ?? r.kidId,
        }));
        setAllAttendance(normalized);
      })
      .catch((err) => console.error("Failed to fetch attendance:", err));
  };

  // Fetch on load
  useEffect(() => {
    fetchAllAttendance();
    axios
      .get("http://localhost:4000/kids")
      .then((res) => setKids(res.data))
      .catch((err) => console.error("Failed to fetch kids:", err));
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
    if (!selectedYear || !selectedTerm) return;

    const filtered = allAttendance
      .filter(
        (a) =>
          a.year === Number(selectedYear) && a.term === Number(selectedTerm)
      )
      .map((record) => {
        const kid = kids.find((k) => k.id === record.kidId);
        return {
          ...record,
          name: kid ? kid.name : `Unknown (ID: ${record.kidId})`,
          photo: kid?.photo ?? null,
        };
      })
      .sort((a, b) => b.week - a.week);

    setCurrentAttendance(filtered);
  }, [selectedYear, selectedTerm, allAttendance, kids]);

  // -----------------------------
  // Toggle Status
  // -----------------------------
  const handleStatusChange = async (kidId, week) => {
    const record = currentAttendance.find(
      (r) => r.kidId === kidId && r.week === week
    );
    if (!record) return;

    const nextState =
      record.status === "maybe"
        ? "coming"
        : record.status === "coming"
          ? "not coming"
          : "maybe";

    try {
      const updated = await axios.patch(
        `http://localhost:4000/attendance/${record.id}`,
        { status: nextState }
      );

      updateAttendanceRecord(updated.data);
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  };

  // -----------------------------
  // Reason Handlers
  // -----------------------------
  const handleReasonChange = (kidId, week, reason) => {
    setCurrentAttendance((prev) =>
      prev.map((r) =>
        r.kidId === kidId && r.week === week ? { ...r, reason } : r
      )
    );
  };

  const handleReasonSubmit = async (kidId, week) => {
    const record = currentAttendance.find(
      (r) => r.kidId === kidId && r.week === week
    );
    if (!record) return;

    try {
      const updated = await axios.patch(
        `http://localhost:4000/attendance/${record.id}`,
        { reason: record.reason }
      );

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

    const kid = kids.find((k) => k.id === kidId);

    const fullRecord = {
      ...updatedRecord,
      kidId,
      name: kid ? kid.name : `Unknown (ID: ${kidId})`,
      photo: kid?.photo ?? null,
    };

    const updateState = (setter) =>
      setter((prev) =>
        prev.map((r) => (r.id === fullRecord.id ? fullRecord : r))
      );

    updateState(setAllAttendance);
    updateState(setCurrentAttendance);
  };

  // -----------------------------
  // Dropdown Options
  // -----------------------------
  const availableYears = [...new Set(allAttendance.map((a) => a.year))].sort(
    (a, b) => b - a
  );

  const availableTerms = selectedYear
    ? [
        ...new Set(
          allAttendance
            .filter((a) => a.year === selectedYear)
            .map((a) => a.term)
        ),
      ].sort((a, b) => a - b)
    : [];

  // -----------------------------
  // Render
  // -----------------------------
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
