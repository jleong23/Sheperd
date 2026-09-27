const express = require("express");
const router = express.Router();

const supabaseAdmin = require("../lib/supabaseClient");
const {
  getManagedLeaderIds,
  getActiveTerm,
} = require("../lib/attendanceHierarchy");

/**
 * @route GET /leaders
 * @desc Get all leaders
 * @access Pastor only
 */
/**
 * @route GET /leaders
 * @desc Get all leaders
 * @access Pastor only
 */
router.get("/", async (req, res) => {
  try {
    // Verify pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser.role.toLowerCase() !== "pastor") {
      return res.status(403).json({
        error: "Pastor access required",
      });
    }

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);

    if (managedIds.length === 0) {
      return res.json([]);
    }

    const { data: leaders, error } = await supabaseAdmin
      .from("users")
      .select("leader_id,user_name,email,group_graduation_year,role")
      .eq("role", "leader")
      .in("leader_id", managedIds)
      .order("user_name", {
        ascending: true,
      });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.json(leaders);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed fetching leaders",
    });
  }
});

/**
 * @route GET /leaders/ministry-stats
 * @desc Ministry-wide stats across the pastor's managed hierarchy:
 *       total kids, baptised kids, status/year-level breakdowns,
 *       leader count, and current-term attendance rate.
 * @access Pastor only
 */
router.get("/ministry-stats", async (req, res) => {
  try {
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);

    if (managedIds.length === 0) {
      return res.json({
        total_kids: 0,
        baptised_kids: 0,
        status_breakdown: { CORE: 0, FRINGE: 0, NP: 0 },
        year_level_breakdown: {},
        total_leaders: 0,
        attendance: { coming: 0, total: 0, rate: null, term: null },
      });
    }

    const { count: total_kids, error: totalError } = await supabaseAdmin
      .from("kids")
      .select("*", { count: "exact", head: true })
      .in("leader_id", managedIds);
    if (totalError) throw totalError;

    const { count: baptised_kids, error: baptisedError } = await supabaseAdmin
      .from("kids")
      .select("*", { count: "exact", head: true })
      .in("leader_id", managedIds)
      .eq("baptised", true);
    if (baptisedError) throw baptisedError;

    // Status + year-level breakdowns need raw rows (count queries can't group)
    const { data: kidRows, error: kidRowsError } = await supabaseAdmin
      .from("kids")
      .select("status_code, year_level")
      .in("leader_id", managedIds);
    if (kidRowsError) throw kidRowsError;

    const status_breakdown = { CORE: 0, FRINGE: 0, NP: 0 };
    const year_level_breakdown = {};

    kidRows.forEach((kid) => {
      if (kid.status_code && status_breakdown[kid.status_code] !== undefined) {
        status_breakdown[kid.status_code] += 1;
      }
      const yl = kid.year_level ?? "Unassigned";
      year_level_breakdown[yl] = (year_level_breakdown[yl] || 0) + 1;
    });

    const { count: total_leaders, error: leaderCountError } =
      await supabaseAdmin
        .from("users")
        .select("*", { count: "exact", head: true })
        .in("leader_id", managedIds)
        .eq("role", "leader");
    if (leaderCountError) throw leaderCountError;

    // Attendance rate for the current term
    const activeTerm = await getActiveTerm(supabaseAdmin);
    let attendance = { coming: 0, total: 0, rate: null, term: null };

    if (activeTerm) {
      const { data: kidIdsRows, error: kidIdsError } = await supabaseAdmin
        .from("kids")
        .select("id")
        .in("leader_id", managedIds);
      if (kidIdsError) throw kidIdsError;

      const kidIds = kidIdsRows.map((k) => k.id);

      if (kidIds.length > 0) {
        const { count: comingCount, error: comingError } = await supabaseAdmin
          .from("attendance")
          .select("*", { count: "exact", head: true })
          .eq("term_id", activeTerm.id)
          .in("kidid", kidIds)
          .eq("status", "coming");
        if (comingError) throw comingError;

        const { count: totalRecorded, error: totalRecordedError } =
          await supabaseAdmin
            .from("attendance")
            .select("*", { count: "exact", head: true })
            .eq("term_id", activeTerm.id)
            .in("kidid", kidIds);
        if (totalRecordedError) throw totalRecordedError;

        attendance = {
          coming: comingCount || 0,
          total: totalRecorded || 0,
          rate:
            totalRecorded > 0
              ? Math.round((comingCount / totalRecorded) * 1000) / 10
              : null,
          term: { year: activeTerm.year, term: activeTerm.term },
        };
      }
    }

    res.json({
      total_kids: total_kids || 0,
      baptised_kids: baptised_kids || 0,
      status_breakdown,
      year_level_breakdown,
      total_leaders: total_leaders || 0,
      attendance,
    });
  } catch (err) {
    console.error("Error fetching ministry stats:", err);
    res.status(500).json({ error: "Failed to fetch ministry stats" });
  }
});

