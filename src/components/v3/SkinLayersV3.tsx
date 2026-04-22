"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//   SkinLayersV3 — Hyper-realistic skin cross-section
//   表皮(Epidermis) / 真皮(Dermis) / 皮下屏障(Hypodermis)
//
//   4K 精細度要素:
//   ─ 真實膚色漸層(米→杏→焦糖→深棕)
//   ─ fractalNoise 紙漾皮膚紋理
//   ─ 波浪狀層界(Dermal Papillae 真皮乳突)
//   ─ 解剖結構:毛囊 + 毛球 / 皮脂腺 / 汗腺 / 血管 / 膠原纖維 / 脂肪細胞
//   ─ 外泌體金點從表面滲透向下(真的在做事)
// ═══════════════════════════════════════════════════════════════

// Deterministic pseudo-random for stable SVG
function seedRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export function SkinLayersV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  // Static pore / cell / fibroblast positions (seeded)
  const staticDots = useMemo(() => {
    const r = seedRandom(17);
    return {
      // Epidermal pores (dark dots)
      pores: Array.from({ length: 55 }, () => ({
        x: r() * 1200,
        y: r() * 130 + 10,
        radius: 0.6 + r() * 1.4,
        opacity: 0.22 + r() * 0.4,
      })),
      // Epidermal cell highlights (bright)
      cells: Array.from({ length: 28 }, () => ({
        x: r() * 1200,
        y: r() * 120 + 20,
        radius: 1.8 + r() * 3.2,
        opacity: 0.28 + r() * 0.35,
      })),
      // Fibroblasts (spindle cells in dermis)
      fibroblasts: Array.from({ length: 18 }, () => ({
        x: 60 + r() * 1080,
        y: 200 + r() * 240,
        rx: 4.5 + r() * 3,
        ry: 1.6 + r() * 1,
        rotate: r() * 180,
        opacity: 0.35 + r() * 0.3,
      })),
      // Dermal micro-texture dots
      dermisTexture: Array.from({ length: 50 }, () => ({
        x: r() * 1200,
        y: 170 + r() * 300,
        radius: 0.6 + r() * 1.2,
        opacity: 0.2 + r() * 0.25,
      })),
    };
  }, []);

  // Descending exosome paths (top → skin)
  const exosomeStreams = [
    { x: 220, delay: 0 },
    { x: 540, delay: 0.8 },
    { x: 820, delay: 0.4 },
    { x: 1000, delay: 1.2 },
  ];

  // Stationary exosomes glowing at reception points within each layer
  const stationaryExosomes = [
    { x: 160, y: 80, layer: 0, delay: 1.6 },
    { x: 430, y: 95, layer: 0, delay: 1.8 },
    { x: 750, y: 110, layer: 0, delay: 2.0 },
    { x: 1070, y: 85, layer: 0, delay: 2.2 },
    { x: 100, y: 240, layer: 1, delay: 2.4 },
    { x: 380, y: 320, layer: 1, delay: 2.6 },
    { x: 680, y: 280, layer: 1, delay: 2.8 },
    { x: 950, y: 380, layer: 1, delay: 3.0 },
    { x: 250, y: 580, layer: 2, delay: 3.2 },
    { x: 620, y: 610, layer: 2, delay: 3.4 },
    { x: 960, y: 590, layer: 2, delay: 3.6 },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-paper-cream paper-texture py-32 md:py-40 px-8 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1300px] mx-auto">
        {/* ─── Header ─── */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif-tc text-vermillion/85 text-sm tracking-[0.55em] mb-4"
          >
            肆 · 皮膚解剖
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-ink text-[clamp(2.5rem,6vw,4.5rem)] leading-tight"
          >
            Anatomy of a <span className="text-leaf-goldDeep">Ritual</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-sans-tc text-ink/60 mt-6 text-lg max-w-xl mx-auto font-light leading-loose"
          >
            外泌體從表皮滲入真皮,把「修護」的訊息送到細胞之間。
          </motion.p>
        </div>

        {/* ─── Skin Cross-section SVG ─── */}
        <div className="relative">
          <motion.svg
            viewBox="0 0 1200 700"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid slice"
            style={{
              filter: "drop-shadow(0 25px 45px rgba(120,70,50,0.18)) drop-shadow(0 10px 20px rgba(120,70,50,0.1))",
              borderRadius: "3px",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <defs>
              {/* Skin grain filter - subtle cellular/pore texture */}
              <filter id="skin-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="3"
                  seed="7"
                  result="noise"
                />
                <feColorMatrix
                  in="noise"
                  values="0 0 0 0 0.42  0 0 0 0 0.26  0 0 0 0 0.16  0 0 0 0.18 0"
                  result="colored"
                />
                <feComposite in="SourceGraphic" in2="colored" operator="in" />
              </filter>

              {/* Overlay grain for depth */}
              <filter id="depth-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="3" />
                <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0.22 0" />
                <feComposite in="SourceGraphic" operator="in" />
              </filter>

              {/* ── Gradients ── */}
              <linearGradient id="grad-epi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF5E6" />
                <stop offset="15%" stopColor="#FEEDD6" />
                <stop offset="45%" stopColor="#F6DFC2" />
                <stop offset="80%" stopColor="#EBC8A9" />
                <stop offset="100%" stopColor="#E0B89F" />
              </linearGradient>

              <linearGradient id="grad-dermis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E0B89F" />
                <stop offset="35%" stopColor="#D4A88E" />
                <stop offset="70%" stopColor="#BA8F77" />
                <stop offset="100%" stopColor="#A87A61" />
              </linearGradient>

              <linearGradient id="grad-hypo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C89A82" />
                <stop offset="60%" stopColor="#AA7862" />
                <stop offset="100%" stopColor="#8F6456" />
              </linearGradient>

              {/* Surface gloss gradient */}
              <linearGradient id="grad-gloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Blood capillary gradient */}
              <linearGradient id="grad-blood" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7B2A2F" />
                <stop offset="50%" stopColor="#A82F3E" />
                <stop offset="100%" stopColor="#5B2A6E" />
              </linearGradient>

              {/* Radial for exosome dots */}
              <radialGradient id="grad-exosome">
                <stop offset="0%" stopColor="#FFEBBF" />
                <stop offset="40%" stopColor="#E6CFA0" />
                <stop offset="100%" stopColor="#C9A46B" stopOpacity="0" />
              </radialGradient>

              {/* Collagen fiber pattern */}
              <pattern
                id="pat-collagen"
                x="0"
                y="0"
                width="160"
                height="45"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 22 Q 40 6, 80 22 T 160 22"
                  fill="none"
                  stroke="#7A4F3A"
                  strokeWidth="1.2"
                  opacity="0.42"
                />
                <path
                  d="M 0 12 Q 40 28, 80 12 T 160 12"
                  fill="none"
                  stroke="#5E3A28"
                  strokeWidth="0.8"
                  opacity="0.35"
                />
                <path
                  d="M 0 34 Q 40 18, 80 34 T 160 34"
                  fill="none"
                  stroke="#8E6555"
                  strokeWidth="0.9"
                  opacity="0.32"
                />
              </pattern>

              {/* Fat cell cluster pattern (adipocytes) */}
              <pattern
                id="pat-fat"
                x="0"
                y="0"
                width="210"
                height="200"
                patternUnits="userSpaceOnUse"
              >
                <g fill="#EDD0B4" stroke="#8E5F47" strokeWidth="1.3">
                  <circle cx="45" cy="50" r="36" opacity="0.75" />
                  <circle cx="122" cy="60" r="42" opacity="0.78" />
                  <circle cx="185" cy="95" r="30" opacity="0.72" />
                  <circle cx="60" cy="130" r="38" opacity="0.76" />
                  <circle cx="140" cy="155" r="34" opacity="0.74" />
                  <circle cx="20" cy="185" r="26" opacity="0.7" />
                </g>
                {/* Inner highlights */}
                <g fill="#F7DFC4" opacity="0.5">
                  <circle cx="35" cy="40" r="8" />
                  <circle cx="112" cy="48" r="10" />
                  <circle cx="175" cy="85" r="7" />
                  <circle cx="50" cy="118" r="9" />
                  <circle cx="130" cy="143" r="8" />
                </g>
              </pattern>

              {/* Clip path for wavy layer boundaries */}
              <clipPath id="clip-epi">
                <path
                  d="M 0 0 L 1200 0 L 1200 150
                     Q 1170 166, 1140 158 Q 1110 150, 1080 162 Q 1050 170, 1020 158
                     Q 990 148, 960 162 Q 930 170, 900 156 Q 870 148, 840 160
                     Q 810 168, 780 154 Q 750 146, 720 160 Q 690 168, 660 156
                     Q 630 148, 600 160 Q 570 168, 540 156 Q 510 148, 480 162
                     Q 450 168, 420 154 Q 390 148, 360 160 Q 330 168, 300 154
                     Q 270 146, 240 160 Q 210 168, 180 154 Q 150 146, 120 158
                     Q 90 166, 60 152 Q 30 146, 0 158 Z"
                />
              </clipPath>

              <clipPath id="clip-dermis">
                <path
                  d="M 0 160 Q 30 146, 60 152 Q 90 166, 120 158 Q 150 146, 180 154
                     Q 210 168, 240 160 Q 270 146, 300 154 Q 330 168, 360 160
                     Q 390 148, 420 154 Q 450 168, 480 162 Q 510 148, 540 156
                     Q 570 168, 600 160 Q 630 148, 660 156 Q 690 168, 720 160
                     Q 750 146, 780 154 Q 810 168, 840 160 Q 870 148, 900 156
                     Q 930 170, 960 162 Q 990 148, 1020 158 Q 1050 170, 1080 162
                     Q 1110 150, 1140 158 Q 1170 166, 1200 150 L 1200 478
                     Q 1170 488, 1140 482 Q 1110 476, 1080 486 Q 1050 492, 1020 480
                     Q 990 472, 960 484 Q 930 492, 900 480 Q 870 472, 840 484
                     Q 810 492, 780 478 Q 750 472, 720 484 Q 690 492, 660 480
                     Q 630 472, 600 484 Q 570 492, 540 480 Q 510 472, 480 486
                     Q 450 492, 420 478 Q 390 472, 360 484 Q 330 492, 300 478
                     Q 270 472, 240 484 Q 210 492, 180 478 Q 150 472, 120 482
                     Q 90 490, 60 476 Q 30 472, 0 482 Z"
                />
              </clipPath>
            </defs>

            {/* ──────────── LAYER 1: EPIDERMIS ──────────── */}
            <g clipPath="url(#clip-epi)">
              {/* base */}
              <rect x="0" y="0" width="1200" height="170" fill="url(#grad-epi)" />
              {/* skin grain */}
              <rect
                x="0"
                y="0"
                width="1200"
                height="170"
                fill="url(#grad-epi)"
                filter="url(#skin-grain)"
                opacity="0.85"
              />
              {/* surface gloss */}
              <rect x="0" y="0" width="1200" height="50" fill="url(#grad-gloss)" />
              {/* epidermal cells (bright highlights) */}
              {staticDots.cells.map((c, i) => (
                <circle
                  key={`cell-${i}`}
                  cx={c.x}
                  cy={c.y}
                  r={c.radius}
                  fill="#FFFBF0"
                  opacity={c.opacity}
                />
              ))}
              {/* pores (dark dots) */}
              {staticDots.pores.map((p, i) => (
                <circle
                  key={`pore-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={p.radius}
                  fill="#7A4A38"
                  opacity={p.opacity}
                />
              ))}
              {/* hair emerging from follicle opening */}
              <path
                d="M 282 8 Q 286 4, 282 0"
                stroke="#2A1A10"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>

            {/* ──────────── LAYER 2: DERMIS ──────────── */}
            <g clipPath="url(#clip-dermis)">
              {/* base */}
              <rect x="0" y="160" width="1200" height="320" fill="url(#grad-dermis)" />
              {/* collagen fiber pattern */}
              <rect
                x="0"
                y="160"
                width="1200"
                height="320"
                fill="url(#pat-collagen)"
              />
              {/* skin grain overlay */}
              <rect
                x="0"
                y="160"
                width="1200"
                height="320"
                fill="url(#grad-dermis)"
                filter="url(#skin-grain)"
                opacity="0.4"
              />
              {/* dermal micro-texture dots */}
              {staticDots.dermisTexture.map((d, i) => (
                <circle
                  key={`dt-${i}`}
                  cx={d.x}
                  cy={d.y}
                  r={d.radius}
                  fill="#5E3A28"
                  opacity={d.opacity}
                />
              ))}
              {/* fibroblast cells (spindle shapes) */}
              {staticDots.fibroblasts.map((f, i) => (
                <ellipse
                  key={`fb-${i}`}
                  cx={f.x}
                  cy={f.y}
                  rx={f.rx}
                  ry={f.ry}
                  fill="#6E4532"
                  opacity={f.opacity}
                  transform={`rotate(${f.rotate} ${f.x} ${f.y})`}
                />
              ))}

              {/* Blood capillaries (wavy red-to-purple) */}
              <path
                d="M 70 250 Q 170 238, 270 258 T 470 248 T 670 268 T 870 252 T 1130 262"
                stroke="url(#grad-blood)"
                strokeWidth="2.2"
                fill="none"
                opacity="0.78"
                strokeLinecap="round"
              />
              <path
                d="M 40 380 Q 140 368, 240 384 T 440 372 T 640 390 T 840 378 T 1040 390 T 1200 384"
                stroke="url(#grad-blood)"
                strokeWidth="1.6"
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />
              <path
                d="M 480 200 Q 510 240, 492 290 T 510 380 T 498 460"
                stroke="#8B3040"
                strokeWidth="1.2"
                fill="none"
                opacity="0.55"
                strokeLinecap="round"
              />

              {/* Hair follicle (slanted diagonal tube) */}
              <g opacity="0.9">
                {/* outer follicle wall */}
                <path
                  d="M 272 160 Q 258 250, 270 340 Q 282 420, 296 478"
                  stroke="#7B5440"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* inner root sheath */}
                <path
                  d="M 280 160 Q 266 250, 278 340 Q 290 420, 304 478"
                  stroke="#5B3A2A"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* hair shaft inside */}
                <path
                  d="M 284 160 Q 270 250, 282 340 Q 294 420, 308 478"
                  stroke="#2A1A10"
                  strokeWidth="1.8"
                  fill="none"
                />
              </g>

              {/* Sebaceous gland (cluster of rounded lobes near follicle) */}
              <g transform="translate(310, 280)" opacity="0.82">
                <circle cx="0" cy="0" r="16" fill="#D8AA8C" stroke="#8E5F47" strokeWidth="1.2" />
                <circle cx="14" cy="-8" r="11" fill="#D8AA8C" stroke="#8E5F47" strokeWidth="1.2" />
                <circle cx="-3" cy="14" r="12" fill="#D8AA8C" stroke="#8E5F47" strokeWidth="1.2" />
                <circle cx="20" cy="8" r="9" fill="#D8AA8C" stroke="#8E5F47" strokeWidth="1" />
                {/* inner highlights */}
                <circle cx="-3" cy="-5" r="4" fill="#F0D0B0" opacity="0.7" />
                <circle cx="12" cy="-11" r="3" fill="#F0D0B0" opacity="0.7" />
                <circle cx="-5" cy="11" r="3.5" fill="#F0D0B0" opacity="0.7" />
                {/* duct to follicle */}
                <path d="M -13 -4 Q -22 -10, -25 -20" stroke="#8E5F47" strokeWidth="1.5" fill="none" />
              </g>

              {/* Sweat gland (coiled tube, right side) */}
              <g transform="translate(860, 400)" opacity="0.72">
                <path
                  d="M 0 0 Q -10 -14, 6 -20 Q 20 -14, 10 -4 Q -6 2, 2 14
                     Q 16 18, 8 28 Q -4 32, 4 44 Q 18 46, 10 56"
                  stroke="#7A5240"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Sweat duct going up */}
                <path
                  d="M 4 -20 Q 0 -40, 8 -60 Q 14 -80, 6 -100"
                  stroke="#7A5240"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>
            </g>

            {/* ──────────── LAYER 3: HYPODERMIS ──────────── */}
            <g>
              {/* wavy top + base */}
              <path
                d="M 0 478 Q 30 472, 60 482 Q 90 490, 120 476 Q 150 470, 180 482
                   Q 210 490, 240 478 Q 270 472, 300 484 Q 330 492, 360 478
                   Q 390 472, 420 484 Q 450 492, 480 480 Q 510 472, 540 484
                   Q 570 492, 600 480 Q 630 472, 660 484 Q 690 492, 720 480
                   Q 750 472, 780 484 Q 810 490, 840 478 Q 870 472, 900 482
                   Q 930 490, 960 480 Q 990 472, 1020 482 Q 1050 490, 1080 478
                   Q 1110 472, 1140 484 Q 1170 490, 1200 478
                   L 1200 700 L 0 700 Z"
                fill="url(#grad-hypo)"
              />
              {/* Fat cell cluster pattern */}
              <rect x="0" y="480" width="1200" height="220" fill="url(#pat-fat)" opacity="0.85" />
              {/* skin grain overlay */}
              <rect
                x="0"
                y="480"
                width="1200"
                height="220"
                fill="url(#grad-hypo)"
                filter="url(#skin-grain)"
                opacity="0.3"
              />

              {/* Hair follicle bulb (end of follicle) */}
              <g>
                <circle cx="312" cy="536" r="12" fill="#2A1A10" stroke="#5B3A2A" strokeWidth="1.5" />
                <circle cx="310" cy="533" r="4" fill="#5B3A2A" opacity="0.8" />
                {/* papilla */}
                <path
                  d="M 312 548 Q 316 554, 320 560"
                  stroke="#A82F3E"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.7"
                />
              </g>

              {/* Sweat gland coil (continues from dermis) */}
              <g transform="translate(860, 510)" opacity="0.75">
                <circle cx="0" cy="0" r="22" fill="none" stroke="#7A5240" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
                <path
                  d="M -10 -15 Q 10 -10, 10 5 Q 10 15, -5 18 Q -18 15, -15 0 Q -12 -12, 0 -15"
                  stroke="#7A5240"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* Connective tissue septa (dividing lines between fat lobes) */}
              <path
                d="M 0 560 Q 200 555, 400 565 T 800 555 T 1200 565"
                stroke="#6E4532"
                strokeWidth="0.8"
                fill="none"
                opacity="0.45"
              />
              <path
                d="M 0 640 Q 200 635, 400 645 T 800 635 T 1200 645"
                stroke="#6E4532"
                strokeWidth="0.7"
                fill="none"
                opacity="0.4"
              />
            </g>

            {/* ──────────── EXOSOME ANIMATIONS (overlay) ──────────── */}

            {/* Descending exosome streams (from above the skin → into layers) */}
            {inView &&
              exosomeStreams.map((stream) => (
                <g key={`stream-${stream.x}`}>
                  {[0, 1, 2].map((i) => (
                    <motion.g key={i}>
                      <motion.circle
                        cx={stream.x}
                        cy={-10}
                        r="5"
                        fill="url(#grad-exosome)"
                        initial={{ opacity: 0, cy: -10 }}
                        animate={{
                          opacity: [0, 0.95, 0.75, 0.3, 0],
                          cy: [-10, 80, 260, 480, 640],
                        }}
                        transition={{
                          duration: 4.2,
                          delay: stream.delay + i * 1.3,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: "easeInOut",
                        }}
                      />
                      {/* Halo ring */}
                      <motion.circle
                        cx={stream.x}
                        cy={-10}
                        r="10"
                        fill="none"
                        stroke="#E6CFA0"
                        strokeWidth="0.8"
                        initial={{ opacity: 0, cy: -10 }}
                        animate={{
                          opacity: [0, 0.5, 0.3, 0.1, 0],
                          cy: [-10, 80, 260, 480, 640],
                          r: [10, 14, 16, 12, 8],
                        }}
                        transition={{
                          duration: 4.2,
                          delay: stream.delay + i * 1.3,
                          repeat: Infinity,
                          repeatDelay: 0.8,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.g>
                  ))}
                </g>
              ))}

            {/* Stationary exosome "reception points" pulsing within each layer */}
            {inView &&
              stationaryExosomes.map((exo, i) => (
                <g key={`stat-${i}`}>
                  <motion.circle
                    cx={exo.x}
                    cy={exo.y}
                    r={5}
                    fill="url(#grad-exosome)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0.6], scale: [0, 1.15, 1] }}
                    transition={{ duration: 1, delay: exo.delay }}
                    style={{ transformOrigin: `${exo.x}px ${exo.y}px` }}
                  />
                  <motion.circle
                    cx={exo.x}
                    cy={exo.y}
                    r={12}
                    fill="none"
                    stroke="#C9A46B"
                    strokeWidth="0.8"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [1, 2.4, 1] }}
                    transition={{
                      duration: 2.6,
                      delay: exo.delay + 0.4,
                      repeat: Infinity,
                      repeatDelay: 0.4,
                    }}
                    style={{ transformOrigin: `${exo.x}px ${exo.y}px` }}
                  />
                </g>
              ))}
          </motion.svg>

          {/* ─── Layer labels overlay (right side) ─── */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { tc: "表皮層", en: "Epidermis", depth: "0.05–0.1 mm", detail: "提亮 · 細緻 · 保濕重建", y: 11 },
              { tc: "真皮層", en: "Dermis", depth: "1.5–4 mm", detail: "膠原訊號傳遞 · 彈潤呵護", y: 45 },
              { tc: "皮下屏障", en: "Hypodermal Barrier", depth: "深層", detail: "舒緩紅敏 · 修護乾燥", y: 84 },
            ].map((layer, i) => (
              <motion.div
                key={layer.en}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: 1.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-3 md:right-10 pointer-events-auto bg-paper-cream/75 backdrop-blur-sm px-4 py-3 border border-leaf-gold/30"
                style={{
                  top: `${layer.y}%`,
                  transform: "translateY(-50%)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-leaf-gold" />
                  <div>
                    <p className="font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.4em] uppercase mb-1">
                      {layer.en}
                    </p>
                    <h3 className="font-serif-tc text-ink text-lg md:text-xl font-medium leading-tight">
                      {layer.tc}
                    </h3>
                    <p className="font-sans-tc text-ink/55 text-[0.7rem] mt-1">
                      {layer.depth} · {layer.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Caption ─── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2 }}
          className="text-center mt-10 font-elegant italic text-ink/40 text-[0.7rem] tracking-[0.3em] uppercase"
        >
          Cross-section of human skin · exosomes descending from epidermis
        </motion.p>
      </div>
    </section>
  );
}
