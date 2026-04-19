"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { FirstVisitQuiz } from "@/components/sections/quiz/FirstVisitQuiz";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { FounderSection } from "@/components/sections/FounderSection";
// import { ProductSection } from "@/components/sections/ProductSection";
// import { SkinLayers } from "@/components/sections/SkinLayers";
// import { CourseSection } from "@/components/sections/CourseSection";

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <FirstVisitQuiz />
      <BrandStorySection />
      <FounderSection />
    </>
  );
}
