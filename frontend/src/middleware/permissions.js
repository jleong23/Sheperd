export async function getManagedLeaderIds(supabase, userId) {
  const { data: user } = await supabase
    .from("users")
    .select("role, leader_id")
    .eq("leader_id", userId)
    .single();

  if (!user) {
    return [];
  }

  if (user.role?.toLowerCase() !== "pastor") {
    return [userId];
  }

  const managedIds = new Set([userId]);
  const queue = [userId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const { data: leaders } = await supabase
      .from("users")
      .select("leader_id")
      .eq("pastor_id", currentId);

    leaders?.forEach((leader) => {
      if (leader.leader_id && !managedIds.has(leader.leader_id)) {
        managedIds.add(leader.leader_id);
        queue.push(leader.leader_id);
      }
    });
  }

  return Array.from(managedIds);
}

export default getManagedLeaderIds;
