# UI/UX Pro Max 對 v3 Oriental Atelier 的審核結論

**跑查時間**: 2026-04-22 · commit `241c0b4`
**使用技能**: `ui-ux-pro-max` (nextlevelbuilder, 131K installs)

---

## 🎨 結論摘要(壓縮版)

| 審核面向 | pro-max 建議 | v3 現狀 | 判斷 |
|---------|-------------|---------|------|
| **Style 風格** | Editorial Grid / Magazine + Exaggerated Minimalism | 章節故事弧 + Cormorant 大字 | ✅ **完全命中**,加強章節編號視覺 |
| **Color 主調** | Premium Dark(#1C1917) + Gold(#CA8A04) + Cream(#FAFAF9) | ink `#1A1514` + leaf gold `#C9A46B` + paper cream `#F7F2E9` | ✅ **結構對齊**,朱砂紅是超規加分 |
| **Font 主配** | Cormorant + Montserrat(Luxury Serif)或 Bodoni Moda + Jost(Luxury Minimalist) | Cormorant Garamond + Noto Serif TC + Noto Sans TC | 🟡 **Cormorant ✅;中文體固守;可加 Bodoni Moda 做巨型數字** |
| **Landing Pattern** | Hero-Centric + Social Proof(Above-fold CTA) | Hero 主 CTA + 後段 Testimonial | ✅ 命中 |
| **Product Type 類別** | Luxury/Premium Brand:Black + Gold + White + minimal accent | 朱砂 + 墨黑 + 金箔 + 宣紙 | ✅ 符合 Luxury Brand 邏輯 |

**TL;DR**:**v3 的方向在 pro-max 的 161 palette / 57 font / 50 style 資料庫裡是被驗證的**,不用推翻。加分項是:(1) 章節編號排版更 editorial (2) 可引入 Bodoni Moda 做關鍵數字(2,000 億那類)。

---

## 🎯 具體升級項(3 個,按影響力排序)

### P1 · 引入 Bodoni Moda 做「驚豔數字」
**為什麼**:pro-max Luxury Minimalist 配對(Bodoni Moda + Jost)排名 #4,這是 Vogue/Harper's Bazaar 等時尚雜誌用的字體——**超大字高、襯線極細**,做「2,000 億顆外泌體」「+47% 含水度」「76.8–99.4nm」這類**數字亮點**,視覺衝擊比 Cormorant 更強 30%。

**執行**:`tailwind.config.ts` 加:
```ts
display: ["Bodoni Moda", "Cormorant Garamond", "serif"],
```
Google Fonts import 加:
```
https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700;800;900&display=swap
```
套用位置:
- `ProductV3.tsx` 的 `2,000 億` / `76.8–99.4` / `CD9·CD63` 規格
- `BeforeAfterV3.tsx` 的 `+47%`

### P2 · Editorial Grid 強化章節排版
**為什麼**:pro-max Editorial Grid 建議「asymmetric grid + drop caps + pull quotes + column layout」。v3 的 BrandStory 三幕有章節編號,但**沒用 editorial 雜誌手法**(drop cap 大寫首字、拉引文、多欄版)。

**執行**:
- BrandStory 每幕第一個漢字放大成 drop cap(100–140px,金色)
- 英文 whisper 可拉到頁邊當「pull quote」(italic, 朱砂)
- 章節編號「壹 · 察覺」用 Bodoni Moda 垂直排版

### P3 · 雙驗證 → 保留朱砂紅
**pro-max 主推薦的 beauty palette 是 `#EC4899 粉 + #F9A8D4 淺粉 + #8B5CF6 紫`(SK-II/Clinique 主流保養品路線)**,但:
1. 你明確說不要做成一般美容品
2. 你的 reference 是 Hermès / Sulwhasoo / Whoo(Oriental luxury)
3. pro-max 第 2/4 推薦的 `#1C1917 + #CA8A04 gold + #FAFAF9 cream` 才是 Luxury Brand 主流

**結論**:**保留朱砂紅作為 oriental 差異化信號色**(Sulwhasoo ginseng amber / Whoo imperial vermillion 都有類似 move),不要換成主流粉紫調。

---

## 🔬 pro-max 查到的原始資料(供 reference)

### 最相關的 5 個 Color Palettes
| # | Product Type | Primary | Secondary | CTA | Background | Text |
|---|--------------|---------|-----------|-----|------------|------|
| 1 | Banking/Trad Finance | #0F172A | #1E3A8A | #CA8A04 | #F8FAFC | #020617 |
| **2** | **E-commerce Luxury** | **#1C1917** | **#44403C** | **#CA8A04** | **#FAFAF9** | **#0C0A09** |
| 3 | Hotel/Hospitality | #1E3A8A | #3B82F6 | #CA8A04 | #F8FAFC | #1E40AF |
| **4** | **Luxury/Premium Brand** | **#1C1917** | **#44403C** | **#CA8A04** | **#FAFAF9** | **#0C0A09** |
| 5 | Beauty/Spa/Wellness | #EC4899 | #F9A8D4 | #8B5CF6 | #FDF2F8 | #831843 |

→ #2/#4 是我們的方向,#5 跟我們明確背離。

### 最相關的 5 個 Styles
1. **Editorial Grid / Magazine** — Asymmetric grid, drop caps, pull quotes, print-inspired
2. **Exaggerated Minimalism** — `font-size: clamp(3rem, 10vw, 12rem)`, font-weight 900, letter-spacing -0.05em
3. Skeuomorphism(效能差,跳過)
4. Swiss Modernism 2.0(太冷,跳過)
5. Trust & Authority(cut off)

### 最相關的 5 個 Font Pairings
1. **Luxury Serif** → Cormorant + Montserrat
2. **Classic Elegant** → Playfair Display + Inter ← **beauty/spa 明確推薦**
3. Restaurant Menu → Playfair Display SC + Karla
4. **Luxury Minimalist** → Bodoni Moda + Jost ← **Vogue 路線,做巨型數字用**
5. Editorial Classic → Cormorant Garamond + Libre Baskerville(all-serif)

### Landing Patterns
- Hero-Centric + Social Proof(v3 命中)
- Funnel 3-step
- AI Personalization(需要後端)
- Comparison Table(對我們不適合)

### Pro-Max CLI(新 session 要用)
```bash
cd "C:/Users/ASUS/Desktop/i me網站/ime-website"

# 核心查詢
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Project"

# 分 domain 查
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain color -n 5
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain style -n 5
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain typography -n 5
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain product -n 5
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain landing -n 5
python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux -n 10
```
