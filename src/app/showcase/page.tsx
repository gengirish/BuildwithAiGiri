"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types";

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

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <Rocket className="h-16 w-16 text-cyan-400/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3 font-[var(--font-space)]">
              The Journey Begins Soon
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Week 1 is underway! Projects will appear here as they&apos;re
              completed. Check back soon to see the first MVP.
            </p>
            <Link
              href="/submit"
              className="inline-flex rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400 transition-colors"
            >
              Submit Your Idea
            </Link>
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
