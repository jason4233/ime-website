"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//   SkinLayersV3 — Anatomy of a Treatment
//   古中醫經絡圖的質地 + 現代細胞生物學的精準
//   三層(表皮/真皮/皮下)+ 金色標註線 + 外泌體游走金點
// ═══════════════════════════════════════════════════════════════

const layers = [
  {
    tc: "表皮層",
    en: "Epidermis",
    depth: "0.05–0.1 mm",
    detail: "提亮 · 細緻 · 保濕重建",
    yStart: 14,
    yEnd: 32,
    exosomes: [
      { x: 22, y: 22 },
      { x: 58, y: 25 },
      { x: 82, y: 20 },
    ],
  },
  {
    tc: "真皮層",
    en: "Dermis",
    depth: "1.5–4 mm",
    detail: "膠原訊號傳遞 · 彈潤呵護",
    yStart: 34,
    yEnd: 62,
    exosomes: [
      { x: 18, y: 48 },
      { x: 38, y: 52 },
      { x: 68, y: 45 },
      { x: 88, y: 55 },
    ],
  },
  {
    tc: "皮下屏障",
    en: "Hypodermal Barrier",
    depth: "深層",
    detail: "舒緩紅敏 · 修護乾燥不適",
    yStart: 64,
    yEnd: 88,
    exosomes: [
      { x: 30, y: 76 },
      { x: 72, y: 78 },
    ],
  },
];

export function SkinLayersV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="relative bg-paper-cream paper-texture py-32 md:py-40 px-8 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 章節標題 */}
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
            Anatomy of a{" "}
            <span className="text-leaf-goldDeep">Ritual</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-sans-tc text-ink/60 mt-6 text-lg max-w-xl mx-auto font-light leading-loose"
          >
            外泌體如何一層層,把「修護」的訊息送到該去的地方。
          </motion.p>
        </div>

        {/* 主視覺:橫切面 */}
        <div className="relative mt-12 rounded-none">
          {/* SVG cross-section */}
          <svg viewBox="0 0 1000 500" className="w-full h-auto" preserveAspectRatio="none">
            <defs>
              <linearGradient id="skin-epidermis" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBEBD8" />
                <stop offset="100%" stopColor="#F4D6BF" />
              </linearGradient>
              <linearGradient id="skin-dermis" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F2DDCD" />
                <stop offset="100%" stopColor="#CCA08A" />
              </linearGradient>
              <linearGradient id="skin-hypodermis" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E6C8BB" />
                <stop offset="100%" stopColor="#B58575" />
              </linearGradient>
            </defs>

            {/* 3 skin layers */}
            {layers.map((layer, i) => {
              const yTop = (layer.yStart / 100) * 500;
              const yBot = (layer.yEnd / 100) * 500;
              const gradients = ["skin-epidermis", "skin-dermis", "skin-hypodermis"];
              return (
                <motion.rect
                  key={layer.en}
                  x={0}
                  y={yTop}
                  width={1000}
                  height={yBot - yTop}
                  fill={`url(#${gradients[i]})`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={inView ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: `center ${(yTop + yBot) / 2}px` }}
                />
              );
            })}

            {/* Gold hairline separators */}
            {[32, 62].map((y, i) => (
              <motion.line
                key={i}
                x1={0}
                y1={(y / 100) * 500}
                x2={1000}
                y2={(y / 100) * 500}
                stroke="#C9A46B"
                strokeWidth={0.8}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.6, delay: 0.9 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}

            {/* Exosome dots */}
            {layers.flatMap((layer, li) =>
              layer.exosomes.map((exo, ei) => {
                const cx = (exo.x / 100) * 1000;
                const cy = (exo.y / 100) * 500;
                return (
                  <motion.g key={`${li}-${ei}`}>
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#C9A46B"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        inView
                          ? {
                              opacity: [0, 0.85, 0.6],
                              scale: [0, 1.1, 1],
                              y: [0, -4, 0],
                            }
                          : {}
                      }
                      transition={{
                        opacity: { duration: 1, delay: 1.5 + (li * 0.15 + ei * 0.08) },
                        scale: { duration: 0.8, delay: 1.5 + (li * 0.15 + ei * 0.08) },
                        y: { duration: 4 + ei * 0.4, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                      }}
                    />
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill="none"
                      stroke="#C9A46B"
                      strokeWidth={0.6}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        inView ? { opacity: [0, 0.4, 0], scale: [1, 2, 1] } : {}
                      }
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: 1.5 + (li * 0.15 + ei * 0.08),
                      }}
                    />
                  </motion.g>
                );
              })
            )}
          </svg>

          {/* Layer labels — 浮在右側 */}
          <div className="absolute inset-0 pointer-events-none">
            {layers.map((layer, i) => {
              const yCenter = (layer.yStart + layer.yEnd) / 2;
              return (
                <motion.div
                  key={layer.en}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.9, delay: 1.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-4 md:right-8 pointer-events-auto"
                  style={{ top: `${yCenter}%`, transform: "translateY(-50%)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-leaf-gold" />
                    <div>
                      <p className="font-elegant italic text-leaf-goldDeep text-[0.7rem] tracking-[0.4em] uppercase mb-1">
                        {layer.en}
                      </p>
                      <h3 className="font-serif-tc text-ink text-xl md:text-2xl font-medium">
                        {layer.tc}
                      </h3>
                      <p className="font-sans-tc text-ink/55 text-xs mt-1">
                        {layer.depth} · {layer.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
