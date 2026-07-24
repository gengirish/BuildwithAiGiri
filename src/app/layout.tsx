import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "MVP Labs by IntelliForge AI | 25 MVPs in 25 Weeks",
  description:
    "MVP Labs by IntelliForge AI builds free software MVPs every week for 25 weeks. Submit your idea, brainstorm together, and get a working product — at zero cost.",
  keywords: [
    "MVP",
    "startup",
    "build",
    "free",
    "software",
    "AI",
    "IntelliForge",
    "MVP Labs",
    "SaaS",
    "open source",
  ],
  openGraph: {
    title: "MVP Labs by IntelliForge AI | 25 MVPs in 25 Weeks",
    description:
      "Submit your idea. Get a free MVP built in one week by IntelliForge AI's 14+ year veteran team.",
    type: "website",
    url: "https://mvplabs.intelliforge.tech",
    siteName: "MVP Labs",
    images: [
      {
        url: "https://mvplabs.intelliforge.tech/og.png",
        width: 1200,
        height: 630,
        alt: "MVP Labs by IntelliForge AI — 25 MVPs in 25 Weeks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MVP Labs by IntelliForge AI | 25 MVPs in 25 Weeks",
    description:
      "Submit your idea. Get a free MVP built in one week by IntelliForge AI.",
    images: ["https://mvplabs.intelliforge.tech/og.png"],
  },
  metadataBase: new URL("https://mvplabs.intelliforge.tech"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
