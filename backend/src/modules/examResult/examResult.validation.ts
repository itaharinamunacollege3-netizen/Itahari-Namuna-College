import { z } from "zod";

export const createExamSessionSchema = z.object({
  examName: z.string().min(3, "Exam name is required"),
  examType: z.enum(["PLUS2_ENTRANCE", "BACHELOR_ENTRANCE"]),
  program: z.string().min(1, "Program is required"),
  examDate: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
});

export const publishSessionSchema = z.object({
  isPublished: z.boolean(),
});

export const symbolNumberParamSchema = z.object({
  sessionId: z.string().cuid(),
  symbolNumber: z.string().trim().min(1, "Symbol number is required"),
});