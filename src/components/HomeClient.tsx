"use client";

// 將首頁所有視覺內容打包為 client-only 元件，由 dynamic(ssr:false) 載入
// 避免 Framer Motion + Lenis + GSAP + AnimatePresence 複雜互動造成 hydration insertBefore 錯誤
import { HeroSection } from "@/components/sections/HeroSection";
import { FirstVisitQuiz } from "@/components/sections/quiz/FirstVisitQuiz";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { FounderSection } from "@/components/sections/FounderSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { SkinLayers } from "@/components/sections/SkinLayers";
import { CourseSection } from "@/components/sections/CourseSection";
import { RnDSection } from "@/components/sections/RnDSection";
import { FactorySection } from "@/components/sections/FactorySection";
import { CertificateSection } from "@/components/sections/CertificateSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { RecruitSection } from "@/components/sections/RecruitSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";

export default function HomeClient() {
  return (
    <>
      <HeroSection />
      <FirstVisitQuiz />
      <BrandStorySection />
      <FounderSection />
      <ProductSection />
      <SkinLayers />
      <CourseSection />
      <RnDSection />
      <FactorySection />
      <CertificateSection />
      <NewsSection />
      <TestimonialSection />
      <RecruitSection />
      <AppointmentSection />
    </>
  );
}
