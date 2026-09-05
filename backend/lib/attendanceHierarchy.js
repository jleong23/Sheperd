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

module.exports = {
  getManagedLeaderIds,
  getVisibleTermOwners,
  getVisibleTermCreators,
};
