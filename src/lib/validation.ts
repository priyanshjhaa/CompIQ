import { z } from "zod";

export const currencySchema = z.enum(["USD", "INR"]);
export const marketSchema = z.enum(["Global", "India"]);

export const salaryIngestionSchema = z.object({
  company: z.string().trim().min(2, "Company name is required."),
  role: z.string().trim().min(2, "Role is required."),
  level: z.string().trim().min(1, "Level is required."),
  location: z.string().trim().min(2, "Location is required."),
  market: marketSchema,
  currency: currencySchema,
  base: z.coerce.number().int().positive("Base salary must be greater than zero."),
  bonus: z.coerce.number().int().min(0, "Bonus cannot be negative.").optional().default(0),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative.").optional().default(0),
  yearsExperience: z.coerce
    .number()
    .int()
    .min(0, "Experience cannot be negative."),
});

export const salaryQuerySchema = z.object({
  query: z.string().optional().default(""),
  company: z.string().optional().default(""),
  role: z.string().optional().default(""),
  level: z.string().optional().default(""),
  location: z.string().optional().default(""),
  currency: z.enum(["All", "USD", "INR"]).optional().default("All"),
  market: z.enum(["All", "Global", "India"]).optional().default("All"),
  sort: z.enum(["totalCompUsd", "base", "levelRank", "company"]).optional().default("totalCompUsd"),
});
