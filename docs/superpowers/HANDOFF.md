# I ME 外泌體美容品牌網站 — Session Handoff
**最後更新**: 2026-04-22 · commit `68c7201`
**分支**: `feature/visual-overhaul-v2`

---

## 🎯 開場 prompt(貼給新電腦的 Claude Code)

> 你現在接手一個 Next.js 網站專案。這個 session 要連續工作 24 小時。
> 完整上下文在 `docs/superpowers/HANDOFF.md`,**請先 `cat` 這個檔案讀完再開始**。
> 任何實作前必須先 invoke `superpowers:brainstorming` 跟 `frontend-design:frontend-design` 技能。
> 使用者叫晨睿(繁體中文溝通)。專案路徑 `C:\Users\ASUS\Desktop\i me網站\ime-website\`。

---

## 1. 使用者

- 晨睿(台灣),繁體中文溝通,技術背景,偏好直接不廢話的回答
- 經營 ExoGiov® 外泌體生技品牌,這是其美容品牌 **I ME** 的官網

## 2. 專案核心資訊

| 項目 | 值 |
|------|-----|
| **品牌** | I ME |
| **Slogan** | *Exosome Beauty for you* |
| **定位** | 臍帶間質幹細胞外泌體美容 · 新美業 |
| **目標客群** | 35–55 歲女性,已有奢侈品消費習慣,台灣繁中市場 |
| **情緒錨點** | 奢華精緻 × 溫暖療癒 |
| **核心 CTA** | 「我想預約」(出現 ≥ 4 次) |
| **Tech stack** | Next.js 14.2.35 + React 18 + Tailwind + Framer Motion + TypeScript |
| **專案路徑** | `C:\Users\ASUS\Desktop\i me網站\ime-website\` |
| **GitHub** | jason4233/ime-website |
| **Vercel team** | `jason4233s-projects`(注意是 `s-projects` 結尾,不是純 username) |
| **Production** | `https://ime-website-kappa.vercel.app/` |
| **v3 Preview** | `https://ime-website-git-feature-visual-overhaul-v2-jason4233s-projects.vercel.app/v3` |

## 3. 最終想達到什麼

> **做一個跟 Hermès、Sulwhasoo、Tatcha 同級的外泌體美容品牌官網,讓 35–55 歲女性看完會想按「我想預約」。**

晨睿已授權我用兩條分支平行開發:
- **舊版 v2**(`/`):保守修復版,已完成 9 section narrative arc
- **新版 v3**(`/v3`):激進東方精品水墨版,**晨睿說「感覺很棒,繼續把它做完」**,已完成 9 section + 4 ambient 層

目前晨睿傾向以 v3 取代 v2,但還沒最終決定。新電腦接手後的工作是持續精進 v3,並等待晨睿下 merge 指令。

## 4. 目前進度快照(commit `68c7201`)

### ✅ 已完成
- v3 Oriental Atelier 所有 9 個 section(Hero / BrandStory / SkinLayers / Product / Certificate / Founder / BeforeAfter / Testimonial / Appointment)
- 4 個 ambient wow 層(CursorV3 磁性游標 / ScrollGoldThread 左緣金線 / AmbientGoldDust 漂浮金塵 / V3FloatingCTA 漂浮預約鈕)
- 8 個 SectionDivider 儀式過場(印章 / 金水滴 / 墨筆 三變體輪替)
- SkinLayersV3 已升級為超寫實皮膚解剖圖(毛囊/皮脂腺/汗腺/血管/膠原纖維/脂肪細胞,外泌體從表皮滲透)
- **手機 RWD 已修**(commit 68c7201):SkinLayers 標籤堆疊、BrandStory 角印縮小、Appointment 浮水印縮小、V3 badge 隱藏避開 Header

### 🏗️ 設計方向(已批准)
**一句話定位**:「Sulwhasoo 人蔘暖意 + Tatcha 宣紙寧靜 + Whoo 朱砂印 + 台灣藥鋪卷軸」

**Design tokens**(已加到 `tailwind.config.ts`):
```
vermillion(朱砂紅): #B8322C / light #D14A3F / dark #8E1F1C
ink(墨黑):        #1A1514 / deep #0D0908 / brush #3A2F2C
aubergine(深茄紫):#2E1C3A / deep #1F1228 / light #4A2F5E
plum(奢華紫):     #5B2A6E / dark #3F1A4D / light #7B2FBE
paper(宣紙):      cream #F7F2E9 / warm #EFE6D5 / rice #FAF5EC
leaf(金箔):       gold #C9A46B / light #E6CFA0 / deep #8E6F3B
jade(翡翠):       #7A9B84 / light #A0BBA8 / dark #5A7A64
```

