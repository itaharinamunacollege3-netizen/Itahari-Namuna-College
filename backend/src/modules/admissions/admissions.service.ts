import { prisma } from "../../config/prisma";
import { mapAdmissionInput, admissionSchema } from "./admissions.schema";
import { z } from "zod";

export async function createAdmission(data: z.infer<typeof admissionSchema>) {
  const mapped = mapAdmissionInput(data);
  return prisma.admissionApplication.create({ data: mapped });
}

export async function listAdmissions(page = 1, limit = 20) {
  const [items, total] = await Promise.all([
    prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.admissionApplication.count(),
  ]);
  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function updateAdmissionStatus(id: number, status: string, adminNotes?: string) {
  return prisma.admissionApplication.update({
    where: { id },
    data: { status: status as "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED", adminNotes },
  });
}