/**
 * @route GET /leaders/:leaderId/kids
 * @desc Get kids belonging to a specific leader
 * @access Pastor only
 */
router.get("/:leaderId/kids", async (req, res) => {
  try {
    const { leaderId } = req.params;

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    const isAllowed =
      managedIds.includes(Number(leaderId)) || managedIds.includes(leaderId);

    if (!isAllowed) {
      return res.status(403).json({
        error: "You do not have access to this leader",
      });
    }

    const { data: kids, error: kidError } = await supabaseAdmin
      .from("kids")
      .select("*")
      .eq("leader_id", leaderId)
      .order("id");

    if (kidError) {
      return res.status(400).json({
        error: kidError.message,
      });
    }

    res.json(kids);
  } catch (err) {
    console.error("Error fetching leader kids:", err);

    res.status(500).json({
      error: "Failed to fetch leader kids",
    });
  }
});

/**
 * @route GET /leaders/:leaderId/stats
 * @desc Get leader kid statistics
 * @access Pastor only
 */
router.get("/:leaderId/stats", async (req, res) => {
  try {
    const { leaderId } = req.params;

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    const isAllowed =
      managedIds.includes(Number(leaderId)) || managedIds.includes(leaderId);

    if (!isAllowed) {
      return res.status(403).json({
        error: "You do not have access to this leader",
      });
    }

    const { count: total, error: totalError } = await supabaseAdmin
      .from("kids")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("leader_id", leaderId);

    const { count: regular, error: regularError } = await supabaseAdmin
      .from("kids")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("leader_id", leaderId)
      .eq("sunday_regulars", true);

    const { count: baptised, error: baptisedError } = await supabaseAdmin
      .from("kids")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("leader_id", leaderId)
      .eq("baptised", true);

    res.json({
      total_kids: total,
      regular_kids: regular,
      baptised_kids: baptised,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch stats",
    });
  }
});

router.get("/:leaderId/attendance", async (req, res) => {
  try {
    const { leaderId } = req.params;

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    const isAllowed =
      managedIds.includes(Number(leaderId)) || managedIds.includes(leaderId);

    if (!isAllowed) {
      return res.status(403).json({
        error: "You do not have access to this leader",
      });
    }

    const { data: kids, error: kidError } = await supabaseAdmin
      .from("kids")
      .select("id")
      .eq("leader_id", leaderId);

    if (kidError) throw kidError;

    const kidIds = kids.map((k) => k.id);

    if (kidIds.length === 0) {
      return res.json([]);
    }

    const { data, error } = await supabaseAdmin
      .from("attendance")
      .select(`*, attendance_terms(year, term, weeks)`)
      .in("kidid", kidIds);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed fetching attendance",
    });
  }
});

router.get("/:leaderId/catchups", async (req, res) => {
  try {
    const { leaderId } = req.params;

    // Verify caller is a pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // Verify caller manages this leaderId
    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    if (!managedIds.includes(leaderId)) {
      return res
        .status(403)
        .json({ error: "You do not have access to this leader" });
    }

    const { data: kids } = await supabaseAdmin
      .from("kids")
      .select("id")
      .eq("leader_id", leaderId);

    const kidIds = kids.map((k) => k.id);

    if (kidIds.length === 0) {
      return res.json([]);
    }

    const { data, error } = await supabaseAdmin
      .from("catchups")
      .select(
        `
*,
kids(
name,
status_code,
baptised,
sunday_regulars
)
`,
      )
      .in("kidid", kidIds)
      .order("catchupdate", {
        ascending: false,
      });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed fetching catchups",
    });
  }
});