**三大視覺招牌**:
1. **朱砂紅印章**(Hero / BrandStory / Founder / Certificate / BeforeAfter / Appointment 六處)
2. **金箔材質**(金線、金塵、金數字、金邊)
3. **宣紙紋理**(paper-texture + paper-gilt class,所有淺色 section 共享)

### 📊 66+ Wow Moments 清單
完整清單在我傳給晨睿的上一則訊息裡,重點類別:
- 4 ambient 層(全站)
- Hero 13 個(粒子匯聚、中文直排、Cormorant italic display、朱砂印章、等)
- BrandStory 7 個(三幕 cross-fade、頁角變字印章、金線框、壹/貳/參 進度條)
- SkinLayers 4 個(SVG 解剖入場、4 條下降金塵流、11 個接收點、金色虛線)
- Product 8 個(朱砂放射、3D 旋轉、14 顆螺旋金塵發散等 **Wow Moment 主角**)
- Certificate 5 個 · Founder 5 個 · BeforeAfter 5 個 · Testimonial 4 個 · Appointment 8 個

## 5. 本 session 做了什麼(時間序)

### 第一階段(v2 — 修復主線)
從亂七八糟狀態(shader 腦切片 + 合成器音樂 + SVG 走路女火柴人)開始清理:
- `52f99a1` — 淨刪 1,581 行壞 code,建立 9-section narrative,BrandStory 改為純文字金線版
- `b32a2cf` — 新增 FloatingCTA「我想預約」
- `1896357` — 移除所有 `transition-all` 違規

### 第二階段(v3 — 東方精品水墨平行設計)
晨睿說 v2 跟原版看起來一樣。派 research agent 產出深度 brief(已存檔 `docs/superpowers/specs/`)。
- `7902fb0` — v3 骨架(Hero + BrandStory + SectionDivider + InkSeal)
- `4a18fcb` — 完成剩下 7 section(SkinLayers / Product / Certificate / Founder / BeforeAfter / Testimonial / Appointment)
- `94fb648` — 加 4 ambient 層 + **修復 Vercel build 錯誤**(BeforeAfter 有個 `xSpring` unused var,被 ESLint 擋下導致前一版部署失敗,晨睿一直看到舊版的「7 幕打磨中」placeholder)
- `da04df8` — 把 SkinLayers 從「示意圖」升級為「超寫實解剖圖」(毛囊/血管/脂肪細胞等,外泌體從表皮滲透)
- `68c7201` — **手機 RWD 修復**(4 個跑版問題:SkinLayers 標籤疊圖、BrandStory 角印位置、Appointment 浮水印、V3 badge 壓 Header)

## 6. 使用過的技能清單

| 技能 | 用途 | 次數 |
|------|------|------|
| `superpowers:brainstorming` | v3 重設計前的方向腦力激盪,產出 design spec | 1 |
| `frontend-design:frontend-design` | 反 AI-slop 設計原則(大膽方向、獨特字體、材質紋理) | 2 |
| `design:design-critique` | 對 v2 做結構化批評,發現「跟原版一樣」的根因 | 1 |
| `Agent (general-purpose)` | 派代理研究 6 個亞洲奢華美容品牌(Sulwhasoo/Whoo/Tatcha/SK-II/La Mer/Shiseido)產出 1200 字 creative brief | 2 |

**已載入但本 session 沒完整啟動的(下一階段可用)**:
- `design:design-system` — 定義/審核 tokens,想擴充設計系統時用
- `design:accessibility-review` — WCAG 2.1 AA 審核
- `design:ux-copy` — UX 文案審查
- `marketing:brand-review` — 品牌聲調審核
- `marketing:seo-audit` — SEO 審核
- `chrome-devtools-mcp:*` — 瀏覽器除錯(部署後 a11y / LCP)
- `vercel:nextjs` / `vercel:react-best-practices` / `vercel:shadcn`
- `superpowers:verification-before-completion` — 宣告「完成」前強制驗證(非常重要,本 session 有用)
- `superpowers:writing-plans` — 多步驟任務前寫計畫
- `commit-commands:commit` — 格式化 commit(本 session 手動寫 HEREDOC,可用此自動)
- `anthropic-skills:canvas-design` — 畫視覺 moodboard
- `playground:playground` — 做互動 HTML 原型

