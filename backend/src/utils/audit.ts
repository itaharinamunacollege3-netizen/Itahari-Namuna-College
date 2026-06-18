import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export async function writeAuditLog(params: {
  userId?: number;
  action: string;
  resource?: string;
  resourceId?: number;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      metadata: params.metadata,
      ipAddress: params.ipAddress,
    },
  });
}
