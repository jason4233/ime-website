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
import { OrganizationJsonLd, ProductJsonLd, ServiceJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { getHero } from "@/lib/content";

// ISR：每 60 秒 revalidate；後台存檔時也會透過 /api/revalidate 立即刷新
export const revalidate = 60;

export default async function Home() {
  // 目前只 wire Hero 到 DB；其他 section 保留硬編（之後依需求擴充）
  const hero = await getHero();

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ProductJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />
      <HeroSection data={hero} />
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
