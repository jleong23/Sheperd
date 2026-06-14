import { supabase } from "../supabaseClient";
import api from "./index.js";

function normalizeCatchup(record) {
  return {
    ...record,
    kidName: record.kids?.name,
    kidStatus: record.kids?.status_code,
    kidBaptised: record.kids?.baptised,
    kidSundayRegulars: record.kids?.sunday_regulars,
    catchupstarttime: record.catchupstarttime?.slice(0, 5),
    catchupendtime: record.catchupendtime?.slice(0, 5),
  };
}

function cleanCatchupPayload(payload) {
  return {
    ...payload,
    kidid: Number(payload.kidid),
    catchupstarttime: payload.catchupstarttime || null,
    catchupendtime: payload.catchupendtime || null,
  };
}

export async function getLeaders() {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, user_name, email, group_graduation_year, role")
    .eq("role", "leader")
    .order("user_name", { ascending: true });

  console.log("leaders data:", data);
  console.log("leaders error:", error);

  if (error) throw error;

  return data;
}

export async function getLeaderById(leaderId) {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, user_name, email, group_graduation_year, role")
    .eq("user_id", leaderId)
    .single();

  if (error) throw error;
  return data;
}

export async function getLeaderKids(leaderId) {
  const { data, error } = await supabase
    .from("kids")
    .select("*")
    .eq("user_id", leaderId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getLeaderAttendance(leaderId) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", leaderId);

  if (error) throw error;
  return data;
}

export async function getLeaderCatchups(leaderId) {
  const { data, error } = await supabase
    .from("catchups")
    .select(
      `
      *,
      kids (
        name,
        status_code,
        baptised,
        sunday_regulars
      )
    `,
    )
    .eq("user_id", leaderId)
    .order("catchupdate", { ascending: false });

  if (error) throw error;

  return data.map(normalizeCatchup);
}

export async function createKidForLeader(leaderId, kidData) {
  const { data, error } = await supabase
    .from("kids")
    .insert([
      {
        ...kidData,
        user_id: leaderId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateKidForLeader(kidId, updates) {
  const { data, error } = await supabase
    .from("kids")
    .update(updates)
    .eq("id", kidId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createCatchupForLeader(leaderId, catchupData) {
  const { data, error } = await supabase
    .from("catchups")
    .insert([
      {
        ...cleanCatchupPayload(catchupData),
        user_id: leaderId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCatchupForLeader(leaderId, catchupId, updates) {
  const { data, error } = await supabase
    .from("catchups")
    .update({
      ...cleanCatchupPayload(updates),
      updatedate: new Date().toISOString(),
    })
    .eq("catchupid", catchupId)
    .eq("user_id", leaderId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCatchupForLeader(leaderId, catchupId) {
  const { data, error } = await supabase
    .from("catchups")
    .delete()
    .eq("catchupid", catchupId)
    .eq("user_id", leaderId)
    .select();

  if (error) throw error;

  return data?.[0] || null;
}

export const deleteCatchup = async (id) => {
  try {
    const response = await api.delete(`/catchups/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to delete catchup ${id}:`, err);
    throw err;
  }
};
