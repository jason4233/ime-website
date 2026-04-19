"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 已移除 GSAP ScrollTrigger pin (DOM 突變會造成 React insertBefore 崩潰)
// 改用 CSS position:sticky + 原生 scroll progress 驅動 activeLayer

// 皮膚三層 — 精緻珍珠膚色系統
const layers = [
  {
    id: 0,
    name: "表皮層",
    en: "Epidermis",
    depth: "0.05–0.1 mm",
    effects: ["提亮", "細緻", "保濕重建"],
    accent: "#B8953F",
    surface: {
      highlight: "#FFFBF5",
      light: "#FBEBD8",
      mid: "#F4D6BF",
      shadow: "#E0B89F",
      deep: "#C8977D",
    },
    pattern: "corneocytes",
  },
  {
    id: 1,
    name: "真皮層",
    en: "Dermis",
    depth: "1.5–4 mm",
    effects: ["膠原訊號傳遞", "彈潤呵護"],
    accent: "#7B2FBE",
    surface: {
      highlight: "#FCF0E8",
      light: "#F2DDCD",
      mid: "#E4C2B0",
      shadow: "#CCA08A",
      deep: "#B08770",
    },
    pattern: "collagen",
  },
  {
    id: 2,
    name: "屏障層",
    en: "Barrier",
    depth: "深層",
    effects: ["舒緩紅敏", "修護乾燥不適"],
    accent: "#D4A89B",
    surface: {
      highlight: "#F5E4DC",
      light: "#E6C8BB",
      mid: "#D2A898",
      shadow: "#B58575",
      deep: "#8F6456",
    },
    pattern: "lipid",
  },
];

type LayerType = typeof layers[0];

/**
 * 精緻版皮膚層 — 珍珠光澤水嫩膚感
 *
 * 技術重點：
 * - 圓潤 bezier 邊緣（非直角）
 * - 多層漸層（頂/側/底）營造真 3D 感
 * - 程序化有機紋理（非重複 pattern tile）
 * - 柔霧高光 + 暖色 drop shadow
 */
