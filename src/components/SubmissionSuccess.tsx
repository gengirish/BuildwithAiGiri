"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: CheckCircle2,
    title: "Idea Received",
    description: "Your submission is safely stored and queued for review.",
    status: "done" as const,
  },
  {
    icon: Clock,
    title: "Under Review",
    description: "We'll evaluate your idea within 48 hours.",
    status: "current" as const,
  },
  {
    icon: MessageSquare,
    title: "Brainstorming Call",
    description: "If selected, we'll invite you for a 1-hour deep dive.",
    status: "upcoming" as const,
  },
  {
    icon: Rocket,
    title: "MVP Build Week",
    description: "One week of focused building — your idea becomes reality.",
    status: "upcoming" as const,
  },
];

export function SubmissionSuccess({
  name,
  ideaTitle,
  onSubmitAnother,
}: {
  name: string;
  ideaTitle: string;
  onSubmitAnother: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20"
      >
        <CheckCircle2 className="h-10 w-10 text-green-400" />
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-[var(--font-space)] text-2xl sm:text-3xl font-bold text-white mb-3">
          You&apos;re In, {name.split(" ")[0]}!
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-2">
          We&apos;ve received{" "}
          <span className="text-cyan-400 font-medium">
            &quot;{ideaTitle}&quot;
          </span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          A confirmation email is on its way to your inbox.
        </p>
      </motion.div>

      {/* Progress timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 sm:p-8 text-left mb-8"
      >
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-6">
          What happens next
        </h3>
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex gap-4">
              {/* Timeline line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    step.status === "done"
                      ? "bg-green-500/10 border-green-500/30"
                      : step.status === "current"
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-white/5 border-white/10"
                  }`}
                >
                  <step.icon
                    className={`h-5 w-5 ${
                      step.status === "done"
                        ? "text-green-400"
                        : step.status === "current"
                          ? "text-cyan-400"
                          : "text-gray-600"
                    }`}
                  />
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-px flex-1 mt-2 ${
                      step.status === "done" ? "bg-green-500/30" : "bg-white/10"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-semibold ${
                      step.status === "upcoming" ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.status === "done" && (
                    <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-400 uppercase">
                      Done
                    </span>
                  )}
                  {step.status === "current" && (
                    <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-400 uppercase">
                      In Progress
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    step.status === "upcoming" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <button
          onClick={onSubmitAnother}
          className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
        >
          Submit Another Idea
        </button>
      </motion.div>
    </motion.div>
  );
}
