import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";

export async function createContact(data: {
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  message: string;
  website?: string;
}) {
  if (data.website) {
    throw new AppError(400, "Invalid submission");
  }

  return prisma.contactInquiry.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      message: data.message,
    },
  });
}

export async function listContacts(page = 1, limit = 20) {
  const [items, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactInquiry.count(),
  ]);
  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function markRead(id: number) {
  return prisma.contactInquiry.update({ where: { id }, data: { isRead: true } });
}
