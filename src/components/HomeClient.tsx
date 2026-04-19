"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { FirstVisitQuiz } from "@/components/sections/quiz/FirstVisitQuiz";
// import { BrandStorySection } from "@/components/sections/BrandStorySection";
// import { FounderSection } from "@/components/sections/FounderSection";

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <FirstVisitQuiz />
    </>
  );
}
