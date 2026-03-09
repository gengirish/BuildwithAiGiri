"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About" },
  { href: "/showcase", label: "Showcase" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Rocket className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="font-[var(--font-space)] text-lg font-bold tracking-tight">
            Build<span className="text-cyan-400">withAi</span>Giri
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/submit"
            className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
          >
            Submit Idea
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm text-gray-300",
                    "hover:bg-white/5 hover:text-white transition-colors",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-gray-300",
                  "hover:bg-white/5 hover:text-white transition-colors",
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/submit"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-lg bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-cyan-400 transition-colors"
              >
                Submit Idea
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
