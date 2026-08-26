import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  company: z.string().trim().min(1, "Company is required"),
  status: z.enum(["active", "inactive"]),
  lastContactDate: z.string().trim().min(1, "Last contact date is required"),
  notes: z.string().trim(),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
