import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SelectionCriteria } from "@/components/SelectionCriteria";
import { About } from "@/components/About";
import { PastWork } from "@/components/PastWork";
import { FAQ } from "@/components/FAQ";
import { FollowJourney } from "@/components/FollowJourney";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <SelectionCriteria />
      <About />
      <PastWork />
      <FAQ />
      <FollowJourney />
      <CTA />
    </>
  );
}
