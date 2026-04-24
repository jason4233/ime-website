"use client";

// 首頁敘事弧 — 9 sections
// 情緒:神祕召喚 → 溫暖共鳴 → 知識 → 科學信任 → 權威 → 人物 → 成果 → 認同 → 預約
// CMS 資料從 app/page.tsx 傳進來，每個 section 有 data 時用 DB，沒有時 fallback 硬編

import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { SkinLayers } from "@/components/sections/SkinLayers";
import { ProductSection } from "@/components/sections/ProductSection";
import { CertificateSection } from "@/components/sections/CertificateSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";

// CMS payload shape — 寬鬆 any，避免 Prisma 型別跟客戶端 bundle 耦合
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HomeCmsData {
  hero: any;
  brandStory: any[];
  founders: any[];
  products: any[];
  certificates: any[];
  testimonials: any[];
  news: any[];
  beforeAfter: any[];
  siteSettings: any;
}

export default function HomeClient({ cms }: { cms?: Partial<HomeCmsData> }) {
  return (
    <>
      <HeroSection data={cms?.hero} />                           {/* 1 · 神祕召喚 */}
      <BrandStorySection data={cms?.brandStory} />               {/* 2 · 溫暖共鳴 */}
      <SkinLayers />                                             {/* 3 · 知識鋪陳 */}
      <ProductSection data={cms?.products} />                    {/* 4 · 科學信任 */}
      <CertificateSection data={cms?.certificates} />            {/* 5 · 權威背書 */}
      <FounderSection data={cms?.founders} />                    {/* 6 · 人物連結 */}
      <BeforeAfterSection data={cms?.beforeAfter} />             {/* 7 · 成果見證 */}
      <TestimonialSection data={cms?.testimonials} />            {/* 8 · 社會認同 */}
      <AppointmentSection settings={cms?.siteSettings} />        {/* 9 · 承諾轉換 */}
    </>
  );
}
