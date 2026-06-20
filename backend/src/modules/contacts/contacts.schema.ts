import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().max(20).optional(),
  department: z.enum(["admissions", "academic", "admin"]),
  message: z.string().min(5).max(5000),
  website: z.string().max(0).optional(),
});
