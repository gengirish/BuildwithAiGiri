"use client";

import { motion } from "framer-motion";
import {
  Target,
  Users,
  Clock,
  Layers,
  TrendingUp,
} from "lucide-react";

const criteria = [
  {
    icon: Target,
    title: "Clear Problem Statement",
    description: "Your idea solves a specific, well-defined problem that real people or businesses face.",
  },
  {
    icon: Users,
    title: "Defined Target Audience",
    description: "You know who the users are -- whether it's developers, small businesses, creators, or a niche community.",
  },
  {
    icon: Clock,
    title: "Achievable in One Week",
    description: "The core MVP can be scoped to a focused set of features that delivers value in 5-7 days of building.",
  },
  {
    icon: Layers,
    title: "Software / SaaS Focus",
    description: "We build web apps, SaaS tools, APIs, dashboards, and AI-powered products. No hardware or pure content.",
  },
  {
    icon: TrendingUp,
    title: "Growth Potential",
    description: "The idea has legs beyond the MVP -- something that could evolve into a real product or business.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function SelectionCriteria() {
  return (
    <section id="criteria" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            What We&apos;re <span className="gradient-text">Looking For</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Not every idea can be built in a week. Here&apos;s what makes a
            strong submission.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-4"
        >
          {criteria.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              className="glass-card p-5 flex items-start gap-4 group hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                <c.icon className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
