"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-8">
            <Rocket className="h-8 w-8 text-cyan-400" />
          </div>

          <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Turn Your Idea
            <br />
            <span className="gradient-text">Into Reality?</span>
          </h2>

          <p className="mx-auto max-w-xl text-lg text-gray-400 mb-10">
            Don&apos;t let your idea stay in your head. Submit it today, and
            let&apos;s build something the world needs -- together.
          </p>

          <Link
            href="/submit"
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-10 py-4 text-lg font-semibold text-white hover:bg-cyan-400 transition-all glow-cyan glow-cyan-hover"
          >
            Submit Your Idea Now
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
