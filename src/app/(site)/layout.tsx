import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * Chrome for the main MVP Labs site. Standalone routes (e.g. /campus) live
 * outside this group so they don't ship the navbar/footer/toaster bundles.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "IntelliForge AI",
        url: "https://www.intelliforge.tech",
        sameAs: [
          "https://www.linkedin.com/in/girish-b-hiremath/",
          "https://github.com/gengirish",
        ],
        founder: {
          "@type": "Person",
          name: "Girish Hiremath",
          jobTitle: "Lead Architect",
        },
        knowsAbout: [
          "Software Architecture",
          "Full-Stack Development",
          "AI/ML",
          "SaaS",
          "MVP Development",
        ],
      },
      {
        "@type": "WebSite",
        name: "MVP Labs",
        url: "https://mvplabs.intelliforge.tech",
        description:
          "25 MVPs in 25 Weeks — Submit your idea and get a free MVP built by IntelliForge AI.",
        creator: { "@type": "Organization", name: "IntelliForge AI" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this really free? What's the catch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, 100% free. No equity, no fees, no hidden costs. MVP Labs is IntelliForge AI's initiative to give back to the community by helping turn ideas into real products.",
            },
          },
          {
            "@type": "Question",
            name: "What kind of ideas are you looking for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "SaaS products, subscription-based platforms, marketplaces, or any software idea that can be scoped into a week-long MVP with a clear target audience.",
            },
          },
          {
            "@type": "Question",
            name: "Who owns the code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You do. After the build week, all code, workflows, and documentation are handed over to you. Projects can be open-source or closed-source — your choice.",
            },
          },
          {
            "@type": "Question",
            name: "What tech stack will be used?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The best stack for your project. Common choices include Next.js, React, Python/FastAPI, Supabase, PostgreSQL, and modern AI tools.",
            },
          },
          {
            "@type": "Question",
            name: "What if my idea isn't selected?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Selection is based on feasibility, impact, and alignment with the weekly scope. Even if not selected, feedback or suggestions may be shared on your submission.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className={inter.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fafafa",
          },
        }}
      />
    </div>
  );
}
