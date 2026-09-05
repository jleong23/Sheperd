import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AttendanceResult from "../../components/attendance/AttendanceResult.jsx";
import AttendanceSort from "../../components/attendance/AttendanceSort.jsx";
import AttendancePageSkeleton from "./AttendanceSkeleton/AttendancePageSkeleton.jsx";

import {
  addBulkAttendance,
  getAttendance,
  getAttendanceTerms,
  updateAttendance,
} from "../../api/attendance.js";
import { fetchKids } from "../../api/kids.js";

export default function AttendanceList() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [terms, setTerms] = useState([]);
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const fetchAllAttendance = useCallback(async () => {
    try {
      const data = await getAttendance();

      if (!Array.isArray(data)) {
        setAllAttendance([]);
        return [];
      }

      const normalized = data.map((record) => ({
        ...record,
        kidId: record.kidId ?? record.kidid,
      }));

      setAllAttendance(normalized);
      return normalized;
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      toast.error("Failed to load attendance.");
      return [];
    }
  }, []);

  const fetchAllTerms = useCallback(async () => {
    try {
      const data = await getAttendanceTerms();
      const normalized = Array.isArray(data) ? data : [];
      setTerms(normalized);
      return normalized;
    } catch (error) {
      console.error("Failed to fetch attendance terms:", error);
      toast.error("Failed to load attendance terms.");
      return [];
    }
  }, []);

  const refreshPageData = useCallback(async () => {
    const [attendanceData, termsData] = await Promise.all([
      fetchAllAttendance(),
      fetchAllTerms(),
    ]);

    setAllAttendance(Array.isArray(attendanceData) ? attendanceData : []);
    setTerms(Array.isArray(termsData) ? termsData : []);
  }, [fetchAllAttendance, fetchAllTerms]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);

        const [kidsData, attendanceData, termsData] = await Promise.all([
          fetchKids(),
          fetchAllAttendance(),
          fetchAllTerms(),
        ]);

        setKids(Array.isArray(kidsData) ? kidsData : []);
        setAllAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setTerms(Array.isArray(termsData) ? termsData : []);
      } catch (error) {
        console.error("Failed to load attendance page:", error);
        toast.error("Failed to load attendance page.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [fetchAllAttendance, fetchAllTerms]);

  const availableYears = useMemo(() => {
    return [...new Set(terms.map((term) => Number(term.year)).filter(Boolean))]
      .sort((a, b) => b - a);
  }, [terms]);

  const availableTerms = useMemo(() => {
    if (!selectedYear) return [];

    return terms
      .filter((term) => Number(term.year) === Number(selectedYear))
      .sort((a, b) => Number(a.term) - Number(b.term));
  }, [selectedYear, terms]);

  useEffect(() => {
    if (!selectedYear && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (!selectedYear || availableTerms.length === 0) {
      setSelectedTerm(null);
      return;
    }

    if (!selectedTerm || !availableTerms.some((term) => Number(term.id) === Number(selectedTerm))) {
      setSelectedTerm(availableTerms[availableTerms.length - 1]?.id ?? null);
    }
  }, [availableTerms, selectedYear, selectedTerm]);

  const currentAttendance = useMemo(() => {
    if (!selectedYear || !selectedTerm || kids.length === 0) return [];

    return allAttendance
      .filter((record) => {
        const recordTermId = Number(record.term_id ?? record.term);
        if (recordTermId) {
          return recordTermId === Number(selectedTerm);
        }

        return (
          Number(record.year) === Number(selectedYear) &&
          Number(record.term) === Number(selectedTerm)
        );
      })
      .map((record) => {
        const kidId = record.kidId ?? record.kidid;
        const kid = kids.find((item) => Number(item.id) === Number(kidId));

        return {
          ...record,
          kidId,
          name: kid ? kid.name : `Unknown (ID: ${kidId})`,
          photo: kid?.photo ?? null,
        };
      })
      .sort((a, b) => Number(b.week) - Number(a.week));
  }, [allAttendance, kids, selectedYear, selectedTerm]);

  const updateAttendanceRecord = useCallback(
    (updatedRecord) => {
      const kidId = updatedRecord.kidId ?? updatedRecord.kidid;
      const kid = kids.find((item) => Number(item.id) === Number(kidId));

      const fullRecord = {
        ...updatedRecord,
        kidId,
        name: kid ? kid.name : `Unknown (ID: ${kidId})`,
        photo: kid?.photo ?? null,
      };

      setAllAttendance((prev) =>
        prev.map((record) =>
          record.id === fullRecord.id ? fullRecord : record,
        ),
      );
    },
    [kids],
  );

  const handleStatusChange = async (recordId, newStatus) => {
    const previousRecord = currentAttendance.find(
      (record) => record.id === recordId,
    );

    if (!previousRecord) return;

    updateAttendanceRecord({
      ...previousRecord,
      status: newStatus,
    });

    try {
      await updateAttendance(recordId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update attendance status:", error);
      updateAttendanceRecord(previousRecord);
      toast.error("Failed to update attendance status.");
    }
  };

  const handleReasonChange = (recordId, reason) => {
    setAllAttendance((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, reason } : record,
      ),
    );
  };

  const handleReasonSubmit = async (recordId) => {
    const record = currentAttendance.find((item) => item.id === recordId);

    if (!record) return;

    try {
      const updatedRecord = await updateAttendance(recordId, {
        reason: record.reason,
      });

      updateAttendanceRecord(updatedRecord);
      toast.success(`Reason for ${record.name} updated.`);
    } catch (error) {
      console.error("Failed to update reason:", error);
      toast.error("Failed to update reason.");
    }
  };

  const transformImportedRows = (rows) => {
    return rows
      .map((row) => {
        if (!row.name) return null;

        const kid = kids.find(
          (item) =>
            item.name?.trim().toLowerCase() === row.name.trim().toLowerCase(),
        );

        if (!kid) {
          console.warn("Kid not found:", row.name);
          return null;
        }

        const matchedTerm = availableTerms.find(
          (term) =>
            Number(term.year) === Number(row.year) &&
            Number(term.term) === Number(row.term),
        );

        return {
          kidid: kid.id,
          week: Number(row.week),
          term_id: matchedTerm?.id ?? Number(row.term_id ?? row.term),
          status: row.status?.toLowerCase() || "maybe",
          reason: row.reason || "",
        };
      })
      .filter(Boolean);
  };

  const handleImport = async (rows) => {
    try {
      setImporting(true);

      const transformedRows = transformImportedRows(rows);

      if (transformedRows.length === 0) {
        toast.error("No valid attendance rows found.");
        return;
      }

      await addBulkAttendance(transformedRows);
      await fetchAllAttendance();

      toast.success("Attendance imported successfully.");
    } catch (error) {
      console.error("Failed to import attendance:", error);
      toast.error("Failed to import attendance.");
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return <AttendancePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 blur-[120px]" />
      <div className="absolute right-10 top-80 w-96 h-96 bg-purple-500/20 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto">
        <AttendanceSort
          selectedYear={selectedYear}
          selectedTerm={selectedTerm}
          availableYears={availableYears}
          availableTerms={availableTerms}
          onYearChange={setSelectedYear}
          onTermChange={setSelectedTerm}
          hideWeek
          refreshAttendance={refreshPageData}
        />

        {selectedYear && selectedTerm ? (
          currentAttendance.length > 0 ? (
            <AttendanceResult
              currentAttendance={currentAttendance}
              onStatusChange={handleStatusChange}
              onAttendanceUpdate={updateAttendanceRecord}
              onReasonChange={handleReasonChange}
              onReasonSubmit={handleReasonSubmit}
              onImport={handleImport}
              selectedTerm={selectedTerm}
              selectedYear={selectedYear}
              importing={importing}
            />
          ) : (
            <p className="text-center mt-8 text-slate-400">
              No attendance found for selected Year and Term.
            </p>
          )
        ) : (
          <p className="text-center mt-8 text-slate-400">
            Please select Year and Term.
          </p>
        )}
      </div>
    </div>
  );
}
