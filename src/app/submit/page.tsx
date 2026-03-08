"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import { IdeaForm } from "@/components/IdeaForm";

export default function SubmitPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16">
      {/* Background effects */}
      <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Week 0 of 25 — Now Accepting Ideas</span>
          </div>
          <h1 className="font-[var(--font-space)] text-3xl sm:text-4xl font-bold mb-4">
            Submit Your <span className="gradient-text">Idea</span>
          </h1>
          <p className="text-gray-400 leading-relaxed mb-3">
            Tell us about the product you want to build. Be as detailed as
            possible -- the more context we have, the better we can evaluate
            the fit and scope for a one-week MVP.
          </p>
          <p className="text-sm text-gray-500">
            We review submissions weekly. Expect a response within 48 hours.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 sm:p-8"
        >
          <IdeaForm />
        </motion.div>

        {/* IP / Confidentiality note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex items-start gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-4"
        >
          <Shield className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400 leading-relaxed">
            <span className="text-white font-medium">Your idea stays yours.</span>{" "}
            We sign a simple IP agreement before any build begins. All code and
            assets are handed over to you at the end.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
