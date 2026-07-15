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
  const response = await api.get("/leaders");
  return response.data;
}

export async function getLeaderById(leaderId) {
  const response = await api.get(`/leaders/${leaderId}`);
  return response.data;
}

export async function getLeaderKids(leaderId) {
  const response = await api.get(`/leaders/${leaderId}/kids`);

  return response.data;
}

export async function getLeaderAttendance(leaderId) {
  const response = await api.get(`/leaders/${leaderId}/attendance`);

  return response.data;
}

export async function getLeaderCatchups(leaderId) {
  const response = await api.get(`/leaders/${leaderId}/catchups`);

  return response.data.map(normalizeCatchup);
}

export async function createKidForLeader(leaderId, kidData) {
  const response = await api.post(`/leaders/${leaderId}/kids`, kidData);

  return response.data;
}

export async function updateKidForLeader(kidId, updates) {
  const response = await api.put(`/leaders/kids/${kidId}`, updates);

  return response.data;
}

export async function transferKidToLeader(kidId, newLeaderId) {
  const response = await api.put(`/leaders/kids/${kidId}/transfer`, {
    newLeaderId,
  });

  return response.data;
}

export async function createCatchupForLeader(leaderId, catchupData) {
  const response = await api.post(
    `/leaders/${leaderId}/catchups`,
    cleanCatchupPayload(catchupData),
  );

  return response.data;
}

export async function updateCatchupForLeader(leaderId, catchupId, updates) {
  const response = await api.put(`/leaders/${leaderId}/catchups/${catchupId}`, {
    ...cleanCatchupPayload(updates),
    updatedate: new Date().toISOString(),
  });

  return response.data;
}

export async function deleteCatchupForLeader(leaderId, catchupId) {
  const response = await api.delete(`/catchups/pastor/${catchupId}`, {
    data: { leaderId },
  });

  return response.data;
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
