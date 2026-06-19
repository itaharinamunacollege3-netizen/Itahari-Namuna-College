import { z } from "zod";

const programApiEnum = z.enum(["plus2", "bca", "bhm", "bsw"]);
const streamApiEnum = z.enum(["science", "management", "humanities", "education"]);
const statusApiEnum = z.enum(["pending", "under_review", "approved", "rejected"]);

export const admissionSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().trim().min(10).max(20),
    address: z.string().trim().min(5).max(500),
    programApplied: programApiEnum,
    plus2Stream: streamApiEnum.optional(),
    session: z.string().trim().max(20).optional(),
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website) {
      ctx.addIssue({ code: "custom", message: "Invalid submission", path: ["website"] });
    }
    if (data.programApplied === "plus2" && !data.plus2Stream) {
      ctx.addIssue({
        code: "custom",
        message: "plus2Stream is required when programApplied is plus2",
        path: ["plus2Stream"],
      });
    }
    if (data.programApplied !== "plus2" && data.plus2Stream) {
      ctx.addIssue({
        code: "custom",
        message: "plus2Stream is only allowed for plus2 program",
        path: ["plus2Stream"],
      });
    }
  });

export const updateAdmissionSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().max(254).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    phone: z.string().trim().min(10).max(20).optional(),
    address: z.string().trim().min(5).max(500).optional(),
    programApplied: programApiEnum.optional(),
    plus2Stream: streamApiEnum.optional(),
    session: z.string().trim().max(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the application",
  });

export const listAdmissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: statusApiEnum.optional(),
  program: programApiEnum.optional(),
  search: z.string().trim().optional(),
});

export const exportAdmissionsQuerySchema = z.object({
  status: statusApiEnum.optional(),
  program: programApiEnum.optional(),
  search: z.string().trim().optional(),
});

export const admissionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateAdmissionStatusSchema = z.object({
  status: statusApiEnum,
  adminNotes: z.string().trim().max(2000).optional(),
});

const programMap = {
  plus2: "PLUS2",
  bca: "BCA",
  bhm: "BHM",
  bsw: "BSW",
} as const;

const streamMap = {
  science: "SCIENCE",
  management: "MANAGEMENT",
  humanities: "HUMANITIES",
  education: "EDUCATION",
} as const;

const statusMap = {
  pending: "PENDING",
  under_review: "UNDER_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
} as const;

export function mapAdmissionInput(data: z.infer<typeof admissionSchema>) {
  const mapped: {
    fullName: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    programApplied: (typeof programMap)[keyof typeof programMap];
    session: string | null;
    plus2Stream?: (typeof streamMap)[keyof typeof streamMap];
  } = {
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    gender: data.gender,
    phone: data.phone,
    address: data.address,
    programApplied: programMap[data.programApplied],
    session: data.session ?? null,
  };

  if (data.programApplied === "plus2" && data.plus2Stream) {
    mapped.plus2Stream = streamMap[data.plus2Stream];
  }

  return mapped;
}

export function mapAdmissionUpdateData(data: z.infer<typeof admissionSchema>) {
  return {
    ...mapAdmissionInput(data),
    plus2Stream:
      data.programApplied === "plus2" && data.plus2Stream
        ? streamMap[data.plus2Stream]
        : null,
  };
}

export function mapStatusInput(status: z.infer<typeof updateAdmissionStatusSchema>["status"]) {
  return statusMap[status];
}

export function mapListFilters(query: z.infer<typeof listAdmissionsQuerySchema>) {
  return {
    page: query.page,
    limit: query.limit,
    status: query.status ? statusMap[query.status] : undefined,
    program: query.program ? programMap[query.program] : undefined,
    search: query.search,
  };
}
