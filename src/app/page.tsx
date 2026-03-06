import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <About />
      <FAQ />
      <CTA />
    </>
  );
}