## 7. 檔案結構(v3 相關)

```
src/
├── app/
│   ├── page.tsx              ← 舊 v2 入口(HomeClient 9 sections)
│   └── v3/
│       └── page.tsx          ← 新 v3 入口(V3Client)
│
├── components/
│   ├── HomeClient.tsx        ← v2 composition
│   └── v3/                   ← v3 所有元件(18 個檔案)
│       ├── V3Client.tsx          ← 組合所有 section + 分隔線 + ambient 層
│       │
│       │ ── Sections (9 個)
│       ├── HeroV3.tsx            ← 粒子匯聚 + 中文直排 + 朱砂印
│       ├── BrandStoryV3.tsx      ← 三幕 cross-fade(察/遇/選)
│       ├── SkinLayersV3.tsx      ← 超寫實皮膚解剖(最新升級)
│       ├── ProductV3.tsx         ← Living Vial 3D 旋轉 + 金塵螺旋
│       ├── CertificateV3.tsx     ← 印章牆 3×2
│       ├── FounderV3.tsx         ← CEO 肖像 + 團隊
│       ├── BeforeAfterV3.tsx     ← 拖曳分隔 + count-up
│       ├── TestimonialV3.tsx     ← 超大朱砂引號 crossfade
│       ├── AppointmentV3.tsx     ← 泌字浮水印 + 金線表單
│       │
│       │ ── Ambient layers (4 個)
│       ├── CursorV3.tsx          ← 朱砂磁性游標(桌機)
│       ├── ScrollGoldThread.tsx  ← 左緣金線 scroll 進度
│       ├── AmbientGoldDust.tsx   ← 28 顆 Canvas 漂浮金塵
│       ├── V3FloatingCTA.tsx     ← 朱砂漂浮「我想預約」
│       │
│       │ ── Reusable primitives (5 個)
│       ├── InkSeal.tsx           ← 朱砂印章元件(stamp-press)
│       ├── SectionDivider.tsx    ← 儀式分隔(seal/goldDrop/brush 三變體)
│       ├── CountUpStat.tsx       ← 數字 count-up(cubic ease-out)
│       └── CharacterReveal.tsx   ← 逐字入場(blur-in)
│
├── app/globals.css           ← 新增 v3 utilities: paper-texture / text-leaf-gold / seal-stamp / ink-drop / brush-stroke / slow-breathe / writing-vertical
│
└── tailwind.config.ts        ← 新增 v3 colors: vermillion / ink / aubergine / plum / paper / leaf / jade

docs/superpowers/specs/
└── 2026-04-22-ime-homepage-visual-overhaul-design.md    ← v2 方向 spec(已完成)

docs/superpowers/
└── HANDOFF.md                ← 本檔案
```

## 8. 已知 pending / 待晨睿回饋

### 🟡 中度(等晨睿決策)
1. **v3 → production 要不要 merge?** — 現在 v3 在 `/v3` 獨立路徑。晨睿 OK 的話,用 `git checkout master && git merge feature/visual-overhaul-v2` 再把 `src/app/page.tsx` 改成用 V3Client 即可。
2. **Appointment 表單要不要串 API?** — 目前 mock 送出(setTimeout 1.2s),尚未連到 DB/Line/Email。晨睿沒指定後端。
3. **BeforeAfter 要不要換真實素材?** — 目前是 CSS gradient placeholder(避免醫美法規風險)。
4. **Product 瓶身要不要換更好的渲染圖?** — 目前用 `/images/42706_0.jpg`。

### 🔴 高度(素材缺失,會影響美感)
5. **Founder 區團隊照片品質不一**(有些是名片圖)。理想要攝影棚拍。
6. **Certificate 認證圖** — 目前用 `/images/660081_0.jpg` 等,品質 OK 但可再精修。
7. **輕音樂** — 晨睿早期要求過「大量動畫 + 輕音樂」,但我移除了 Web Audio 合成器(音質差)。待授權音樂採購(建議 Artlist / Musicbed 年訂閱 US$200)。

