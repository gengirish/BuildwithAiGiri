"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Lock,
  Unlock,
} from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden group hover:border-white/20 transition-colors"
    >
      {/* Thumbnail area */}
      <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
        <div className="text-6xl font-bold text-white/5 font-[var(--font-space)]">
          W{project.week_number}
        </div>
        <div className="absolute top-3 left-3 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-mono text-cyan-400">
          Week {project.week_number}
        </div>
        <div className="absolute top-3 right-3">
          {project.is_open_source ? (
            <div className="flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-xs text-green-400">
              <Unlock className="h-3 w-3" />
              Open Source
            </div>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 text-xs text-yellow-400">
              <Lock className="h-3 w-3" />
              Private
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 font-[var(--font-space)]">
          {project.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
