export type NotificationTypeApi =
  | "admission_new"
  | "contact_new"
  | "admission_status"
  | "system";

export interface NotificationData {
  resource?: string;
  resourceId?: number;
  link?: string;
  [key: string]: unknown;
}

export interface NotificationDto {
  id: number;
  type: NotificationTypeApi;
  title: string;
  message: string;
  data: NotificationData | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface CreateNotificationInput {
  type: NotificationTypeApi;
  title: string;
  message: string;
  data?: NotificationData;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

/** Socket events — server → client */
export const SOCKET_EVENTS = {
  CONNECTED: "notification:connected",
  NEW: "notification:new",
  UNREAD_COUNT: "notification:unread_count",
  MARKED_READ: "notification:marked_read",
  ALL_READ: "notification:all_read",
} as const;
