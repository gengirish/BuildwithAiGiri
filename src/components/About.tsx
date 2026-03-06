"use client";

import { motion } from "framer-motion";
import { Award, Building2, Cpu, Heart } from "lucide-react";

const highlights = [
  {
    icon: Building2,
    label: "14+ Years",
    description: "Enterprise architecture experience",
  },
  {
    icon: Cpu,
    label: "Full-Stack",
    description: "From database to deployment",
  },
  {
    icon: Award,
    label: "Multiple Domains",
    description: "SaaS, fintech, healthcare, and more",
  },
  {
    icon: Heart,
    label: "Zero Cost",
    description: "Completely free, giving back",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Am I Doing <span className="gradient-text">This?</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                After 14 years of building solutions in corporate environments,
                I realized the most exciting projects are the ones that start as
                a spark -- someone&apos;s idea scribbled on a napkin, a problem
                that keeps a founder up at night.
              </p>
              <p>
                <span className="text-white font-medium">
                  BuildwithAiGiri
                </span>{" "}
                is my way of giving back. I want to take{" "}
                <span className="text-cyan-400">25 of those sparks</span> and
                turn them into working software. No fees, no equity, no strings
                attached.
              </p>
              <p>
                You bring the idea and the domain expertise. I bring the
                architecture, code, and a week of relentless building. Together,
                we ship.
              </p>
            </div>
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((h) => (
              <div
                key={h.label}
                className="glass-card p-6 group hover:border-white/20 transition-colors"
              >
                <h.icon className="h-8 w-8 text-cyan-400 mb-3 group-hover:text-cyan-300 transition-colors" />
                <div className="text-xl font-bold text-white font-[var(--font-space)]">
                  {h.label}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {h.description}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
