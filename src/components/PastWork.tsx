"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Bot, FileText, User } from "lucide-react";

const projects = [
  {
    title: "Multi-Agent Deep Research",
    description:
      "AI-powered research system using multiple specialized agents for comprehensive analysis and report generation.",
    tech: ["Python", "LangChain", "Multi-Agent", "AI"],
    icon: Bot,
    link: "https://github.com/gengirish",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
  },
  {
    title: "AI Digital Profile",
    description:
      "Intelligent portfolio platform that generates personalized digital profiles using AI and modern web tech.",
    tech: ["Next.js", "AI", "TypeScript", "Tailwind"],
    icon: User,
    link: "https://girishbhiremath.vercel.app",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Markdown-to-PDF Engine",
    description:
      "Full-featured document pipeline that converts Markdown to beautifully styled PDFs with custom templates.",
    tech: ["Node.js", "PDF", "Markdown", "Templates"],
    icon: FileText,
    link: "https://github.com/gengirish",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/10",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PastWork() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-[var(--font-space)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Previously <span className="gradient-text">Built</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A sample of recent projects. The same engineering rigor goes into
            every BuildwithAiGiri MVP.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.a
              key={project.title}
              variants={item}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-6 group hover:border-white/20 transition-colors block"
            >
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${project.bg} ${project.border} border mb-4`}
              >
                <project.icon className={`h-5 w-5 ${project.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                {project.title}
                <ExternalLink className="h-3.5 w-3.5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Tech logos strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-600"
        >
          <span className="text-gray-500 font-medium">Built with:</span>
          {[
            "React",
            "Next.js",
            "Python",
            "FastAPI",
            "TypeScript",
            "PostgreSQL",
            "Supabase",
            "LangChain",
            "Docker",
          ].map((tech) => (
            <span key={tech} className="text-gray-500 hover:text-gray-300 transition-colors">
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
