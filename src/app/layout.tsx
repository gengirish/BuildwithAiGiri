import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "BuildwithAiGiri | 25 MVPs in 25 Weeks",
  description:
    "A movement where an experienced architect builds free software MVPs every week for 25 weeks. Submit your idea, brainstorm together, and get a working product.",
  keywords: [
    "MVP",
    "startup",
    "build",
    "free",
    "software",
    "AI",
    "collaboration",
    "open source",
    "SaaS",
    "BuildwithAiGiri",
  ],
  openGraph: {
    title: "BuildwithAiGiri | 25 MVPs in 25 Weeks — Submit Your Idea",
    description:
      "Submit your idea. Get a free MVP built in one week by a 14-year veteran architect. Join the movement.",
    type: "website",
    url: "https://buildwithaigiri.vercel.app",
    siteName: "BuildwithAiGiri",
    images: [
      {
        url: "https://buildwithaigiri.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "BuildwithAiGiri — 25 MVPs in 25 Weeks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildwithAiGiri | 25 MVPs in 25 Weeks",
    description:
      "Submit your idea. Get a free MVP built in one week. Join the movement.",
    images: ["https://buildwithaigiri.vercel.app/og.png"],
  },
  metadataBase: new URL("https://buildwithaigiri.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Girish Hiremath",
        url: "https://girishbhiremath.vercel.app",
        sameAs: [
          "https://www.linkedin.com/in/girishbhiremath/",
          "https://github.com/gengirish",
        ],
        jobTitle: "Software Architect",
        knowsAbout: [
          "Software Architecture",
          "Full-Stack Development",
          "AI/ML",
          "SaaS",
        ],
      },
      {
        "@type": "WebSite",
        name: "BuildwithAiGiri",
        url: "https://buildwithaigiri.vercel.app",
        description:
          "25 MVPs in 25 Weeks — Submit your idea and get a free MVP built by an experienced architect.",
        creator: { "@type": "Person", name: "Girish Hiremath" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this really free? What's the catch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, 100% free. No equity, no fees, no hidden costs. This is a personal mission to give back to the community by helping turn ideas into real products.",
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
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
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
      </body>
    </html>
  );
}
