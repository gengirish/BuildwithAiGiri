"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Github, Linkedin, Globe } from "lucide-react";
import { WeekCounter } from "./WeekCounter";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Movement Has Begun</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-[var(--font-space)] text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            25 MVPs.
            <br />
            25 Weeks.
            <br />
            <span className="gradient-text">Completely Free.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-6">
            SaaS tools, AI-powered apps, dashboards, APIs -- an experienced
            architect with 14+ years wants to build{" "}
            <span className="text-white font-medium">your MVP</span> in one
            week, at zero cost. Submit your idea and let&apos;s create something
            extraordinary.
          </p>

          {/* Founder identity card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm px-5 py-3 mb-8 hover:border-cyan-500/20 transition-all duration-300"
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-60 blur-[2px]" />
              <Image
                src="https://girishbhiremath.vercel.app/_next/image?url=%2Fprofile.jpg&w=256&q=75"
                alt="Girish Hiremath"
                width={44}
                height={44}
                className="relative rounded-full ring-2 ring-white/10"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white leading-tight">
                Girish Hiremath
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Software Architect &middot; 14+ yrs
              </p>
            </div>
            <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-4">
              {[
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/girish-b-hiremath/",
                  label: "LinkedIn",
                },
                {
                  icon: Github,
                  href: "https://github.com/gengirish",
                  label: "GitHub",
                },
                {
                  icon: Globe,
                  href: "https://girishbhiremath.vercel.app",
                  label: "Portfolio",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Week counter / progress bar */}
          <WeekCounter />

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              href="/submit"
              className="group flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-white hover:bg-cyan-400 transition-all glow-cyan glow-cyan-hover"
            >
              Submit Your Idea
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-xl bg-white/5 px-8 py-4 text-lg font-semibold text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
            >
              How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
