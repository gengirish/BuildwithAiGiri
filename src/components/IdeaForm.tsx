"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submissionSchema, type SubmissionFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { SubmissionSuccess } from "./SubmissionSuccess";

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
  id,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      {hint && (
        <p className="text-xs text-gray-500 mb-2">{hint}</p>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg bg-white/5 border px-4 py-3",
    "text-white placeholder-gray-600",
    "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none",
    "transition-colors",
    hasError ? "border-red-500/50" : "border-white/10",
  );
}

export function IdeaForm() {
  const [submitted, setSubmitted] = useState<{
    name: string;
    ideaTitle: string;
  } | null>(null);

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

      setSubmitted({ name: data.full_name, ideaTitle: data.idea_title });
      reset();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  }

  if (submitted) {
    return (
      <SubmissionSuccess
        name={submitted.name}
        ideaTitle={submitted.ideaTitle}
        onSubmitAnother={() => setSubmitted(null)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Name and Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Full Name"
          id="full_name"
          error={errors.full_name?.message}
          required
        >
          <input
            id="full_name"
            {...register("full_name")}
            className={inputClass(!!errors.full_name)}
            placeholder="Your full name"
          />
        </FormField>
        <FormField label="Email" id="email" error={errors.email?.message} required>
          <input
            id="email"
            {...register("email")}
            type="email"
            className={inputClass(!!errors.email)}
            placeholder="you@example.com"
          />
        </FormField>
      </div>

      {/* Role and Company row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Your Role" id="role" error={errors.role?.message} required>
          <select id="role" {...register("role")} className={inputClass(!!errors.role)}>
            <option value="" className="bg-zinc-900 text-gray-400">Select your role</option>
            {roles.map((r) => (
              <option key={r} value={r} className="bg-zinc-900 text-white">
                {r}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Company / Organization" id="company" error={errors.company?.message}>
          <input
            id="company"
            {...register("company")}
            className={inputClass(!!errors.company)}
            placeholder="Optional"
          />
        </FormField>
      </div>

      {/* Idea title */}
      <FormField
        label="Idea Title"
        id="idea_title"
        error={errors.idea_title?.message}
        required
      >
        <input
          id="idea_title"
          {...register("idea_title")}
          className={inputClass(!!errors.idea_title)}
          placeholder="A short, catchy name for your idea"
        />
      </FormField>

      {/* Idea description */}
      <FormField
        label="Describe Your Idea"
        id="idea_description"
        error={errors.idea_description?.message}
        required
        hint="Tip: Describe the problem, who has it, and what a solution looks like."
      >
        <textarea
          id="idea_description"
          {...register("idea_description")}
          rows={5}
          className={cn(inputClass(!!errors.idea_description), "resize-none")}
          placeholder="What problem does it solve? Who is it for? What are the core features?"
        />
      </FormField>

      {/* Target audience and business model row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Target Audience" id="target_audience" error={errors.target_audience?.message}>
          <input
            id="target_audience"
            {...register("target_audience")}
            className={inputClass(!!errors.target_audience)}
            placeholder="e.g., Small business owners, developers..."
          />
        </FormField>
        <FormField
          label="Business Model"
          id="business_model"
          error={errors.business_model?.message}
        >
          <select id="business_model" {...register("business_model")} className={inputClass(!!errors.business_model)}>
            <option value="" className="bg-zinc-900 text-gray-400">Select a model (optional)</option>
            {businessModels.map((m) => (
              <option key={m} value={m} className="bg-zinc-900 text-white">
                {m}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Referral source -- collapsed into a small optional row */}
      <div className="pt-2 border-t border-white/5">
        <FormField
          label="How did you hear about us? (optional)"
          id="referral_source"
          error={errors.referral_source?.message}
        >
          <input
            id="referral_source"
            {...register("referral_source")}
            className={inputClass(!!errors.referral_source)}
            placeholder="Twitter, LinkedIn, a friend..."
          />
        </FormField>
      </div>

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
