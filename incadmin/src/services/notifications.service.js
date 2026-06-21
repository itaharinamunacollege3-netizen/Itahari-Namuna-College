import { apiRequest, buildQuery } from "./apiClient";

export async function listNotifications(params) {
  return apiRequest(`/admin/notifications${buildQuery(params ?? {})}`);
}

export async function getUnreadCount() {
  const { data } = await apiRequest("/admin/notifications/unread-count");
  return data.count;
}

export async function getUnreadBreakdown() {
  const { data } = await apiRequest("/admin/notifications/unread-breakdown");
  return {
    total: data?.total ?? 0,
    admissions: data?.admissions ?? 0,
    contacts: data?.contacts ?? 0,
  };
}

export async function markNotificationRead(id) {
  return apiRequest(`/admin/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  return apiRequest("/admin/notifications/read-all", { method: "PATCH" });
}

export async function deleteNotification(id) {
  return apiRequest(`/admin/notifications/${id}`, { method: "DELETE" });
}
