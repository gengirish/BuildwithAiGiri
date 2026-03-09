import { z } from "zod";

export const submissionSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  role: z.string().min(1, "Please select your role"),
  company: z.string().optional(),
  idea_title: z.string().min(5, "Title must be at least 5 characters"),
  idea_description: z
    .string()
    .min(20, "Please describe your idea in more detail (at least 20 chars)"),
  target_audience: z.string().optional(),
  business_model: z.string().optional(),
  referral_source: z.string().optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