### 🟢 輕度(可延後)
8. SkinLayers 可加角質層 stratum corneum 堆疊紋、黑素細胞 melanocytes 深色顆粒、神經末梢
9. Product Living Vial 的 360° 旋轉 + exosome constellation 合成(agent brief 裡的 Wow #3,目前只做到 scroll-tied rotateY ±18°)
10. 整站 a11y 審核(`design:accessibility-review` 跑過)
11. Lighthouse performance 驗證(Vercel 有 speed insights 可看)
12. FAQ 區、成分說明區、部落格入口(晨睿沒要求但可討論)

## 9. 新電腦接手的開場 checklist

```bash
# 1. 確認專案狀態
cd "C:/Users/ASUS/Desktop/i me網站/ime-website"
git branch --show-current           # 應該在 feature/visual-overhaul-v2
git log --oneline -5                # 最新應該是 68c7201
git status                          # 應該是 clean

# 2. 確認 Vercel preview 活著
curl -s -o /dev/null -w "%{http_code}\n" "https://ime-website-git-feature-visual-overhaul-v2-jason4233s-projects.vercel.app/v3"
# 預期 200

# 3. 讀本檔案
cat docs/superpowers/HANDOFF.md

# 4. 讀 spec(奢華 × 療癒方向的決策過程)
cat docs/superpowers/specs/2026-04-22-ime-homepage-visual-overhaul-design.md

# 5. (Optional)跑本機 dev server 快速迭代
npm run dev                         # http://localhost:3000/v3
```

## 10. 互動原則(晨睿偏好)

- 繁體中文回,技術術語可英文
- 不要過度解釋,他有技術背景
- **每完成一個區塊讓他確認再繼續**
- 覺得方向有問題直接說
- 關鍵邏輯加中文註解
- Commit message 用英文
- 手機 RWD 一定要做(他會用手機檢查)

## 11. 鐵律

1. **任何實作前先 invoke `superpowers:brainstorming` 跟 `frontend-design:frontend-design`** — CLAUDE.md 強制規定
2. **不要碰 `transition-all`** — CLAUDE.md 禁止
3. **不要用預設 Tailwind 藍/靛紫** — 用 brand tokens
4. **宣告完成前 invoke `superpowers:verification-before-completion`**
5. **手機必須測**(`md:*` breakpoints + clamp())
6. **commit 前本機跑 `npx next build`** — 別只依賴 Vercel(本 session 吃過一次 ESLint `no-unused-vars` 的苦)
7. **Commit message 用 HEREDOC 格式**,尾端加 `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`

## 12. 立即可以接著做的任務(優先度排序)

### P0 — 等晨睿回手機 review
- 晨睿說要測手機版,等他拍照回饋有沒有新跑版
- 手機上 BrandStory / SkinLayers / Appointment 應該都修好,但其他 section 可能還有沒發現的

### P1 — 可以自己先做
- **Hero 區加 `CharacterReveal` 套用到「捨得 · 最高級的保養」中文主標**(元件已做好但沒整合)
- **Product 區 2000 億 / 76.8nm 等數字加 `CountUpStat`**(元件已做好但沒整合)
- **ProductV3 的 Living Vial Wow #3 升級**:agent brief 有提到完整版是「金塵從瓶內發散 + 形成外泌體分子 constellation」,目前只做到第一階段

### P2 — 擴張
- 子頁:`/training` (已存在) / `/about` (待做) / `/contact` (已存在)
- 加 FAQ section(晨睿之前沒提但對品牌網站 SEO 有幫助)
- 整站 `design:accessibility-review` 跑一次

### P3 — 部署相關
- 如果晨睿決定 merge 到 master,要處理:
  1. `git checkout master`
  2. `git merge feature/visual-overhaul-v2`
  3. 把 `src/app/page.tsx` 改成渲染 V3Client(或把 V3 內容搬到 HomeClient)
  4. 把 `/v3/page.tsx` 刪掉或 redirect 到 `/`
  5. 移除 v2 章節的殘留元件(BrandStorySection 等 v2 版本)

---

**最後一件事**:晨睿之前被我搞歪過(第一版把 Hero 做成腦切片 shader、SVG 走路女火柴人、合成器冥想音樂)。他現在對「方向錯誤」很敏感,但對 v3 東方精品水墨方向很滿意。**不要貿然改動 v3 的視覺詞彙**(朱砂紅 + 金箔 + 宣紙紋理三柱),所有新增元素都要問自己:「這個有服從這三柱嗎?」