function SkinLayer3D({ layer, active }: { layer: LayerType; active: boolean }) {
  const { id, surface, accent, pattern } = layer;

  return (
    <svg
      viewBox="0 0 600 340"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{
        filter: `drop-shadow(0 18px 32px rgba(180,130,100,0.22)) drop-shadow(0 6px 14px rgba(180,130,100,0.12))`,
      }}
    >
      <defs>
        {/* 頂面主漸層（弧形珍珠光） */}
        <radialGradient id={`top-${id}`} cx="50%" cy="25%" r="80%">
          <stop offset="0%" stopColor={surface.highlight} />
          <stop offset="30%" stopColor={surface.light} />
          <stop offset="70%" stopColor={surface.mid} />
          <stop offset="100%" stopColor={surface.shadow} />
        </radialGradient>

        {/* 前緣厚度漸層（半透明玻璃感） */}
        <linearGradient id={`front-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={surface.mid} stopOpacity="0.55" />
          <stop offset="50%" stopColor={surface.shadow} stopOpacity="0.35" />
          <stop offset="100%" stopColor={surface.deep} stopOpacity="0.45" />
        </linearGradient>

        {/* 右側面漸層 */}
        <linearGradient id={`side-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={surface.shadow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={surface.deep} stopOpacity="0.4" />
        </linearGradient>

        {/* 珍珠球體漸層（單顆珠使用） */}
        <radialGradient id={`pearl-${id}`} cx="32%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="18%" stopColor={surface.highlight} />
          <stop offset="55%" stopColor={surface.light} />
          <stop offset="90%" stopColor={surface.mid} />
          <stop offset="100%" stopColor={surface.shadow} />
        </radialGradient>

        {/* 頂面大面積弧形高光 */}
        <radialGradient id={`gloss-${id}`} cx="40%" cy="22%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="35%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* 邊緣柔光 */}
        <radialGradient id={`rim-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor={surface.highlight} stopOpacity="0.45" />
        </radialGradient>

        {/* 微邊緣羽化 */}
        <filter id={`soft-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>

        {/* 微血管用的柔光 */}
        <filter id={`vein-blur-${id}`}>
          <feGaussianBlur stdDeviation="0.5" />
        </filter>

        {/* 頂面波浪 clip — 與 top path 同步 */}
        <clipPath id={`top-clip-${id}`}>
          <path d="M 60 90 C 60 74, 80 66, 110 66 Q 150 56, 190 66 Q 230 78, 270 64 Q 310 50, 350 64 Q 390 76, 430 64 Q 470 54, 500 66 C 525 70, 540 76, 540 90 L 540 92 L 570 108 L 510 124 L 90 124 L 30 108 L 60 92 Z" />
        </clipPath>

        {/* 中間層透明玻璃 clip */}
        <clipPath id={`body-clip-${id}`}>
          <path d="M 30 108 L 570 108 L 570 256 C 570 270, 540 276, 500 276 L 100 276 C 60 276, 30 270, 30 256 Z" />
        </clipPath>
      </defs>

      {/* ═══ 地面陰影 ═══ */}
      <ellipse
        cx="300"
        cy="310"
        rx="240"
        ry="14"
        fill={surface.deep}
        opacity="0.18"
        filter={`url(#soft-${id})`}
      />

      {/* ═══ 右側面（薄片厚度，半透明玻璃） ═══ */}
      <path
        d="M 540 90 L 570 108 L 570 256 L 540 270 Z"
        fill={`url(#side-${id})`}
      />

      {/* ═══ 前緣厚度面（半透明玻璃本體） ═══ */}
      <path
        d="M 30 108 L 570 108 L 570 256 C 570 270, 540 276, 500 276 L 100 276 C 60 276, 30 270, 30 256 Z"
        fill={`url(#front-${id})`}
      />

      {/* 玻璃體內的微血管網絡（所有層可見，但不同密度） */}
      <g clipPath={`url(#body-clip-${id})`} opacity={pattern === "collagen" ? 0.7 : 0.35}>
        <CapillaryNetwork />
      </g>

      {/* 前緣水平切面線（極微弱） */}
      {[140, 180, 225, 258].map((y) => (
        <path
          key={y}
          d={`M 40 ${y} Q 300 ${y + 1.5}, 560 ${y}`}
          stroke={surface.deep}
          strokeWidth="0.5"
          fill="none"
          opacity="0.1"
        />
      ))}

      {/* 前緣右角玻璃反射 */}
      <path
        d="M 540 115 L 568 115 L 568 260 L 540 272 Z"
        fill="rgba(255,255,255,0.22)"
      />

      {/* 前緣整體玻璃高光（斜光澤） */}
      <path
        d="M 50 120 L 90 120 L 85 265 L 45 255 Z"
        fill="rgba(255,255,255,0.12)"
      />

      {/* ═══ 頂面（波浪珍珠形，同步 clipPath） ═══ */}
      <path
        d="M 60 90 C 60 74, 80 66, 110 66 Q 150 56, 190 66 Q 230 78, 270 64 Q 310 50, 350 64 Q 390 76, 430 64 Q 470 54, 500 66 C 525 70, 540 76, 540 90 L 540 92 L 570 108 L 510 124 L 90 124 L 30 108 L 60 92 Z"
        fill={`url(#top-${id})`}
      />

      {/* 頂面紋理 — 程序化有機（每層獨特） */}
      <g clipPath={`url(#top-clip-${id})`}>
        {pattern === "corneocytes" && <CorneocyteTexture surface={surface} id={id} />}
        {pattern === "collagen" && <CollagenTexture surface={surface} id={id} />}
        {pattern === "lipid" && <LipidTexture surface={surface} id={id} />}
      </g>

      {/* 頂面主弧形高光（珍珠光澤，從左上向右下擴散） */}
      <ellipse
        cx="230"
        cy="70"
        rx="180"
        ry="28"
        fill={`url(#gloss-${id})`}
        filter={`url(#soft-${id})`}
      />

      {/* 左側鋒利高光線（玻璃邊緣感） */}
      <path
        d="M 78 80 C 95 70, 130 66, 165 72 Q 200 80, 235 70"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 95 76 C 115 72, 150 70, 190 74"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 右上角玻璃反射 */}
      <path
        d="M 540 92 L 570 108 L 570 122 L 532 104 Z"
        fill="rgba(255,255,255,0.3)"
      />

      {/* 邊緣羽化 rim */}
      <path
        d="M 60 90 C 60 74, 80 66, 110 66 Q 150 56, 190 66 Q 230 78, 270 64 Q 310 50, 350 64 Q 390 76, 430 64 Q 470 54, 500 66 C 525 70, 540 76, 540 90 L 540 92 L 570 108 L 510 124 L 90 124 L 30 108 L 60 92 Z"
        fill={`url(#rim-${id})`}
        opacity="0.65"
      />

      {/* ═══ 外泌體粒子流入（active 時） ═══ */}
      {active && (
        <g>
          {[...Array(8)].map((_, i) => {
            const xs = [110, 180, 240, 300, 360, 420, 480, 150];
            const delays = [0, 0.3, 0.15, 0.45, 0.1, 0.35, 0.25, 0.5];
            return (
              <g key={i}>
                {/* 外層光暈 */}
                <motion.circle
                  cx={xs[i]}
                  r="9"
                  fill={accent}
                  opacity="0.18"
                  initial={{ cy: 30, opacity: 0, scale: 0.6 }}
                  animate={{
                    cy: [30, 180, 260],
                    opacity: [0, 0.35, 0],
                    scale: [0.6, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    delay: delays[i],
                    repeat: Infinity,
                    ease: [0.33, 0, 0.67, 1],
                  }}
                />
                {/* 核心亮點 */}
                <motion.circle
                  cx={xs[i]}
                  r="3"
                  fill="#F5E6B8"
                  filter={`drop-shadow(0 0 5px ${accent})`}
                  initial={{ cy: 30, opacity: 0 }}
                  animate={{
                    cy: [30, 180, 260],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: delays[i],
                    repeat: Infinity,
                    ease: [0.33, 0, 0.67, 1],
                  }}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* 左下角浮水印 */}
      <text
        x="40"
        y="330"
        fill={accent}
        opacity="0.35"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="11"
        fontStyle="italic"
        letterSpacing="2.5"
      >
        {layer.en}
      </text>
    </svg>
  );
}

/** 表皮層紋理 — 整齊排列的珍珠角質細胞（3 行，跟隨波浪弧度） */
function CorneocyteTexture({ surface, id }: { surface: LayerType["surface"]; id: number }) {
  const rows = [
    { y: 74, count: 18, rBase: 8, waveAmp: 8 },    // 頂行，跟波峰
    { y: 94, count: 20, rBase: 7, waveAmp: 4 },    // 中行
    { y: 112, count: 22, rBase: 6, waveAmp: 2 },   // 底行
  ];
  return (
    <>
      {rows.map((row, ri) => {
        const startX = 42;
        const endX = 540;
        const step = (endX - startX) / (row.count - 1);
        return Array.from({ length: row.count }).map((_, i) => {
          const x = startX + i * step;
          // 波浪 y 偏移（模擬頂面起伏）
          const waveY = row.y + Math.sin((x / 60) + ri * 0.6) * row.waveAmp;
          const r = row.rBase - (ri === 0 ? 0 : 0.3);
          return (
            <g key={`${ri}-${i}`}>
              {/* 珠下陰影（帶偏移） */}
              <ellipse cx={x + 0.8} cy={waveY + r * 0.18} rx={r * 0.96} ry={r * 0.85} fill={surface.shadow} opacity="0.32" />
              {/* 珍珠主體 — 用 radial gradient */}
              <circle cx={x} cy={waveY} r={r} fill={`url(#pearl-${id})`} />
              {/* 頂部 specular 高光 */}
              <ellipse cx={x - r * 0.32} cy={waveY - r * 0.4} rx={r * 0.28} ry={r * 0.2} fill="rgba(255,255,255,0.92)" />
              {/* 珠間接觸陰影（加強立體） */}
              <ellipse cx={x + r * 0.85} cy={waveY + r * 0.35} rx={r * 0.15} ry={r * 0.1} fill={surface.deep} opacity="0.2" />
            </g>
          );
        });
      })}
    </>
  );
}

/** 真皮層紋理 — 膠原纖維交織 */
function CollagenTexture({ surface }: { surface: LayerType["surface"]; id: number }) {
  return (
    <>
      {/* 波浪狀膠原束 */}
      {[74, 86, 98, 110].map((y, idx) => (
        <path
          key={idx}
          d={`M 40 ${y} Q 100 ${y - 4 + idx}, 170 ${y + idx % 2} T 300 ${y} T 430 ${y - 2} T 570 ${y + 1}`}
          stroke={surface.shadow}
          strokeWidth={idx % 2 === 0 ? 0.9 : 0.6}
          fill="none"
          opacity={0.4 - idx * 0.05}
        />
      ))}
      {/* 細胞核 */}
      {[[110, 82], [195, 94], [280, 78], [365, 90], [450, 84], [515, 96]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill={surface.deep} opacity="0.55" />
      ))}
      {/* 纖維交叉 */}
      {[[150, 88], [260, 96], [340, 84], [420, 100]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x - 6} ${y - 6} L ${x + 6} ${y + 6}`} stroke={surface.shadow} strokeWidth="0.5" opacity="0.5" />
          <path d={`M ${x + 6} ${y - 6} L ${x - 6} ${y + 6}`} stroke={surface.shadow} strokeWidth="0.5" opacity="0.5" />
        </g>
      ))}
    </>
  );
}

/** 屏障層紋理 — 脂質雙層微結構 */
function LipidTexture({ surface }: { surface: LayerType["surface"]; id: number }) {
  const bubbles = [
    { x: 75, y: 82, r: 5.5 }, { x: 112, y: 94, r: 4 }, { x: 148, y: 82, r: 6 },
    { x: 188, y: 96, r: 4.5 }, { x: 228, y: 84, r: 5.5 }, { x: 268, y: 94, r: 4 },
    { x: 308, y: 84, r: 6 }, { x: 348, y: 96, r: 4.5 }, { x: 388, y: 82, r: 5.5 },
    { x: 428, y: 94, r: 4 }, { x: 468, y: 84, r: 6 }, { x: 508, y: 94, r: 4.5 },
    { x: 92, y: 108, r: 3 }, { x: 132, y: 110, r: 3.5 }, { x: 172, y: 108, r: 3.2 },
    { x: 212, y: 110, r: 3.6 }, { x: 252, y: 108, r: 3 }, { x: 292, y: 110, r: 3.5 },
    { x: 332, y: 108, r: 3.2 }, { x: 372, y: 110, r: 3.6 }, { x: 412, y: 108, r: 3 },
    { x: 452, y: 110, r: 3.5 }, { x: 492, y: 108, r: 3.2 },
  ];
  return (
    <>
      {bubbles.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={surface.shadow} opacity="0.3" />
          <circle cx={b.x} cy={b.y} r={b.r - 1.2} fill={surface.light} opacity="0.7" />
          <circle cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.3} r={b.r * 0.25} fill="rgba(255,255,255,0.75)" />
        </g>
      ))}
    </>
  );
}

/** 微血管網絡（玻璃體內可見的粉色血管分支） */
function CapillaryNetwork() {
  return (
    <>
      {/* 主幹水平血管（3 條） */}
      <path d="M 40 160 Q 120 150, 200 162 Q 280 170, 360 158 Q 440 148, 540 156" stroke="#D97A8A" strokeWidth="0.9" fill="none" opacity="0.7" />
      <path d="M 50 200 Q 150 192, 240 202 Q 330 208, 420 198 Q 500 190, 560 196" stroke="#D97A8A" strokeWidth="0.75" fill="none" opacity="0.6" />
      <path d="M 45 238 Q 130 230, 220 240 Q 310 246, 400 236 Q 490 228, 555 232" stroke="#D97A8A" strokeWidth="0.8" fill="none" opacity="0.65" />

      {/* 主分支（向下延伸） */}
      <path d="M 120 160 Q 128 178, 138 198 Q 146 218, 152 238" stroke="#D97A8A" strokeWidth="0.65" fill="none" opacity="0.55" />
      <path d="M 250 162 Q 260 180, 268 200 Q 275 220, 282 240" stroke="#D97A8A" strokeWidth="0.65" fill="none" opacity="0.55" />
      <path d="M 380 160 Q 388 180, 398 200 Q 405 220, 412 240" stroke="#D97A8A" strokeWidth="0.65" fill="none" opacity="0.55" />
      <path d="M 480 158 Q 488 176, 494 196 Q 500 218, 506 236" stroke="#D97A8A" strokeWidth="0.55" fill="none" opacity="0.5" />

      {/* 側分支 */}
      <path d="M 175 170 Q 195 178, 215 182" stroke="#D97A8A" strokeWidth="0.5" fill="none" opacity="0.45" />
      <path d="M 315 202 Q 338 208, 362 210" stroke="#D97A8A" strokeWidth="0.5" fill="none" opacity="0.45" />
      <path d="M 160 218 Q 180 224, 200 230" stroke="#D97A8A" strokeWidth="0.5" fill="none" opacity="0.45" />
      <path d="M 420 236 Q 442 240, 462 242" stroke="#D97A8A" strokeWidth="0.5" fill="none" opacity="0.45" />
      <path d="M 88 196 Q 102 200, 116 204" stroke="#D97A8A" strokeWidth="0.4" fill="none" opacity="0.4" />
      <path d="M 520 218 Q 530 226, 538 234" stroke="#D97A8A" strokeWidth="0.4" fill="none" opacity="0.4" />

      {/* 微細末端 */}
      <path d="M 94 215 Q 102 225, 108 240" stroke="#D97A8A" strokeWidth="0.4" fill="none" opacity="0.38" />
      <path d="M 540 212 Q 548 224, 552 238" stroke="#D97A8A" strokeWidth="0.4" fill="none" opacity="0.38" />
      <path d="M 340 168 Q 348 180, 352 192" stroke="#D97A8A" strokeWidth="0.35" fill="none" opacity="0.35" />
      <path d="M 216 172 Q 224 184, 228 196" stroke="#D97A8A" strokeWidth="0.35" fill="none" opacity="0.35" />
    </>
  );
}

// 層文字資訊卡（玻璃擬態 — 淺色背景適用）
function LayerInfo({ layer }: { layer: LayerType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
    >
      <div
        className="text-center rounded-2xl px-8 py-6"
        style={{
          background: "rgba(255, 251, 245, 0.78)",
          backdropFilter: "blur(18px) saturate(1.2)",
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
          boxShadow: `
            0 12px 40px -10px rgba(100, 60, 40, 0.18),
            0 4px 14px -4px rgba(100, 60, 40, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -1px 0 rgba(100, 60, 40, 0.06)
          `,
          border: "1px solid rgba(255, 255, 255, 0.55)",
        }}
      >
        <p
          className="text-[0.6rem] tracking-[0.38em] uppercase mb-2.5 font-body font-semibold"
          style={{ color: layer.accent }}
        >
          {layer.en}
        </p>
        <h4 className="font-serif-tc text-2xl md:text-[1.7rem] text-night font-semibold mb-1.5 leading-tight">
          {layer.name}
        </h4>
        <p className="text-[0.65rem] text-night/50 font-body mb-4 tracking-wider font-number">
          {layer.depth}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {layer.effects.map((e) => (
            <span
              key={e}
              className="px-3 py-1 text-[0.68rem] font-body rounded-full border"
              style={{
                borderColor: `${layer.accent}44`,
                color: layer.accent,
                background: "rgba(255,255,255,0.55)",
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SkinLayers() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState(-1);

  // 改用 CSS sticky + 原生 scroll progress (移除 GSAP pin，避免 DOM 突變)
  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));
      if (p < 0.15) setActiveLayer(-1);
      else if (p < 0.4) setActiveLayer(0);
      else if (p < 0.65) setActiveLayer(1);
      else setActiveLayer(2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={outerRef} style={{ height: "450vh" }} className="relative">
    <section
      className="sticky top-0 h-screen w-full overflow-hidden noise-overlay"
      style={{
        background: `
          radial-gradient(ellipse 95% 70% at 50% 35%, #FFFCF8 0%, #F8EEE4 45%, #EFDCCE 100%)
        `,
      }}
    >
      {/* 裝飾性光斑（淺紫 + 暖金） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 600px at 18% 20%, rgba(155, 93, 212, 0.08) 0%, transparent 60%),
            radial-gradient(circle 500px at 82% 75%, rgba(184, 149, 63, 0.1) 0%, transparent 60%)
          `,
        }}
      />

      {/* 頂部小標題 */}
      <div className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 z-30 text-center">
        <p className="text-[0.6rem] text-brand/70 uppercase tracking-[0.38em] font-body font-semibold mb-2">
          Three-Layer Delivery
        </p>
        <h3 className="font-serif-tc text-lg md:text-xl text-night/85 font-medium">
          三層修護，層層精準
        </h3>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent mx-auto mt-3" />
      </div>

      {/* 右下 tagline */}
      <AnimatePresence>
        {activeLayer >= 0 && (
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0 }}
            className="hidden lg:block absolute bottom-16 right-14 z-20 max-w-xs text-right
                       font-elegant italic text-sm text-night/55 leading-relaxed"
          >
            不是疊加一層保養，<br />
            是送一封訊息給妳的細胞。
          </motion.p>
        )}
      </AnimatePresence>

      {/* 主視覺 — 3D 皮膚剖面堆疊 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-[520px] h-[480px] md:w-[620px] md:h-[540px]"
          style={{ perspective: "1800px", perspectiveOrigin: "50% 35%" }}
        >
          {/* 屏障層（最底） */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full" style={{ top: "200px" }}>
            <SkinLayer3D layer={layers[2]} active={activeLayer === 2} />
            <AnimatePresence>
              {activeLayer === 2 && <LayerInfo layer={layers[2]} />}
            </AnimatePresence>
          </div>

          {/* 真皮層 */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-full"
            style={{ top: "100px", transformStyle: "preserve-3d", transformOrigin: "center top" }}
            animate={
              activeLayer >= 2
                ? { rotateX: -62, y: -70, opacity: 0.72 }
                : { rotateX: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkinLayer3D layer={layers[1]} active={activeLayer === 1} />
            <AnimatePresence>
              {activeLayer === 1 && <LayerInfo layer={layers[1]} />}
            </AnimatePresence>
          </motion.div>

          {/* 表皮層（最上） */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-full"
            style={{ top: "0px", transformStyle: "preserve-3d", transformOrigin: "center top" }}
            animate={
              activeLayer >= 1
                ? { rotateX: -60, y: -80, opacity: 0.72 }
                : { rotateX: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkinLayer3D layer={layers[0]} active={activeLayer === 0 || activeLayer === -1} />
            <AnimatePresence>
              {activeLayer === 0 && <LayerInfo layer={layers[0]} />}
            </AnimatePresence>

            {/* 初始提示 */}
            <AnimatePresence>
              {activeLayer === -1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="text-center rounded-2xl px-7 py-5"
                    style={{
                      background: "rgba(255, 251, 245, 0.82)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                      boxShadow: "0 12px 32px -8px rgba(100, 60, 40, 0.18)",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-11 h-11 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{
                        border: "1.5px solid rgba(123, 47, 190, 0.35)",
                        background: "rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      <span className="text-brand text-base">↓</span>
                    </motion.div>
                    <p className="font-serif-tc text-base text-night/85 font-medium">
                      滾動，掀開妳的肌膚
                    </p>
                    <p className="text-[0.55rem] text-night/45 mt-1 font-body tracking-[0.28em] uppercase">
                      Scroll to reveal
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 左側層級指示（淺色背景適用） */}
      <div className="absolute left-6 lg:left-16 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col gap-5">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              animate={{
                opacity: activeLayer === i ? 1 : 0.35,
                x: activeLayer === i ? 4 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeLayer === i ? layer.accent : "rgba(58, 31, 22, 0.2)",
                    boxShadow: activeLayer === i ? `0 0 20px ${layer.accent}99` : "none",
                  }}
                />
                {i < layers.length - 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-7 bg-night/10" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="font-elegant italic text-[0.6rem] text-night/40 tracking-wider">
                  Layer {i + 1}
                </p>
                <p className="font-sans-tc text-xs text-night/85">{layer.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 滾動提示 */}
      <motion.p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20
                   font-elegant italic text-[0.6rem] text-night/35 tracking-[0.3em]"
        animate={{ opacity: activeLayer < 2 ? 1 : 0 }}
      >
        keep scrolling
      </motion.p>
    </section>
    </div>
  );
}
