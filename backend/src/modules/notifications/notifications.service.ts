import type {
  AdmissionApplication,
  ContactInquiry,
  NotificationType,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import {
  formatNotification,
  mapNotificationTypeToDb,
} from "./notifications.formatter";
import {
  emitAllNotificationsReadToUser,
  emitNotificationReadToUser,
  emitNotificationToUser,
  emitUnreadCountToUser,
} from "./notifications.realtime";
import type {
  CreateNotificationInput,
  ListNotificationsParams,
} from "./notifications.types";

async function getActiveAdminIds(): Promise<number[]> {
  const admins = await prisma.user.findMany({
    where: { role: "admin", isActive: true },
    select: { id: true },
  });
  return admins.map((admin) => admin.id);
}

export async function getUnreadCount(userId: number): Promise<number> {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
      type: {
        in: ["ADMISSION_NEW", "CONTACT_NEW"] as NotificationType[],
      },
    },
  });
}

export async function getUnreadBreakdown(userId: number): Promise<{
  total: number;
  admissions: number;
  contacts: number;
}> {
  const [total, grouped] = await Promise.all([
    getUnreadCount(userId),
    prisma.notification.groupBy({
      by: ["type"],
      where: {
        userId,
        isRead: false,
        type: {
          in: ["ADMISSION_NEW", "CONTACT_NEW"] as NotificationType[],
        },
      },
      _count: { _all: true },
    }),
  ]);

  let admissions = 0;
  let contacts = 0;

  for (const row of grouped) {
    const count = row._count._all;
    if (row.type === "ADMISSION_NEW") {
      admissions += count;
    } else if (row.type === "CONTACT_NEW") {
      contacts += count;
    }
  }

  return { total, admissions, contacts };
}

async function pushRealtime(userId: number, notificationId?: number): Promise<void> {
  const count = await getUnreadCount(userId);
  emitUnreadCountToUser(userId, count);
  if (notificationId) {
    emitNotificationReadToUser(userId, notificationId);
  }
}

export async function createAdminNotifications(input: CreateNotificationInput) {
  const adminIds = await getActiveAdminIds();
  if (adminIds.length === 0) return [];

  const dbType = mapNotificationTypeToDb(input.type);

  const notifications = await prisma.$transaction(
    adminIds.map((userId) =>
      prisma.notification.create({
        data: {
          userId,
          type: dbType,
          title: input.title,
          message: input.message,
          data: (input.data ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      })
    )
  );

  for (const notification of notifications) {
    const dto = formatNotification(notification);
    emitNotificationToUser(notification.userId, dto);
    emitUnreadCountToUser(notification.userId, await getUnreadCount(notification.userId));
  }

  return notifications.map(formatNotification);
}

export async function notifyNewAdmission(application: AdmissionApplication): Promise<void> {
  await createAdminNotifications({
    type: "admission_new",
    title: "New admission application",
    message: `${application.fullName} submitted an application for ${application.programApplied}.`,
    data: {
      resource: "admissions",
      resourceId: application.id,
      link: `/admin/admissions/${application.id}`,
      programApplied: application.programApplied,
      applicantName: application.fullName,
    },
  });
}

export async function notifyNewContact(inquiry: ContactInquiry): Promise<void> {
  await createAdminNotifications({
    type: "contact_new",
    title: "New contact inquiry",
    message: `${inquiry.fullName} sent a message via ${inquiry.department ?? "general"} contact form.`,
    data: {
      resource: "contacts",
      resourceId: inquiry.id,
      link: `/admin/contacts/${inquiry.id}`,
      department: inquiry.department,
      email: inquiry.email,
    },
  });
}

export async function notifyAdmissionStatusChange(
  application: AdmissionApplication,
  previousStatus: string
): Promise<void> {
  if (previousStatus === application.status) return;

  await createAdminNotifications({
    type: "admission_status",
    title: "Admission status updated",
    message: `Application #${application.id} (${application.fullName}) is now ${application.status}.`,
    data: {
      resource: "admissions",
      resourceId: application.id,
      link: `/admin/admissions/${application.id}`,
      status: application.status,
      previousStatus,
    },
  });
}

export async function listNotifications(userId: number, params: ListNotificationsParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const where = {
    userId,
    ...(params.unreadOnly
      ? {
          isRead: false,
          type: {
            in: ["ADMISSION_NEW", "CONTACT_NEW"] as NotificationType[],
          },
        }
      : {}),
  };

  const [items, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    getUnreadCount(userId),
  ]);

  return {
    items: items.map(formatNotification),
    unreadCount,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function markNotificationRead(userId: number, id: number) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!notification) throw new AppError(404, "Notification not found");
  if (notification.isRead) return formatNotification(notification);

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });

  await pushRealtime(userId, id);
  return formatNotification(updated);
}

export async function markAllNotificationsRead(userId: number) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  emitAllNotificationsReadToUser(userId);
  emitUnreadCountToUser(userId, 0);

  return { message: "All notifications marked as read", count: 0 };
}

export async function deleteNotification(userId: number, id: number) {
  const notification = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!notification) throw new AppError(404, "Notification not found");

  await prisma.notification.delete({ where: { id } });
  emitUnreadCountToUser(userId, await getUnreadCount(userId));

  return { message: "Notification deleted" };
}

/** Fire-and-forget helper — never throws to caller */
export function dispatchNotification(task: () => Promise<void>): void {
  task().catch((err) => {
    console.error("[notifications] dispatch failed:", err);
  });
}
