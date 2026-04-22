"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// ═══════════════════════════════════════════════════════════════
//   CertificateV3 — 印章牆 Seal Wall
//   3×2 grid of credentials, each card with:
//   • paper-100 bg + 1px gold hairline border
//   • Tiny vermillion corner seal with patent number
//   • Hover: lift 8px, gold border intensifies
// ═══════════════════════════════════════════════════════════════

const certs = [
  {
    img: "/images/660081_0.jpg",
    title: "INCI 國際認證",
    en: "INCI Certification",
    code: "40148",
    region: "Global",
  },
  {
    img: "/images/660174_0.jpg",
    title: "衛福部醫療器材",
    en: "TFDA Medical Device",
    code: "008446",
    region: "Taiwan",
  },
  {
    img: "/images/660083_0.jpg",
    title: "中國發明專利",
    en: "China Patent",
    code: "CN",
    region: "China",
  },
  {
    img: "/images/660086_0.jpg",
    title: "韓國發明專利",
    en: "Korea Patent",
    code: "KR",
    region: "Korea",
  },
  {
    img: "/images/660082_0.jpg",
    title: "INCI Mono ID",
    en: "Mono Ingredient ID",
    code: "Verified",
    region: "Global",
  },
  {
    img: "/images/660084_0.jpg",
    title: "專利證書",
    en: "Invention Patent",
    code: "CN-II",
    region: "China",
  },
];

export function CertificateV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="relative bg-paper-warm paper-texture py-32 md:py-40 px-8 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif-tc text-vermillion/85 text-sm tracking-[0.55em] mb-4"
          >
            陸 · 印章牆
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-elegant italic text-ink text-[clamp(2.5rem,6vw,4.5rem)] leading-tight"
          >
            Sealed &amp; Verified
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-sans-tc text-ink/60 mt-6 text-lg max-w-xl mx-auto font-light leading-loose"
          >
            每一張認證,都是一次被凝視的承諾。
          </motion.p>
        </div>

        {/* Seal Wall Grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8"
        >
          {certs.map((cert) => (
            <motion.div
              key={cert.title}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              className="group relative bg-paper-cream border border-leaf-gold/30 hover:border-leaf-gold/70 transition-colors duration-500"
              style={{ borderRadius: "2px" }}
            >
              {/* Vermillion corner seal */}
              <div className="absolute -top-3 -right-3 z-10">
                <div
                  className="w-11 h-11 bg-vermillion flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23s)'/></svg>")`,
                    backgroundBlendMode: "overlay",
                    borderRadius: "2px",
                    boxShadow: "0 2px 8px rgba(184,50,44,0.35)",
                  }}
                >
                  <span className="font-serif-tc text-paper-cream text-[0.6rem] tracking-widest font-bold">
                    {cert.region.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={cert.img}
                  alt={cert.title}
                  fill
                  className="object-cover filter contrast-[0.92] saturate-[0.88] group-hover:contrast-100 group-hover:saturate-100 transition-all duration-700"
                />
                {/* Gold wash overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,164,107,0.2) 0%, transparent 40%, transparent 60%, rgba(184,50,44,0.1) 100%)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-5 md:p-6 border-t border-leaf-gold/20">
                <p className="font-elegant italic text-leaf-goldDeep text-[0.62rem] tracking-[0.35em] uppercase mb-1.5">
                  {cert.en}
                </p>
                <h3 className="font-serif-tc text-ink text-base md:text-lg font-medium mb-1">
                  {cert.title}
                </h3>
                <p className="font-sans-tc text-ink/55 text-xs tracking-wider">
                  {cert.code}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
