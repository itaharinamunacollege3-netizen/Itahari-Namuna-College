import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export async function writeAuditLog(params: { // write the audit log
  userId?: number;
  action: string;
  resource?: string;
  resourceId?: number;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}) { // write the audit log
  await prisma.auditLog.create({ // create the audit log
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
