"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submissionSchema, type SubmissionFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

const roles = [
  "Founder",
  "Co-Founder",
  "CEO",
  "CTO",
  "Product Manager",
  "Developer",
  "Designer",
  "Other",
];

const businessModels = [
  "SaaS (Subscription)",
  "Marketplace",
  "Freemium",
  "One-time Purchase",
  "API / Developer Tool",
  "Not Sure Yet",
];

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass = cn(
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3",
  "text-white placeholder-gray-600",
  "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none",
  "transition-colors",
);

export function IdeaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  async function onSubmit(data: SubmissionFormData) {
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast.error(body?.error || "Submission failed. Please try again.");
        return;
      }

      toast.success(
        "Your idea has been submitted! We'll review it and get back to you soon.",
      );
      reset();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name and Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Full Name"
          error={errors.full_name?.message}
          required
        >
          <input
            {...register("full_name")}
            className={inputClass}
            placeholder="Your full name"
          />
        </FormField>
        <FormField label="Email" error={errors.email?.message} required>
          <input
            {...register("email")}
            type="email"
            className={inputClass}
            placeholder="you@example.com"
          />
        </FormField>
      </div>

      {/* Role and Company row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Your Role" error={errors.role?.message} required>
          <select {...register("role")} className={inputClass}>
            <option value="">Select your role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Company / Organization" error={errors.company?.message}>
          <input
            {...register("company")}
            className={inputClass}
            placeholder="Optional"
          />
        </FormField>
      </div>

      {/* Idea title */}
      <FormField
        label="Idea Title"
        error={errors.idea_title?.message}
        required
      >
        <input
          {...register("idea_title")}
          className={inputClass}
          placeholder="A short, catchy name for your idea"
        />
      </FormField>

      {/* Idea description */}
      <FormField
        label="Describe Your Idea"
        error={errors.idea_description?.message}
        required
      >
        <textarea
          {...register("idea_description")}
          rows={5}
          className={cn(inputClass, "resize-none")}
          placeholder="What problem does it solve? Who is it for? What are the core features?"
        />
      </FormField>

      {/* Target audience and business model row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Target Audience" error={errors.target_audience?.message}>
          <input
            {...register("target_audience")}
            className={inputClass}
            placeholder="e.g., Small business owners, developers..."
          />
        </FormField>
        <FormField
          label="Business Model"
          error={errors.business_model?.message}
        >
          <select {...register("business_model")} className={inputClass}>
            <option value="">Select a model (optional)</option>
            {businessModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Referral source */}
      <FormField
        label="How did you hear about us?"
        error={errors.referral_source?.message}
      >
        <input
          {...register("referral_source")}
          className={inputClass}
          placeholder="Twitter, LinkedIn, a friend..."
        />
      </FormField>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full rounded-xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-white",
          "hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all glow-cyan glow-cyan-hover",
          "flex items-center justify-center gap-2",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Your Idea"
        )}
      </button>
    </form>
  );
}
