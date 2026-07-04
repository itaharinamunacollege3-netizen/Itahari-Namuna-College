import { apiClient } from '../../../api/apiClient';

export async function getPublishedSessions() {
  try {
    const res = await apiClient.get('/results/sessions');
    return res.data ?? [];
  } catch (error) {
    console.error("Failed to fetch published sessions:", error);
    throw new Error(error.response?.data?.message || "Could not fetch exam sessions");
  }
}

export async function lookupResult(sessionId, symbolNumber) {
  try {
    const res = await apiClient.get(`/results/sessions/${sessionId}/results/${symbolNumber}`);
    return res.data;
  } catch (error) {
    console.error("Failed to lookup result:", error);
    if (error.response?.status === 404) {
      throw new Error("No result found for this symbol number.");
    }
    throw new Error(error.response?.data?.message || "Could not lookup exam result");
  }
}
