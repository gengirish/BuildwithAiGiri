"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types";

const totalWeeks = 25;
const currentWeek = 0;

function WeekSlot({
  week,
  status,
}: {
  week: number;
  status: "current" | "upcoming" | "done";
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
        status === "current"
          ? "border-cyan-500/30 bg-cyan-500/5"
          : status === "done"
            ? "border-green-500/20 bg-green-500/5"
            : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold font-[var(--font-space)] ${
          status === "current"
            ? "bg-cyan-500/20 text-cyan-400"
            : status === "done"
              ? "bg-green-500/20 text-green-400"
              : "bg-white/5 text-gray-600"
        }`}
      >
        {week}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            status === "current"
              ? "text-cyan-400"
              : status === "done"
                ? "text-green-400"
                : "text-gray-500"
          }`}
        >
          {status === "current"
            ? "Accepting Ideas"
            : status === "done"
              ? "Completed"
              : "Open Slot"}
        </p>
      </div>
      {status === "current" && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
        </span>
      )}
    </div>
  );
}

export default function ShowcasePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen pt-24 pb-16">
      <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
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
          className="mb-12"
        >
          <h1 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Project <span className="gradient-text">Showcase</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Every week, a new MVP joins the portfolio. Explore what we&apos;ve
            built together.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-48 animate-pulse bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty / coming-soon state */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Coming soon banner */}
            <div className="glass-card p-8 sm:p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Rocket className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-[var(--font-space)]">
                Coming Soon
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-2">
                The 25-week build journey is about to begin. Each week, a new
                MVP will be showcased here with full details, tech stack, and
                links.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-cyan-400 mt-2">
                <Sparkles className="h-3.5 w-3.5" />
                Week 0 — Accepting ideas now
              </div>
            </div>

            {/* Timeline grid */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-300">
                  25-Week Roadmap
                </h4>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.min(totalWeeks, 9) }, (_, i) => (
                  <WeekSlot
                    key={i}
                    week={i + 1}
                    status={
                      i + 1 <= currentWeek
                        ? "done"
                        : i + 1 === currentWeek + 1
                          ? "current"
                          : "upcoming"
                    }
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                <span>
                  + {totalWeeks - 9} more weeks to go
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="text-center pt-4">
              <Link
                href="/submit"
                className="inline-flex rounded-xl bg-cyan-500 px-8 py-3.5 font-semibold text-white hover:bg-cyan-400 transition-colors glow-cyan glow-cyan-hover"
              >
                Submit Your Idea for Week 1
              </Link>
            </div>
          </motion.div>
        )}

        {/* Project grid */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
