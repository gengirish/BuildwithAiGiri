"use client";

import { motion } from "framer-motion";
import { Linkedin, Github, Twitter } from "lucide-react";

const socials = [
  {
    icon: Linkedin,
    label: "Follow on LinkedIn",
    href: "https://www.linkedin.com/in/girishbhiremath/",
    color: "hover:bg-blue-600/20 hover:border-blue-500/30 hover:text-blue-400",
  },
  {
    icon: Twitter,
    label: "Follow on Twitter",
    href: "https://twitter.com",
    color: "hover:bg-sky-500/20 hover:border-sky-500/30 hover:text-sky-400",
  },
  {
    icon: Github,
    label: "Star on GitHub",
    href: "https://github.com/gengirish",
    color: "hover:bg-white/10 hover:border-white/20 hover:text-white",
  },
];

export function FollowJourney() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[var(--font-space)] text-2xl sm:text-3xl font-bold mb-3">
            Not Ready to Submit?{" "}
            <span className="gradient-text">Follow the Journey</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Watch MVPs get built in real-time. Weekly updates, behind-the-scenes
            content, and lessons from each build.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {socials.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition-all ${color}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
