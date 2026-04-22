"use client";

// 首頁敘事弧 — 9 sections
// 情緒:神祕召喚 → 溫暖共鳴 → 知識 → 科學信任 → 權威 → 人物 → 成果 → 認同 → 預約
// 參考:docs/superpowers/specs/2026-04-22-ime-homepage-visual-overhaul-design.md

import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { SkinLayers } from "@/components/sections/SkinLayers";
import { ProductSection } from "@/components/sections/ProductSection";
import { CertificateSection } from "@/components/sections/CertificateSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";

export default function HomeClient() {
  return (
    <>
      <HeroSection />         {/* 1 · 神祕召喚 — 粒子匯聚光束 */}
      <BrandStorySection />   {/* 2 · 溫暖共鳴 — 三幕故事 */}
      <SkinLayers />          {/* 3 · 知識鋪陳 — 皮膚 × 外泌體 */}
      <ProductSection />      {/* 4 · 科學信任 — USC-E 數據 */}
      <CertificateSection />  {/* 5 · 權威背書 — INCI / TFDA / 專利 */}
      <FounderSection />      {/* 6 · 人物連結 — CEO 故事 */}
      <BeforeAfterSection />  {/* 7 · 成果見證 — 療程對比 */}
      <TestimonialSection />  {/* 8 · 社會認同 — 用戶口碑 */}
      <AppointmentSection />  {/* 9 · 承諾轉換 — 我想預約 */}
    </>
  );
}
