async function getManagedLeaderIds(supabase, userId) {
  const { data: currentUser, error } = await supabase
    .from("users")
    .select("role, leader_id")
    .eq("leader_id", userId)
    .single();

  if (error || !currentUser) {
    return [userId];
  }

  if (currentUser.role?.toLowerCase() !== "pastor") {
    return [userId];
  }

  const managedIds = new Set([currentUser.leader_id || userId]);
  const queue = [currentUser.leader_id || userId];

  while (queue.length > 0) {
    const currentLeaderId = queue.shift();
    const { data: descendants } = await supabase
      .from("users")
      .select("leader_id")
      .eq("pastor_id", currentLeaderId);

    descendants?.forEach((leader) => {
      if (leader.leader_id && !managedIds.has(leader.leader_id)) {
        managedIds.add(leader.leader_id);
        queue.push(leader.leader_id);
      }
    });
  }

  return Array.from(managedIds);
}

async function getVisibleTermOwners(supabase, userId) {
  const managedIds = await getManagedLeaderIds(supabase, userId);
  const ownerIds = new Set(managedIds);

  if (managedIds.length === 0) {
    return [];
  }

  const queue = [...managedIds];

  while (queue.length > 0) {
    const currentLeaderId = queue.shift();
    const { data: descendants } = await supabase
      .from("users")
      .select("leader_id")
      .eq("pastor_id", currentLeaderId);

    descendants?.forEach((leader) => {
      if (leader.leader_id && !ownerIds.has(leader.leader_id)) {
        ownerIds.add(leader.leader_id);
        queue.push(leader.leader_id);
      }
    });
  }

  return Array.from(ownerIds);
}

async function getVisibleTermCreators(supabase, userId) {
  const { data: currentUser, error } = await supabase
    .from("users")
    .select("role, leader_id, pastor_id")
    .eq("leader_id", userId)
    .single();

  if (error || !currentUser) {
    return [userId];
  }

  // Pastors see terms created by themselves (they're always the creator in this model)
  if (currentUser.role?.toLowerCase() === "pastor") {
    return [userId];
  }

  // Leaders see terms created by their own pastor, plus any they created themselves (legacy/fallback)
  const creators = new Set([userId]);
  if (currentUser.pastor_id) {
    creators.add(currentUser.pastor_id);
  }

  return Array.from(creators);
}

/**
 * Given a term's start_date and total weeks, returns the current week
 * number (1-indexed), clamped to the term's range. Returns null if the
 * term hasn't started yet.
 */
function computeCurrentWeek(startDate, totalWeeks) {
  if (!startDate) return null;

  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null; // term hasn't started yet

  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(week, totalWeeks);
}

/**
 * Finds the term that "today" falls inside, based on start_date + weeks.
 * Since (year, term) is globally unique, there's only ever one active
 * term across the whole org at a time.
 */
async function getActiveTerm(supabase) {
  const { data: terms, error } = await supabase
    .from("attendance_terms")
    .select("*")
    .not("start_date", "is", null)
    .lte("start_date", new Date().toISOString().split("T")[0])
    .order("start_date", { ascending: false });

  if (error || !terms?.length) return null;

  // Find the first term whose window (start_date -> start_date + weeks*7)
  // includes today; terms are already ordered most-recent-start first.
  const today = new Date();
  for (const term of terms) {
    const start = new Date(term.start_date);
    const end = new Date(start);
    end.setDate(end.getDate() + term.weeks * 7);
    if (today < end) return term;
  }

  return null;
}

module.exports = {
  getManagedLeaderIds,
  getVisibleTermOwners,
  getVisibleTermCreators,
  computeCurrentWeek,
  getActiveTerm,
};
