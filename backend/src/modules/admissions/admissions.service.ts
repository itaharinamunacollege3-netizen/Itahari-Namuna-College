import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/apiResponse";
import {
  generateAdmissionAccessToken,
  hashToken,
} from "../../utils/hash";
import {
  formatAdmissionCsvRow,
  formatAdmissionForApi,
  formatAdmissionListItem,
  ADMISSION_CSV_HEADER,
} from "./admissions.formatter";
import {
  admissionSchema,
  mapAdmissionInput,
  mapAdmissionUpdateData,
  mapListFilters,
  mapStatusInput,
  updateAdmissionSchema,
} from "./admissions.schema";
import type { ListAdmissionsParams } from "./admissions.types";
import { z } from "zod";

const EDITABLE_STATUSES = new Set(["PENDING", "UNDER_REVIEW"]);

function buildWhere(filters: ReturnType<typeof mapListFilters>) {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.program) where.programApplied = filters.program;

  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

function assertEditableStatus(status: string) {
  if (!EDITABLE_STATUSES.has(status)) {
    throw new AppError(
      403,
      "This application can no longer be edited. Contact the admissions office for help."
    );
  }
}

function toApiProgram(program: string): "plus2" | "bca" | "bhm" | "bsw" {
  return program.toLowerCase() as "plus2" | "bca" | "bhm" | "bsw";
}

function toApiStream(stream: string | null): "science" | "management" | "humanities" | "education" | undefined {
  if (!stream) return undefined;
  return stream.toLowerCase() as "science" | "management" | "humanities" | "education";
}

export async function createAdmission(data: z.infer<typeof admissionSchema>) {
  const mapped = mapAdmissionInput(data);
  const accessToken = generateAdmissionAccessToken();

  const accessTokenHash = hashToken(accessToken);
  if (!accessTokenHash) {
    throw new AppError(500, "Failed to secure application access token");
  }

  const application = await prisma.admissionApplication.create({
    data: {
      ...mapped,
      accessTokenHash,
    },
  });

  const formatted = formatAdmissionForApi(application);

  return {
    id: formatted.id,
    status: "pending" as const,
    programApplied: formatted.programApplied,
    plus2Stream: formatted.plus2Stream,
    accessToken,
    message:
      "Application submitted. Save your application ID and access token — you will need both to view or correct your submission.",
  };
}

export async function getApplicationById(id: number) {
  const application = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!application) throw new AppError(404, "Application not found");
  return formatAdmissionForApi(application);
}

export async function updateApplicationByApplicant(
  id: number,
  data: z.infer<typeof updateAdmissionSchema>
) {
  const existing = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Application not found");

  assertEditableStatus(existing.status);

  const mergedInput = {
    fullName: data.fullName ?? existing.fullName,
    email: data.email ?? existing.email,
    gender: (data.gender ?? existing.gender) as "male" | "female" | "other",
    phone: data.phone ?? existing.phone,
    address: data.address ?? existing.address,
    programApplied: data.programApplied ?? toApiProgram(existing.programApplied),
    plus2Stream:
      data.plus2Stream ??
      (existing.plus2Stream ? toApiStream(existing.plus2Stream) : undefined),
    session: data.session ?? existing.session ?? undefined,
  };

  const validated = admissionSchema.parse(mergedInput);
  const mapped = mapAdmissionUpdateData(validated);

  const application = await prisma.admissionApplication.update({
    where: { id },
    data: mapped,
  });

  return formatAdmissionForApi(application);
}

export async function listAdmissions(params: ListAdmissionsParams = {}) {
  const filters = mapListFilters({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    program: params.program,
    search: params.search,
  });

  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.admissionApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.admissionApplication.count({ where }),
  ]);

  return {
    items: items.map(formatAdmissionListItem),
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getAdmissionForAdmin(id: number) {
  const application = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!application) throw new AppError(404, "Application not found");
  return formatAdmissionForApi(application);
}

export async function updateAdmissionStatus(
  id: number,
  status: z.infer<typeof import("./admissions.schema").updateAdmissionStatusSchema>["status"],
  adminNotes?: string
) {
  const existing = await prisma.admissionApplication.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Application not found");

  const application = await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: mapStatusInput(status),
      adminNotes: adminNotes ?? existing.adminNotes,
    },
  });

  return formatAdmissionForApi(application);
}

export async function exportAdmissionsCsv(params: Omit<ListAdmissionsParams, "page" | "limit"> = {}) {
  const filters = mapListFilters({ //
    page: 1,
    limit: 100,// maximum number of items to export
    status: params.status, // filter by status
    program: params.program, // filter by program
    search: params.search, // filter by search
  });

  const where = buildWhere(filters); // build the where clause for the query

  const items = await prisma.admissionApplication.findMany({ // find the items
    where,
    orderBy: { createdAt: "desc" },
    take: 10_000, // maximum number of items to export
  });

  const rows = items.map(formatAdmissionCsvRow); // format the items for csv
  return [ADMISSION_CSV_HEADER, ...rows].join("\n"); // return the csv
}
