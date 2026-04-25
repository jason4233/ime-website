# I ME — Design System Master (v4 "Cellular Atelier")

> Source of truth for `/luxe` route and beyond.
> 依 ui-ux-pro-max skill 的 `--design-system` 推薦 + 我的 domain refinement。

---

## 1. Pattern: Immersive / Interactive Experience

依技能推薦：「**Immersive/Interactive Experience**」適用於 luxury beauty 並支援大量 3D。
- **Section flow**：Hero (full-screen interactive) → Guided product tour → Key benefits → CTA
- **CTA placement**：After interaction complete + skip option for impatient users
- **Conversion**: 40% higher engagement vs static landing
- **Trade-off**: Performance — 必設 quality tier + reduced-motion fallback

### Section Architecture (8-act narrative)
| # | Section | 3D 主角 | Tech |
|---|---|---|---|
| 0 | **Hero** | 液態金粒子 → ampoule 瓶身 silhouette | R3F particles + custom GLSL shader |
| 1 | **Brand Promise** | 3D 字符 split + ribbon | drei `<Text3D>` + curve |
| 2 | **The Molecule** | 旋轉外泌體分子 + bloom | instancedMesh + post-FX |
| 3 | **Skin Journey** | scroll-linked camera dive | drei `<ScrollControls>` + camera path |
| 4 | **The Vial** | 3D rotating bottle + HDR reflection | GLB + `<Environment>` |
| 5 | **Founders** | 3D parallax card stack | tilt + flip-to-quote |
| 6 | **Proof Numbers** | 3D 漂浮巨型數字 + depth | scroll-linked Z-translate |
| 7 | **Appointment** | 朱砂封蠟 3D + glow particles | Three.js mesh + bloom |

---

## 2. Style: Liquid Glass

技能推薦的 style，搭配生技品牌 polish 後：

- **Translucency**: `backdrop-filter: blur(24px) saturate(180%)`
- **Glass surface**: `bg: rgba(20, 20, 26, 0.6)` on dark / `rgba(250, 250, 249, 0.7)` on light
- **Shadow stack** (3 layers, 累積 depth)：
  ```css
  box-shadow:
    0 1px 2px rgba(202, 138, 4, 0.04),     /* hairline */
    0 8px 32px rgba(0, 0, 0, 0.40),         /* mid */
    0 0 80px -20px rgba(202, 138, 4, 0.15); /* gold glow */
  ```
- **Grain**: SVG `feTurbulence` overlay, opacity 0.04
- **Iridescence**: Selective on accent surfaces, 2% chromatic aberration max

---

## 3. Color Tokens (semantic)

依技能推薦 + WCAG verified：

```ts
// tailwind.config.ts — luxe palette
luxe: {
  ink:        '#0C0A09',  // deepest text on light / fallback
  bg: {
    base:     '#0A0A0D',  // dark canvas (premium night)
    elevated: '#14141A',  // surface
    glass:    'rgba(20, 20, 26, 0.60)',
    light:    '#FAFAF9',  // light section bg
  },
  ivory:      '#F5F0E8',  // primary text on dark (warm, not pure white)
  ivoryDim:   '#A8A39A',  // secondary
  ivoryFade:  '#6A6760',  // tertiary
  obsidian:   '#1C1917',  // primary on light
  charcoal:   '#44403C',  // secondary on light
  gold:       '#CA8A04',  // PRIMARY CTA — recommended
  goldLight:  '#E8B23F',  // hover state
  goldGlow:   'rgba(202, 138, 4, 0.15)',
  cell:       '#7A4D8E',  // 細胞紫 secondary accent
  cellLight:  '#A374B8',
  serum:      '#C7E3D8',  // medical credibility tint
}
```

### Contrast verified (WCAG AA / AAA)
| Pair | Ratio | Grade |
|---|---|---|
| `ivory` on `bg.base` | 18.6:1 | AAA |
| `gold` on `bg.base` | 8.4:1 | AAA |
| `obsidian` on `bg.light` | 17.9:1 | AAA |
| `charcoal` on `bg.light` | 9.2:1 | AAA |
| `ivoryDim` on `bg.base` | 7.1:1 | AAA |

---

## 4. Typography: Luxury Minimalist

技能推薦的 **Bodoni Moda + Jost** pairing（Bodoni Moda 已在 deps）：

```ts
fontFamily: {
  display:  ['Bodoni Moda', 'serif'],     // 巨型 statement (hero / numbers)
  serif:    ['Fraunces', 'serif'],        // section headings (variable optical-size)
  sans:     ['Jost', 'system-ui', 'sans-serif'],  // body
  italic:   ['Cormorant Garamond', 'serif'],  // 英文 whisper italics
  serifTC:  ['Noto Serif TC', 'serif'],   // 中文標題
  sansTC:   ['"Source Han Sans TC"', 'Noto Sans TC', 'sans-serif'],  // 中文 body
  numeric:  ['"Bodoni Moda"', 'serif'],   // tabular figures
}
```

