"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Send,
  PhoneCall,
  Code2,
  Package,
} from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Got an Idea?",
    description:
      "You have a SaaS idea, a product vision, or a problem worth solving. That's all you need to start.",
    color: "text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Send,
    title: "Submit It",
    description:
      "Fill out a simple form with your idea details. Tell us about the problem, your audience, and the vision.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
  },
  {
    icon: PhoneCall,
    title: "1-Hour Brainstorm",
    description:
      "If selected, we hop on a call. We'll scope it, define the MVP, and plan the architecture together.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
  },
  {
    icon: Code2,
    title: "We Build It",
    description:
      "One full week of focused development. Real code, real product, shipping-quality MVP.",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/10",
  },
  {
    icon: Package,
    title: "You Own It",
    description:
      "Code, workflows, documentation -- everything is handed over. Your team can take it forward immediately.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From idea to working product in five simple steps. No catch, no
            fees, no strings attached.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-5"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={item}
              className="glass-card p-6 text-center relative group hover:border-white/20 transition-colors"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0a0a0a] border border-white/10 px-3 py-0.5 text-xs text-gray-500 font-mono">
                {String(idx + 1).padStart(2, "0")}
              </div>

              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bg} ${step.border} border mb-4 mt-2`}
              >
                <step.icon className={`h-6 w-6 ${step.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
