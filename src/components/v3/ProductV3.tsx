"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════════
//   ProductV3 — The Living Vial (Wow #3)
//   • 墨黑底 + 朱砂放射光暈
//   • 產品照: 滑動時 rotateY + scale parallax
//   • 金塵粒子從瓶身向外螺旋發散
//   • 規格:左中文 serif / 右英文 Cormorant italic
// ═══════════════════════════════════════════════════════════════

const specs = [
  { label: "每 1mL 含量", value: "2,000 億", unit: "顆外泌體", en: "Exosomes / mL" },
  { label: "粒徑範圍", value: "76.8–99.4", unit: "nm", en: "Particle Size" },
  { label: "表達標誌物", value: "CD9 · CD63", unit: "", en: "Surface Markers" },
  { label: "製程", value: "CDMO", unit: "全自動化", en: "Automated Pipeline" },
];

export function ProductV3() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-18, 0, 18]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.02, 0.96]);
  const inView = useInView(ref, { once: true, margin: "-150px" });

  // 12 gold dust particles, distributed in a spiral
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    angle: (i / 14) * Math.PI * 2,
    radius: 80 + (i % 3) * 24,
    delay: (i * 0.15) % 2,
  }));

  return (
    <section
      ref={ref}
      id="science"
      className="relative bg-ink py-40 px-8 overflow-hidden"
    >
      {/* 朱砂放射光暈 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 0.3, scale: 1 } : {}}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(184,50,44,0.15) 0%, rgba(91,42,110,0.08) 40%, transparent 70%)",
        }}
      />

      {/* 深茄紫次級光暈 */}
      <div
        className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[120px] pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, #5B2A6E, transparent 70%)" }}
      />

      {/* 金絲裝飾線 */}
      <div className="absolute top-16 left-[12%] w-px h-[28vh] bg-gradient-to-b from-leaf-gold/25 to-transparent z-[2]" />
      <div className="absolute bottom-16 right-[14%] w-px h-[20vh] bg-gradient-to-t from-leaf-gold/20 to-transparent z-[2]" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        {/* ── 左:產品 Living Vial ── */}
        <div className="relative flex items-center justify-center min-h-[520px]">
          {/* 粒子 spiral */}
          {inView &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  x: [0, Math.cos(p.angle) * p.radius, Math.cos(p.angle) * p.radius * 1.8],
                  y: [0, Math.sin(p.angle) * p.radius, Math.sin(p.angle) * p.radius * 1.8],
                  scale: [0.3, 1, 0.4],
                }}
                transition={{
                  duration: 3.2 + (p.id % 4) * 0.3,
                  delay: p.delay + 1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-leaf-goldLight"
                style={{
                  boxShadow: "0 0 8px rgba(230,207,160,0.7)",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

          {/* 瓶身 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateY, scale, perspective: 1200 }}
            className="relative w-full max-w-[380px] aspect-[3/4]"
          >
            <Image
              src="/images/42706_0.jpg"
              alt="I ME SiUPi POWDER 外泌體凍晶"
              fill
              className="object-contain drop-shadow-[0_30px_50px_rgba(184,50,44,0.35)]"
              priority
            />
          </motion.div>

          {/* 瓶底金色基座光 */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 h-6 origin-center pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(201,164,107,0.6) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
        </div>

        {/* ── 右:規格 ── */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif-tc text-vermillion-light/90 text-sm tracking-[0.55em] mb-5"
          >
            伍 · 產品封瓶
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-paper-cream text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] mb-3"
          >
            USC-E
            <span className="text-leaf-gold ml-3">.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif-tc text-paper-cream/85 text-xl tracking-wider mb-10"
          >
            SiUPi POWDER · 外泌體凍晶
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-px bg-leaf-gold mb-10 origin-left"
          />

          {/* Specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-9 gap-x-6">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                <p className="font-elegant italic text-leaf-gold/65 text-[0.7rem] tracking-[0.35em] uppercase mb-2">
                  {spec.en}
                </p>
                <p className="font-sans-tc text-paper-cream/55 text-xs mb-2 tracking-wider">
                  {spec.label}
                </p>
                {/* Bodoni Moda statement face — pro-max Luxury Minimalist recommendation */}
                <p className="font-statement text-paper-cream text-4xl md:text-5xl font-medium leading-[0.95] tracking-tight">
                  {spec.value}
                </p>
                {spec.unit && (
                  <p className="font-sans-tc text-paper-cream/55 text-xs mt-2 tracking-wider">
                    {spec.unit}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* 小字 footnote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-12 font-elegant italic text-paper-cream/35 text-xs tracking-wider leading-loose border-t border-leaf-gold/20 pt-6"
          >
            臍帶間質幹細胞外泌體 · 台中榮總楊孟寅醫師專利技術
            <br />
            Umbilical Mesenchymal Stem Cell-derived Exosomes
          </motion.p>
        </div>
      </div>
    </section>
  );
}