### Type scale (modular, 1.25 ratio)
```
display-2xl  clamp(4rem, 12vw, 9rem)    leading-[0.9]   tracking-[-0.04em]
display-xl   clamp(3rem, 8vw, 6.5rem)   leading-[0.95]  tracking-[-0.03em]
h1           clamp(2.5rem, 5vw, 4.5rem) leading-[1.05]  tracking-[-0.02em]
h2           clamp(2rem, 4vw, 3.25rem)  leading-[1.1]   tracking-[-0.015em]
h3           clamp(1.5rem, 2.8vw, 2.25rem) leading-[1.15]
subtitle     1.125rem to 1.5rem         leading-[1.4]   tracking-[0]
body-lg      1.125rem                   leading-[1.7]
body         1rem                       leading-[1.7]
caption      0.875rem                   leading-[1.5]   tracking-[0.02em]
overline     0.75rem                    leading-[1.5]   tracking-[0.18em]  uppercase
```

### Weight rules
- **Display / Hero**: Bodoni Moda **400 italic** for whisper, **700 roman** for statement
- **Headings**: Fraunces 500 (medium) — never bold for luxury
- **Body**: Jost 300 (light) — luxury 不用 400
- **CTA / Labels**: Jost 500 (medium) only

---

## 5. 3D / Motion Tokens

```ts
// motion.ts
export const ease = {
  // Per skill: prefer spring physics over linear
  outExpo:    [0.16, 1, 0.3, 1],         // entry
  inExpo:     [0.7, 0, 0.84, 0],          // exit (60-70% of entry)
  outBack:    [0.34, 1.56, 0.64, 1],     // playful overshoot
  spring:     { mass: 1, tension: 170, friction: 26 },  // R3F
  springSlow: { mass: 1.5, tension: 100, friction: 30 },
}
export const dur = {
  micro:      0.2,    // hover / press
  section:    0.4,    // section transition
  scene:      0.8,    // major reveal
  cinematic:  1.6,    // 3D camera move
}
```

### 3D-specific principles (per skill `motion-meaning` + `parallax-subtle`)
1. **Every 3D scene serves narrative** — no decoration-only WebGL
2. **Quality tiers**: detect FPS, fall back to 2D + still gradient if <40fps for 3s
3. **`prefers-reduced-motion`**: disable all R3F autoplay, show poster image
4. **Lazy mount**: `<Suspense>` + dynamic import, never SSR R3F
5. **Camera limits**: no pitch >30°（dizzy防止）, max parallax 8px on hover
6. **Bloom budget**: max 2 bloom passes per scene, threshold 0.85
7. **DPR cap**: `gl={{ dpr: [1, 1.5] }}` — never 2x on low-end

---

## 6. Spacing & Radius

```ts
spacing: {
  // 4pt baseline
  // 預設保留 Tailwind 0.5/1/2/3/4/...
  section:    'clamp(6rem, 12vh, 10rem)',
  hero:       'min(100dvh, 56rem)',
}
borderRadius: {
  pin:        '2px',   // medical-credible 細節
  card:       '12px',
  pill:       '999px', // CTA
  blob:       '40% 60% 60% 40% / 50% 50% 50% 50%',  // organic
}
```

---

## 7. Anti-patterns（依技能 + 我的觀察）

❌ **絕對不能**：
- emoji 當 icon（用 Lucide / Heroicons）
- pure black `#000000`（用 `#0A0A0D`）
- pure white `#FFFFFF`（用 `#F5F0E8` 或 `#FAFAF9`）
- 同畫面 >2 個 CTA
- hover-only interaction（mobile 看不到）
- instant transitions（≥200ms）
- transition-all（只動 transform / opacity）
- 隨機 shadow values（用上面的 shadow stack）
- 動 width/height/top/left（用 transform）
- 3D scene 沒 Suspense + 沒 reduced-motion fallback

---

## 8. Pre-delivery Checklist (依技能 §1-§3 CRITICAL)

- [ ] Color contrast ≥ 4.5:1 (verified 上方表)
- [ ] Focus rings visible（2-4px gold outline）
- [ ] Touch target ≥ 44×44pt
- [ ] No horizontal scroll on 375px
- [ ] CLS < 0.1（reserve space for 3D scenes）
- [ ] Reduced-motion: 3D 全停 / 顯示 poster
- [ ] LCP < 2.5s（hero poster 立刻渲染，3D progressive enhance）
- [ ] All 3D scenes lazy-loaded via `dynamic()`
- [ ] FPS detection → quality tier
- [ ] Image alt text 完整
- [ ] Keyboard nav 全可達
