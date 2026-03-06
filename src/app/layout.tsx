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
  ],
  openGraph: {
    title: "BuildwithAiGiri | 25 MVPs in 25 Weeks",
    description:
      "Submit your idea. Get a free MVP built in one week. Join the movement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
