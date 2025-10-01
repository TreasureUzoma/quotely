import z from "zod";

export const createNotesSchema = z.object({
  content: z.string().min(4, "Notes must be between 3 to ").max(160),
  bgColor: z.string("Invalid Color").min(3).max(15),
});

export const updateNotesSchema = z.object({
  content: z.string().min(4, "Notes must be between 3 to ").max(160),
  bgColor: z.string("Invalid Color").min(3).max(15),
  id: z.uuid(),
});

export const uuidSchema = z.object({
  id: z.uuid(),
});

export const getAllNotesSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((n) => !isNaN(n) && n > 0, {
      message: "Page must be a positive number",
    })
    .default(1),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((n) => !isNaN(n) && n > 0 && n <= 100, {
      message: "Limit must be 1-100",
    })
    .default(10),
});
