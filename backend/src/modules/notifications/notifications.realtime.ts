import { adminRoom, getIO } from "../../config/socket";
import { SOCKET_EVENTS } from "./notifications.types";
import type { NotificationDto } from "./notifications.types";

export function emitNotificationToUser(userId: number, notification: NotificationDto): void {
  getIO()?.to(adminRoom(userId)).emit(SOCKET_EVENTS.NEW, notification);
}

export function emitUnreadCountToUser(userId: number, count: number): void {
  getIO()?.to(adminRoom(userId)).emit(SOCKET_EVENTS.UNREAD_COUNT, { count });
}

export function emitNotificationReadToUser(userId: number, notificationId: number): void {
  getIO()?.to(adminRoom(userId)).emit(SOCKET_EVENTS.MARKED_READ, { id: notificationId });
}

export function emitAllNotificationsReadToUser(userId: number): void {
  getIO()?.to(adminRoom(userId)).emit(SOCKET_EVENTS.ALL_READ, { count: 0 });
}
