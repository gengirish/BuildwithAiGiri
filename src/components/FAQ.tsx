"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is this really free? What's the catch?",
    answer:
      "Yes, 100% free. No equity, no fees, no hidden costs. This is a personal mission to give back to the community by helping turn ideas into real products. The only thing I ask is your time for a brainstorming call and your passion for the idea.",
  },
  {
    question: "What kind of ideas are you looking for?",
    answer:
      "I'm looking for SaaS products, subscription-based platforms, marketplaces, or any software idea that can be scoped into a week-long MVP. The idea should solve a real problem and have a clear target audience. I'm open to all domains -- fintech, healthtech, edtech, developer tools, and more.",
  },
  {
    question: "What happens during the brainstorming call?",
    answer:
      "It's a 1-hour call where we dive deep into your idea. We'll define the core features for the MVP, discuss the architecture, identify the target user, and create a game plan for the week. Think of it as a mini product discovery session.",
  },
  {
    question: "What tech stack will be used?",
    answer:
      "I'll choose the best tech stack for your specific project. Common choices include Next.js, React, Python/FastAPI, Supabase, PostgreSQL, and modern AI tools. The goal is to ship fast without sacrificing quality.",
  },
  {
    question: "Who owns the code?",
    answer:
      "You do. After the build week, all code, workflows, and documentation are handed over to you. Projects can be open-source or closed-source -- your choice. I'll also help your team understand the codebase so they can take it forward.",
  },
  {
    question: "What if my idea isn't selected?",
    answer:
      "I can only build one MVP per week for 25 weeks, so not every idea will be selected. Selection is based on feasibility, impact, and alignment with the weekly scope. Even if not selected, I may share feedback or suggestions on your submission.",
  },
  {
    question: "Can I collaborate during the build week?",
    answer:
      "Absolutely! In fact, I encourage it. The more domain expertise and feedback you provide during the week, the better the MVP will be. We'll stay in close communication throughout the process.",
  },
];

function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full text-left glass-card p-6 transition-colors",
        open ? "border-cyan-500/20" : "hover:border-white/20",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180 text-cyan-400",
          )}
        />
      </div>
      <AnimatePresence initial={defaultOpen}>
        {open && (
          <motion.div
            initial={defaultOpen ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about the movement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, idx) => (
            <FAQItem key={faq.question} {...faq} defaultOpen={idx === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
