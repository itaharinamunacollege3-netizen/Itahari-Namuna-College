import { z } from "zod";

export const admissionSchema = z
  .object({
    fullName: z.string().min(2).max(100),
    email: z.string().email().max(254),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().min(10).max(20),
    address: z.string().min(5).max(500),
    programApplied: z.enum(["plus2", "bca", "bhm", "bsw"]),
    plus2Stream: z.enum(["science", "management", "humanities", "education"]).optional(),
    session: z.string().max(20).optional(),
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

export function mapAdmissionInput(data: z.infer<typeof admissionSchema>) {
  return {
    fullName: data.fullName,
    email: data.email,
    gender: data.gender,
    phone: data.phone,
    address: data.address,
    programApplied: programMap[data.programApplied],
    plus2Stream: data.plus2Stream ? streamMap[data.plus2Stream] : null,
    session: data.session,
  };
}
