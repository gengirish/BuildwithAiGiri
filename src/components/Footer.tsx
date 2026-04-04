import Link from "next/link";
import { Zap, Github, Twitter, Linkedin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span className="font-bold tracking-tight">
                MVP <span className="text-cyan-400">Labs</span>
              </span>
            </Link>
            <p className="text-xs text-gray-600 mb-3">
              by{" "}
              <a
                href="https://www.intelliforge.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                IntelliForge AI
              </a>
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              25 MVPs. 25 Weeks. Free.
              <br />
              Turning ideas into production-ready products.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/submit", label: "Submit an Idea" },
                { href: "/showcase", label: "Project Showcase" },
                { href: "/#faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">
              The Movement
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/#about", label: "About Us" },
                { href: "/#how-it-works", label: "The Process" },
                { href: "/#criteria", label: "Selection Criteria" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4">
              Connect
            </h4>
            <div className="flex gap-3 mb-6">
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
                  icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  icon: Globe,
                  href: "https://www.intelliforge.tech",
                  label: "IntelliForge",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Built by card */}
            <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400">
                  Built by{" "}
                  <a
                    href="https://www.intelliforge.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    IntelliForge AI
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} IntelliForge AI — MVP Labs. Built
            with passion, powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
