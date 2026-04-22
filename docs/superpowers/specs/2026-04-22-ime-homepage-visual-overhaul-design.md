# I ME 品牌網站全站視覺一致化設計規格

**Date**: 2026-04-22
**Status**: Approved (per 晨睿 "同意，全部開始做")
**Scope**: Tier C — 全站視覺一致化 (define design tokens + apply to all 9 homepage sections)
**Branch**: `feature/visual-overhaul-v2`

---

## 1. 目標

重塑 I ME 品牌網站首頁為**奢華精緻 × 溫暖療癒**的品牌敘事體驗。以「我想預約」作為核心轉換動作，用粒子匯聚光束作為 Hero 記憶點。

**成功判準**：
- 使用者從 Hero 滑到 Appointment 經歷完整情緒弧（神祕 → 溫暖 → 信任 → 預約）
- 紫金色調在所有 9 個 section 一致
- CTA「我想預約」至少 4 個入口（Hero 主 / 中段漂浮 × 2 / Appointment 終極）
- 無 AI-slop 徵兆（無預設 Tailwind 藍、無 transition-all、無通用 fonts）
- Lighthouse performance ≥ 85

## 2. 品牌情緒雙極

| 極 | 視覺表現 |
|---|---------|
| **奢華精緻** | 金絲裝飾 / serif 大字 / 暗紫對比金色焦點 / 戲劇性留白 |
| **溫暖療癒** | 米白暖背景 / 圓角柔和 / 慢速呼吸節奏 / 親近中醫師口吻 |

**平衡法則**：
- Hero + Appointment → 奢華精緻（戲劇性開場與收束）
- BrandStory + Founder + Testimonial → 溫暖療癒（親近感）
- Product + Certificate + SkinLayers → 中性偏精緻（權威感）

## 3. 首頁敘事弧 — 9 sections

| # | Section | 情緒 | 背景 | 主色 |
|---|---------|------|------|------|
| 1 | Hero | 神祕召喚 | 暗紫夜色 + 粒子匯聚光束 | gold 焦點 |
| 2 | BrandStory | 溫暖共鳴 | cream-warm 米白 | deep-purple 文字 + gold 裝飾 |
| 3 | SkinLayers | 知識鋪陳 | cream-rose 玫瑰米 | brand purple |
| 4 | Product (USC-E) | 科學信任 | deep-purple 暗紫 | ivory + gold |
| 5 | Certificate | 權威背書 | cream-amber 琥珀米 | gold 主 |
| 6 | Founder | 人物連結 | cream-warm 米白 | deep-purple + 肖像 |
| 7 | BeforeAfter | 成果見證 | ivory | brand-light |
| 8 | Testimonial | 社會認同 | cream-rose | deep-rose + gold |
| 9 | Appointment | **承諾轉換** | deep-purple 暗紫 gradient | gold 主按鈕 |

移到子頁：`CourseSection`、`RecruitSection`、`FactorySection`、`RnDSection`、`NewsSection`

## 4. Design Tokens

（延用現有 `tailwind.config.ts`，已涵蓋）

### Colors
```
brand.DEFAULT: #7B2FBE  (主紫)
brand.light: #9B5DD4
brand.dark: #5E1F96
gold.DEFAULT: #B8953F
gold.light: #D4B96A
gold.dark: #8C6F2A
deep.purple: #3A2A4E
cream.warm: #F5EBE5
cream.rose: #F0E2DC
cream.amber: #F2E9D5
ivory: #FAF7F2
night: #0A0A0A
```

### Typography
- 標題：`font-serif-tc` (Noto Serif TC) / `font-handwriting` (辰宇落雁體 - Hero 專用)
- 英文裝飾：`font-elegant` (Cormorant Garamond italic)
- 數字：`font-number` (Playfair Display tabular)
- 內文：`font-sans-tc` (Noto Sans TC)

### Motion Easing
- Spring：`cubic-bezier(0.16, 1, 0.3, 1)` — 主要 reveal / hover
- Smooth：`cubic-bezier(0.4, 0, 0.2, 1)` — 背景、氛圍
- 動畫時長：0.6–0.8s（reveal）、1.2s（複雜 stagger）、12s+（呼吸/ambient）

## 5. 動畫原則（反 AI-slop）

- **只動 transform 與 opacity**，絕不用 `transition-all`
- **Stagger reveal**：每個 section 進場時，文字 / 圖 / 按鈕依序 0.15s 延遲
- **金線 scaleX 入場**：所有裝飾線 `origin-center scaleX 0→1`
- **Magnetic hover**：主 CTA 與人物卡用 MagneticButton
- **Parallax**：每 section 內容與背景以 0.85:1 比例 Y 位移（輕微）
- **Hero 粒子持續**：保留 `HeroParticles`，quantity=140、baseSize=2.2 恢復原始細霧感
- **避免**：過度同時動、scroll-jack、彈簧過度彈、旋轉動畫

## 6. CTA 策略

**主 CTA 文案統一為「我想預約」**，副 CTA 依情境變化。

| 位置 | 型態 | 文案 | 變體 |
|------|------|------|------|
| Hero | 大 Magnetic Button | 我想預約 | `variant="gold"` |
| Hero（副） | Ghost Button | 了解外泌體 | — |
| Product 末 | inline CTA | 我想預約體驗 | 次要 |
| Testimonial 後 | floating chip | 我想預約 | 右下角固定 |
| Appointment | 大型 hero CTA | 我想預約 | 配表單 |
| Footer | link | 預約諮詢 | 通用 |

## 7. 清理清單（Phase A）

刪除檔案：
- `src/components/ui/HeroFluidShader.tsx`（腦切片 shader）
- `src/components/ambient/BrandAmbientAudio.tsx`（合成器音樂）
- `src/components/ui/WatercolorWalkingGirl.tsx`（火柴人走路）

保留但重構：
- `BrandStorySection.tsx` → 純文字 + 金線 + 不用漫遊者
- `HeroSection.tsx` → 移除 shader layer + dark overlay，粒子配置回歸原始 (quantity=140)

保留不動：
- `HeroParticles` (`hero-particles.tsx`)
- Remotion `hero-ambient.mp4` 影片（作為 Hero 底層氛圍）
- `ScrollProgress`（頂部金線）
- `hero-ambient.mp4` 作為 Hero 低 opacity 氛圍底

## 8. 實作階段

- **Phase A — 清理**：刪除壞元件，HeroSection 還原，BrandStory 重構
- **Phase B — Tokens 對齊**：globals.css 對齊 tailwind tokens，確認字體變數
- **Phase C — HomeClient 重排**：9 section 順序，移除 5 個子頁 section
- **Phase D — 逐 section 校色**：每個 section 依情緒表配背景/字色
- **Phase E — FloatingCTA**：右下角 magnetic「我想預約」chip
- **Phase F — AppointmentSection 打磨**：大型 CTA + 表單重點化
- **Phase G — 驗證**：screenshot 全頁 + design-critique + a11y

## 9. 驗收

- [ ] 所有 9 section 首頁依序顯示
- [ ] 「我想預約」至少 4 個入口
- [ ] Hero 粒子回歸原始細霧匯聚感
- [ ] 無 shader / 無合成器音樂 / 無 SVG 走路女
- [ ] Lighthouse performance ≥ 85
- [ ] Vercel preview 部署成功
- [ ] 晨睿 review 批准

---

**下一步**：進入實作，每階段 commit + push 讓 Vercel 產出 preview URL。
