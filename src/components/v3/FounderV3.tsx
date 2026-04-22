"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════════
//   FounderV3 — The Atelier
//   Moli Chou CEO 為主角(放大肖像),其他 4 位團隊在下方橫排
//   灰階 → 彩色 on hover,金塵紋理疊加
// ═══════════════════════════════════════════════════════════════

const ceo = {
  name: "周沫璃",
  en: "Moli Chou",
  title: "執行長 · Chief Executive Officer",
  img: "/images/653613_0.jpg",
  quote:
    "我們不想說服妳變美。我們希望有一天,妳會因為記得怎麼愛自己,而重新愛上自己的模樣。",
};

const team = [
  { name: "Louis Shieh", title: "秘書長", en: "Secretary General", img: "/images/41509_0.jpg" },
  { name: "林于喬", title: "護理師 · 特助", en: "R.N. / Executive Assistant", img: "/images/42701_0.jpg" },
  { name: "邱婕玲", title: "南區業務協理", en: "Regional Director · South", img: "/images/42702_0.jpg" },
  { name: "黃揚仁", title: "中區業務協理", en: "Regional Director · Central", img: "/images/42708_0.jpg" },
];

export function FounderV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="relative bg-paper-cream paper-texture py-32 md:py-40 px-8 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif-tc text-vermillion/85 text-sm tracking-[0.55em] mb-4"
          >
            柒 · 工坊
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-ink text-[clamp(2.5rem,6vw,4.5rem)] leading-tight"
          >
            The Atelier
          </motion.h2>
        </div>

        {/* CEO 主角 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center mb-24">
          {/* 肖像 with gold ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] max-w-[420px] mx-auto lg:mx-0"
          >
            {/* Gold ring frame */}
            <div
              className="absolute inset-0 border-2 border-leaf-gold/80 pointer-events-none"
              style={{ borderRadius: "2px", transform: "translate(8px, 8px)" }}
            />
            <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: "2px" }}>
              <Image
                src={ceo.img}
                alt={ceo.name}
                fill
                className="object-cover filter contrast-[0.95] saturate-[0.92] hover:saturate-100 transition-all duration-700"
              />
              {/* Gold wash */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(201,164,107,0.18) 0%, transparent 50%, rgba(184,50,44,0.08) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>

            {/* Red seal signature bottom-right */}
            <motion.div
              initial={{ opacity: 0, scale: 1.4, rotate: -8 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: -4 } : {}}
              transition={{ duration: 0.9, delay: 1.4, ease: [0.3, 1.4, 0.5, 1] }}
              className="absolute -bottom-4 -right-4 w-16 h-16 bg-vermillion flex items-center justify-center"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23s)'/></svg>")`,
                backgroundBlendMode: "overlay",
                borderRadius: "2px",
                boxShadow: "0 3px 14px rgba(184,50,44,0.4)",
              }}
            >
              <span className="font-serif-tc text-paper-cream text-2xl font-bold">璃</span>
            </motion.div>
          </motion.div>

          {/* Quote */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="font-elegant italic text-vermillion text-5xl md:text-6xl leading-none mb-6"
            >
              &ldquo;
            </motion.p>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-tc text-ink text-xl md:text-2xl leading-[1.85] font-normal mb-10"
            >
              {ceo.quote}
            </motion.blockquote>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-px bg-leaf-gold mb-6 origin-left"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <p className="font-elegant italic text-leaf-goldDeep text-[0.7rem] tracking-[0.4em] uppercase mb-1">
                {ceo.en}
              </p>
              <h3 className="font-serif-tc text-ink text-2xl font-medium mb-1">{ceo.name}</h3>
              <p className="font-sans-tc text-ink/55 text-sm tracking-wider">{ceo.title}</p>
            </motion.div>
          </div>
        </div>

        {/* 金色分隔線 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, delay: 1.5 }}
          className="w-full max-w-md mx-auto h-px bg-leaf-gold/50 origin-center mb-16"
        />

        {/* Team grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 1.7 } },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {team.map((m) => (
            <motion.div
              key={m.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4" style={{ borderRadius: "2px" }}>
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-cover filter grayscale contrast-[0.95] group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700"
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(165deg, rgba(201,164,107,0.22), transparent 60%)",
                    mixBlendMode: "multiply",
                  }}
                />
                <div
                  className="absolute inset-0 border border-leaf-gold/0 group-hover:border-leaf-gold/50 transition-colors duration-500 pointer-events-none"
                  style={{ borderRadius: "2px" }}
                />
              </div>
              <p className="font-elegant italic text-leaf-goldDeep text-[0.62rem] tracking-[0.35em] uppercase mb-1">
                {m.en}
              </p>
              <h4 className="font-serif-tc text-ink text-base font-medium mb-0.5">{m.name}</h4>
              <p className="font-sans-tc text-ink/55 text-xs tracking-wider">{m.title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