router.get("/:leaderId", async (req, res) => {
  try {
    const { leaderId } = req.params;

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    const isAllowed =
      managedIds.includes(Number(leaderId)) || managedIds.includes(leaderId);

    if (!isAllowed) {
      return res.status(403).json({
        error: "You do not have access to this leader",
      });
    }

    // Fetch leader
    const { data: leader, error: leaderError } = await supabaseAdmin
      .from("users")
      .select("leader_id,user_name,email,role")
      .eq("leader_id", leaderId)
      .single();

    if (leaderError) {
      return res.status(404).json({
        error: "Leader not found",
      });
    }

    res.json(leader);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch leader",
    });
  }
});

router.post("/:leaderId/kids", async (req, res) => {
  try {
    const { leaderId } = req.params;

    // Verify caller is a pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // Verify caller manages this leaderId
    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    if (!managedIds.includes(leaderId)) {
      return res.status(403).json({ error: "You do not manage this leader" });
    }

    const { data, error } = await supabaseAdmin
      .from("kids")
      .insert([{ ...req.body, leader_id: leaderId }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/kids/:kidId/transfer", async (req, res) => {
  try {
    const { kidId } = req.params;
    const { newLeaderId } = req.body;

    if (!newLeaderId) {
      return res.status(400).json({ error: "newLeaderId is required" });
    }

    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    const { data: kidRecord, error: kidError } = await supabaseAdmin
      .from("kids")
      .select("leader_id")
      .eq("id", kidId)
      .single();

    if (kidError || !kidRecord) {
      return res.status(404).json({ error: "Kid not found" });
    }

    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);

    if (!managedIds.includes(kidRecord.leader_id)) {
      return res
        .status(403)
        .json({ error: "You do not have access to this kid" });
    }

    if (!managedIds.includes(newLeaderId)) {
      return res
        .status(403)
        .json({ error: "You do not manage the destination leader" });
    }

    const { data, error } = await supabaseAdmin
      .from("kids")
      .update({ leader_id: newLeaderId })
      .eq("id", kidId)
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from("catchups")
      .update({ leader_id: newLeaderId })
      .eq("kidid", kidId);

    // NEW: keep attendance.leader_id in sync too
    const { error: attendanceError } = await supabaseAdmin
      .from("attendance")
      .update({ leader_id: newLeaderId })
      .eq("kidid", kidId);

    if (attendanceError) throw attendanceError;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/kids/:kidId", async (req, res) => {
  try {
    const { kidId } = req.params;

    // Verify caller is a pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // Look up which leader actually owns this kid
    const { data: kidRecord, error: kidError } = await supabaseAdmin
      .from("kids")
      .select("leader_id")
      .eq("id", kidId)
      .single();

    if (kidError || !kidRecord) {
      return res.status(404).json({ error: "Kid not found" });
    }

    // Verify caller manages the leader who owns this kid
    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    if (!managedIds.includes(kidRecord.leader_id)) {
      return res
        .status(403)
        .json({ error: "You do not have access to this kid" });
    }

    const { data, error } = await supabaseAdmin
      .from("kids")
      .update(req.body)
      .eq("id", kidId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:leaderId/catchups", async (req, res) => {
  try {
    const { leaderId } = req.params;

    // Verify caller is a pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // Verify caller manages this leaderId
    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    if (!managedIds.includes(leaderId)) {
      return res
        .status(403)
        .json({ error: "You do not have access to this leader" });
    }

    const { data, error } = await supabaseAdmin
      .from("catchups")
      .insert([
        {
          ...req.body,
          leader_id: leaderId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.put("/:leaderId/catchups/:catchupId", async (req, res) => {
  try {
    const { leaderId, catchupId } = req.params;

    // Verify caller is a pastor
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("leader_id", req.userId)
      .single();

    if (userError || currentUser?.role?.toLowerCase() !== "pastor") {
      return res.status(403).json({ error: "Pastor access required" });
    }

    // Verify caller manages this leaderId
    const managedIds = await getManagedLeaderIds(supabaseAdmin, req.userId);
    if (!managedIds.includes(leaderId)) {
      return res
        .status(403)
        .json({ error: "You do not have access to this leader" });
    }

    const { data, error } = await supabaseAdmin
      .from("catchups")
      .update(req.body)
      .eq("catchupid", catchupId)
      .eq("leader_id", leaderId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
